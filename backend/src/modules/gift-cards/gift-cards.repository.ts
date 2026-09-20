import { and, desc, eq, like, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import { giftCards, type NewGiftCardRow } from "../../db/schema.js";

function statusCondition(status: string | undefined): SQL | undefined {
  if (status === "redeemed") return sql`${giftCards.balance} <= 0`;
  if (status === "scheduled") {
    return sql`${giftCards.balance} > 0 AND ${giftCards.activatesAt} IS NOT NULL AND date(${giftCards.activatesAt}) > date('now')`;
  }
  if (status === "expired") {
    return sql`${giftCards.balance} > 0 AND ${giftCards.expiresAt} IS NOT NULL AND date(${giftCards.expiresAt}) < date('now') AND (${giftCards.activatesAt} IS NULL OR date(${giftCards.activatesAt}) <= date('now'))`;
  }
  if (status === "active") {
    return sql`${giftCards.balance} > 0 AND (${giftCards.activatesAt} IS NULL OR date(${giftCards.activatesAt}) <= date('now')) AND (${giftCards.expiresAt} IS NULL OR date(${giftCards.expiresAt}) >= date('now'))`;
  }
  return undefined;
}

export async function createGiftCard(input: NewGiftCardRow) {
  const [row] = await db.insert(giftCards).values(input).returning();
  return row;
}

export async function findGiftCardByCode(businessId: string, code: string) {
  return db.query.giftCards.findFirst({
    where: and(eq(giftCards.businessId, businessId), eq(giftCards.code, code)),
  });
}

export async function findGiftCards(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(giftCards.businessId, businessId)];

  const status_ = statusCondition(status);
  if (status_) conditions.push(status_);

  if (search) {
    conditions.push(
      or(
        like(giftCards.code, `%${search}%`),
        like(giftCards.recipientName, `%${search}%`),
        like(giftCards.recipientEmail, `%${search}%`),
      )!,
    );
  }

  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.giftCards.findMany({ where, limit, offset, orderBy: desc(giftCards.createdAt) }),
    db.$count(giftCards, where),
  ]);

  return { items, total };
}

export async function findGiftCardById(businessId: string, id: string) {
  return db.query.giftCards.findFirst({
    where: and(eq(giftCards.businessId, businessId), eq(giftCards.id, id)),
  });
}

export async function updateGiftCard(businessId: string, id: string, patch: Partial<NewGiftCardRow>) {
  const [row] = await db
    .update(giftCards)
    .set(patch)
    .where(and(eq(giftCards.businessId, businessId), eq(giftCards.id, id)))
    .returning();
  return row;
}

export async function deleteGiftCard(businessId: string, id: string) {
  await db.delete(giftCards).where(and(eq(giftCards.businessId, businessId), eq(giftCards.id, id)));
}

export async function getGiftCardSummary(businessId: string) {
  const [row] = await db
    .select({
      totalSales: sql<number>`coalesce(sum(${giftCards.initialValue}), 0)`,
      totalSold: sql<number>`count(*)`,
      totalRedeemed: sql<number>`coalesce(sum(${giftCards.initialValue} - ${giftCards.balance}), 0)`,
      outstandingBalance: sql<number>`coalesce(sum(${giftCards.balance}), 0)`,
    })
    .from(giftCards)
    .where(eq(giftCards.businessId, businessId));

  return row;
}
