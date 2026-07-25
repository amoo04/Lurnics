import { and, desc, eq, like, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import { discounts, type NewDiscountRow } from "../../db/schema.js";

function statusCondition(status: string | undefined): SQL | undefined {
  if (status === "disabled") return eq(discounts.isActive, false);
  if (status === "scheduled") {
    return sql`${discounts.isActive} = 1 AND date(${discounts.startDate}) > date('now')`;
  }
  if (status === "expired") {
    return sql`${discounts.isActive} = 1 AND ${discounts.endDate} IS NOT NULL AND date(${discounts.endDate}) < date('now')`;
  }
  if (status === "active") {
    return sql`${discounts.isActive} = 1 AND date(${discounts.startDate}) <= date('now') AND (${discounts.endDate} IS NULL OR date(${discounts.endDate}) >= date('now'))`;
  }
  return undefined;
}

export async function createDiscount(input: NewDiscountRow) {
  const [row] = await db.insert(discounts).values(input).returning();
  return row;
}

export async function findDiscountByCode(businessId: string, code: string) {
  return db.query.discounts.findFirst({
    where: and(eq(discounts.businessId, businessId), eq(discounts.code, code)),
  });
}

export async function findDiscounts(
  businessId: string,
  type: string | undefined,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(discounts.businessId, businessId)];
  if (type) conditions.push(eq(discounts.type, type));

  const status_ = statusCondition(status);
  if (status_) conditions.push(status_);

  if (search) {
    conditions.push(or(like(discounts.code, `%${search}%`), like(discounts.description, `%${search}%`))!);
  }

  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.discounts.findMany({ where, limit, offset, orderBy: desc(discounts.createdAt) }),
    db.$count(discounts, where),
  ]);

  return { items, total };
}

export async function findDiscountById(businessId: string, id: string) {
  return db.query.discounts.findFirst({
    where: and(eq(discounts.businessId, businessId), eq(discounts.id, id)),
  });
}

export async function updateDiscount(businessId: string, id: string, patch: Partial<NewDiscountRow>) {
  const [row] = await db
    .update(discounts)
    .set(patch)
    .where(and(eq(discounts.businessId, businessId), eq(discounts.id, id)))
    .returning();
  return row;
}

export async function deleteDiscount(businessId: string, id: string) {
  await db.delete(discounts).where(and(eq(discounts.businessId, businessId), eq(discounts.id, id)));
}

export async function getDiscountSummary(businessId: string) {
  const [row] = await db
    .select({
      totalDiscounts: sql<number>`count(*)`,
      activeDiscounts: sql<number>`sum(case when ${discounts.isActive} = 1 and date(${discounts.startDate}) <= date('now') and (${discounts.endDate} is null or date(${discounts.endDate}) >= date('now')) then 1 else 0 end)`,
      codeDiscounts: sql<number>`sum(case when ${discounts.type} = 'code' then 1 else 0 end)`,
      automaticDiscounts: sql<number>`sum(case when ${discounts.type} = 'automatic' then 1 else 0 end)`,
      totalUses: sql<number>`coalesce(sum(${discounts.usageCount}), 0)`,
    })
    .from(discounts)
    .where(eq(discounts.businessId, businessId));

  return row;
}
