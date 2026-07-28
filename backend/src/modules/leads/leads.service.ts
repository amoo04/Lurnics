import { sendEmail, leadsEmailFrom } from "../../lib/email.js";
import { leadReplyEmail } from "../../lib/email-templates.js";
import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import { notify } from "../notifications/notifications.service.js";
import { findActiveUserIds } from "../users/users.repository.js";
import {
  createLead,
  deleteLead,
  findLeadById,
  findLeads,
  updateLeadStatus,
} from "./leads.repository.js";
import type { CreateLeadInput, UpdateLeadInput } from "./leads.schema.js";

export interface SendLeadEmailInput {
  to: string;
  subject: string;
  body: string;
}

export async function submitLead(input: CreateLeadInput) {
  const lead = await createLead({ ...input, source: input.source ?? "website" });

  const userIds = await findActiveUserIds();
  await Promise.all(
    userIds.map((userId) =>
      notify(
        userId,
        "New lead",
        `${lead.contactPerson} from ${lead.companyName} submitted an inquiry via ${lead.source ?? "website"}.`,
        "lead",
      ),
    ),
  );

  // No automatic confirmation email to the lead here: Cloudflare's Send
  // Email binding can only deliver to info@lurnics.com (see lib/email.ts),
  // so it can't reach an arbitrary lead's address. Admins are notified
  // in-app above and can reply manually via sendLeadEmail once a real
  // transactional email provider is connected for outbound-to-anyone mail.
  return lead;
}

export async function listLeads(query: { page?: string; limit?: string; status?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findLeads(query.status, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getLead(id: string) {
  const lead = await findLeadById(id);
  if (!lead) throw new NotFoundError("Lead not found");
  return lead;
}

export async function changeLeadStatus(userId: string, id: string, input: UpdateLeadInput) {
  await getLead(id);
  const lead = await updateLeadStatus(id, input.status);
  await logActivity(userId, "update", "lead", id);
  return lead;
}

export async function removeLead(userId: string, id: string) {
  await getLead(id);
  await deleteLead(id);
  await logActivity(userId, "delete", "lead", id);
}

export async function sendLeadEmail({ to, subject, body }: SendLeadEmailInput) {
  const { html } = leadReplyEmail({ body });
  return sendEmail({ from: leadsEmailFrom(), to, subject, text: body, html });
}
