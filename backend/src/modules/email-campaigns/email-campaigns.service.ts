import { emailFrom, sendEmail } from "../../lib/email.js";
import { getBindings } from "../../lib/env.js";
import { NotFoundError, ValidationError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import type { NewEmailSendRow } from "../../db/schema.js";
import {
  createCampaign,
  findCampaignById,
  findCampaignRecipients,
  findCampaigns,
  getBusinessConversions,
  getBusinessEmailSummary,
  getCampaignConversions,
  getSendStats,
  getUnsubscribeCount,
  insertSends,
  markCampaignSent,
} from "./email-campaigns.repository.js";
import type { CreateCampaignInput } from "./email-campaigns.schema.js";

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

interface SendStats {
  sent: number;
  opened: number;
  clicked: number;
}

interface ConversionStats {
  conversions: number;
  revenue: number;
}

function withStats<T extends object>(campaign: T, sendStats: SendStats | undefined, conv: ConversionStats | undefined) {
  const sent = sendStats?.sent ?? 0;
  const opened = sendStats?.opened ?? 0;
  const clicked = sendStats?.clicked ?? 0;

  return {
    ...campaign,
    sent,
    openRate: sent > 0 ? opened / sent : 0,
    clickRate: sent > 0 ? clicked / sent : 0,
    conversions: conv?.conversions ?? 0,
    revenue: conv?.revenue ?? 0,
  };
}

export async function addCampaign(businessId: string, input: CreateCampaignInput) {
  return createCampaign({
    businessId,
    name: input.name,
    subject: input.subject,
    html: input.html,
    text: input.text,
    ctaUrl: input.ctaUrl,
    audience: input.audience ?? "all_customers",
  });
}

export async function listCampaigns(businessId: string, query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findCampaigns(businessId, pagination.limit, pagination.offset);

  const withDetails = await Promise.all(
    items.map(async (campaign) => {
      const [sendStats, conv] = await Promise.all([
        getSendStats(campaign.id),
        getCampaignConversions(businessId, campaign.id),
      ]);
      return withStats(campaign, sendStats, conv);
    }),
  );

  return paginatedResult(withDetails, total, pagination);
}

export async function getCampaign(businessId: string, id: string) {
  const campaign = await findCampaignById(businessId, id);
  if (!campaign) throw new NotFoundError("Campaign not found");

  const [sendStats, conv] = await Promise.all([getSendStats(id), getCampaignConversions(businessId, id)]);
  return withStats(campaign, sendStats, conv);
}

export async function sendCampaign(businessId: string, id: string) {
  const campaign = await findCampaignById(businessId, id);
  if (!campaign) throw new NotFoundError("Campaign not found");
  if (campaign.status !== "draft") throw new ValidationError("Campaign has already been sent");

  const recipients = await findCampaignRecipients(businessId, campaign.audience);
  if (recipients.length === 0) throw new ValidationError("No customers to send to for this audience");

  const apiUrl = getBindings().API_URL ?? "http://localhost:3001";
  const from = emailFrom();
  const sends: NewEmailSendRow[] = [];

  for (const recipient of recipients) {
    const token = randomToken();
    const pixelUrl = `${apiUrl}/api/track/open/${token}`;
    const unsubscribeUrl = `${apiUrl}/api/track/unsubscribe/${token}`;
    // The click-tracking route resolves its own redirect target from the
    // campaign's stored ctaUrl (see email-tracking.routes.ts), so no `url`
    // query param is needed - or trusted - here.
    const ctaLink = campaign.ctaUrl ? `${apiUrl}/api/track/click/${token}` : "#";

    const html =
      campaign.html.replaceAll("{{CTA_LINK}}", ctaLink).replaceAll("{{UNSUBSCRIBE_LINK}}", unsubscribeUrl) +
      `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none" />`;
    const text = campaign.text
      .replaceAll("{{CTA_LINK}}", campaign.ctaUrl ?? "")
      .replaceAll("{{UNSUBSCRIBE_LINK}}", unsubscribeUrl);

    await sendEmail({ from, to: recipient.email, subject: campaign.subject, text, html });
    sends.push({ campaignId: id, businessId, customerEmail: recipient.email, trackingToken: token });
  }

  await insertSends(sends);
  await markCampaignSent(id);

  return getCampaign(businessId, id);
}

export async function getEmailStats(businessId: string) {
  const [summary, conv, unsubscribes] = await Promise.all([
    getBusinessEmailSummary(businessId),
    getBusinessConversions(businessId),
    getUnsubscribeCount(businessId),
  ]);

  const sent = summary?.sent ?? 0;
  const opened = summary?.opened ?? 0;
  const clicked = summary?.clicked ?? 0;

  return {
    sent,
    openRate: sent > 0 ? opened / sent : 0,
    clickRate: sent > 0 ? clicked / sent : 0,
    conversions: conv?.conversions ?? 0,
    revenue: conv?.revenue ?? 0,
    unsubscribes,
  };
}
