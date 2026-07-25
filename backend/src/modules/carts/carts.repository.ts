import { and, desc, eq, isNull, like, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import { carts, cartItems, orders, type NewCartRow, type NewCartItemRow } from "../../db/schema.js";

export const ABANDONED_AFTER_HOURS = 1;
const ABANDONED_WINDOW = sql.raw(`'-${ABANDONED_AFTER_HOURS} hours'`);

function statusCondition(status: string | undefined): SQL | undefined {
  if (status === "recovered") return sql`${carts.convertedOrderId} IS NOT NULL`;
  if (status === "abandoned") {
    return sql`${carts.convertedOrderId} IS NULL AND ${carts.lastActivityAt} <= datetime('now', ${ABANDONED_WINDOW})`;
  }
  if (status === "active") {
    return sql`${carts.convertedOrderId} IS NULL AND ${carts.lastActivityAt} > datetime('now', ${ABANDONED_WINDOW})`;
  }
  return undefined;
}

export async function createCart(cart: NewCartRow, items: Omit<NewCartItemRow, "cartId">[]) {
  const [row] = await db.insert(carts).values(cart).returning();
  await db.insert(cartItems).values(items.map((item) => ({ ...item, cartId: row.id })));
  return row;
}

export async function findCartItems(cartId: string) {
  return db.query.cartItems.findMany({ where: eq(cartItems.cartId, cartId) });
}

export async function findCarts(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(carts.businessId, businessId)];
  const statusCond = statusCondition(status);
  if (statusCond) conditions.push(statusCond);
  if (search) {
    conditions.push(or(like(carts.customerName, `%${search}%`), like(carts.customerEmail, `%${search}%`))!);
  }
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.carts.findMany({ where, limit, offset, orderBy: desc(carts.lastActivityAt) }),
    db.$count(carts, where),
  ]);

  return { items, total };
}

export async function findCartById(businessId: string, id: string) {
  return db.query.carts.findFirst({ where: and(eq(carts.businessId, businessId), eq(carts.id, id)) });
}

export async function findOpenCartByEmail(businessId: string, customerEmail: string) {
  return db.query.carts.findFirst({
    where: and(
      eq(carts.businessId, businessId),
      eq(carts.customerEmail, customerEmail),
      isNull(carts.convertedOrderId),
    ),
    orderBy: desc(carts.lastActivityAt),
  });
}

export async function convertCart(id: string, orderId: string) {
  const [row] = await db
    .update(carts)
    .set({ convertedOrderId: orderId, convertedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(carts.id, id))
    .returning();
  return row;
}

export async function getCartSummary(businessId: string) {
  const [row] = await db
    .select({
      abandonedCarts: sql<number>`sum(case when ${carts.convertedOrderId} is null and ${carts.lastActivityAt} <= datetime('now', ${ABANDONED_WINDOW}) then 1 else 0 end)`,
      recoveredCarts: sql<number>`sum(case when ${carts.convertedOrderId} is not null then 1 else 0 end)`,
      totalCarts: sql<number>`count(*)`,
    })
    .from(carts)
    .where(eq(carts.businessId, businessId));

  return row;
}

export async function getRecoveredRevenue(businessId: string) {
  const [row] = await db
    .select({ revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)` })
    .from(carts)
    .innerJoin(orders, eq(carts.convertedOrderId, orders.id))
    .where(eq(carts.businessId, businessId));

  return row?.revenue ?? 0;
}
