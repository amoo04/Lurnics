import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  customers,
  emailCampaigns,
  emailSends,
  orders,
  type NewEmailCampaignRow,
  type NewEmailSendRow,
} from "../../db/schema.js";

export async function createCampaign(input: NewEmailCampaignRow) {
  const [row] = await db.insert(emailCampaigns).values(input).returning();
  return row;
}

export async function findCampaigns(businessId: string, limit: number, offset: number) {
  const where = eq(emailCampaigns.businessId, businessId);
  const [items, total] = await Promise.all([
    db.query.emailCampaigns.findMany({ where, limit, offset, orderBy: desc(emailCampaigns.createdAt) }),
    db.$count(emailCampaigns, where),
  ]);
  return { items, total };
}

export async function findCampaignById(businessId: string, id: string) {
  return db.query.emailCampaigns.findFirst({
    where: and(eq(emailCampaigns.businessId, businessId), eq(emailCampaigns.id, id)),
  });
}

export async function markCampaignSent(id: string) {
  const [row] = await db
    .update(emailCampaigns)
    .set({ status: "sent", sentAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(emailCampaigns.id, id))
    .returning();
  return row;
}

export async function insertSends(rows: NewEmailSendRow[]) {
  if (rows.length === 0) return;
  await db.insert(emailSends).values(rows);
}

export async function getSendStats(campaignId: string) {
  const [row] = await db
    .select({
      sent: sql<number>`count(*)`,
      opened: sql<number>`sum(case when ${emailSends.openedAt} is not null then 1 else 0 end)`,
      clicked: sql<number>`sum(case when ${emailSends.clickedAt} is not null then 1 else 0 end)`,
    })
    .from(emailSends)
    .where(eq(emailSends.campaignId, campaignId));
  return row;
}

// A send "converts" if that recipient placed a real order after receiving
// the email - a genuine heuristic tied to real orders, not a guess.
export async function getCampaignConversions(businessId: string, campaignId: string) {
  const [row] = await db
    .select({
      conversions: sql<number>`count(distinct ${orders.id})`,
      revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
    })
    .from(emailSends)
    .innerJoin(
      orders,
      and(
        eq(orders.businessId, businessId),
        eq(orders.customerEmail, emailSends.customerEmail),
        sql`${orders.createdAt} > ${emailSends.sentAt}`,
      ),
    )
    .where(eq(emailSends.campaignId, campaignId));
  return row;
}

export async function getBusinessEmailSummary(businessId: string) {
  const [row] = await db
    .select({
      sent: sql<number>`count(*)`,
      opened: sql<number>`sum(case when ${emailSends.openedAt} is not null then 1 else 0 end)`,
      clicked: sql<number>`sum(case when ${emailSends.clickedAt} is not null then 1 else 0 end)`,
    })
    .from(emailSends)
    .where(eq(emailSends.businessId, businessId));
  return row;
}

export async function getBusinessConversions(businessId: string) {
  const [row] = await db
    .select({
      conversions: sql<number>`count(distinct ${orders.id})`,
      revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
    })
    .from(emailSends)
    .innerJoin(
      orders,
      and(
        eq(orders.businessId, businessId),
        eq(orders.customerEmail, emailSends.customerEmail),
        sql`${orders.createdAt} > ${emailSends.sentAt}`,
      ),
    )
    .where(eq(emailSends.businessId, businessId));
  return row;
}

export async function getUnsubscribeCount(businessId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers)
    .where(and(eq(customers.businessId, businessId), eq(customers.emailOptOut, true)));
  return row?.count ?? 0;
}

export async function findCampaignRecipients(businessId: string, audience: string) {
  const conditions = [eq(customers.businessId, businessId), eq(customers.emailOptOut, false)];
  if (audience === "active_customers") {
    conditions.push(eq(customers.status, "active"));
  } else {
    conditions.push(sql`${customers.status} != 'blocked'`);
  }
  return db
    .select({ email: customers.email })
    .from(customers)
    .where(and(...conditions));
}
