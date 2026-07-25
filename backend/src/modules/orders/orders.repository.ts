import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders, type NewOrderRow } from "../../db/schema.js";

export async function createOrder(input: NewOrderRow) {
  const [row] = await db.insert(orders).values(input).returning();
  return row;
}

export async function findOrders(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(orders.businessId, businessId)];
  if (status) conditions.push(eq(orders.fulfillmentStatus, status));
  if (search) {
    conditions.push(
      or(
        like(orders.orderNumber, `%${search}%`),
        like(orders.customerName, `%${search}%`),
        like(orders.customerEmail, `%${search}%`),
      )!,
    );
  }
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.orders.findMany({ where, limit, offset, orderBy: desc(orders.createdAt) }),
    db.$count(orders, where),
  ]);

  return { items, total };
}

export async function findOrderById(businessId: string, id: string) {
  return db.query.orders.findFirst({
    where: and(eq(orders.businessId, businessId), eq(orders.id, id)),
  });
}

export async function updateOrderStatus(
  businessId: string,
  id: string,
  patch: Partial<Pick<NewOrderRow, "paymentStatus" | "fulfillmentStatus">>,
) {
  const [row] = await db
    .update(orders)
    .set(patch)
    .where(and(eq(orders.businessId, businessId), eq(orders.id, id)))
    .returning();
  return row;
}

export async function getOrderSummary(businessId: string) {
  const [row] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
    })
    .from(orders)
    .where(eq(orders.businessId, businessId));

  return row;
}

export async function getOrderStatusCounts(businessId: string) {
  return db
    .select({ status: orders.fulfillmentStatus, count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.businessId, businessId))
    .groupBy(orders.fulfillmentStatus);
}
