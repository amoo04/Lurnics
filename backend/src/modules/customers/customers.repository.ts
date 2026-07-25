import { and, desc, eq, isNotNull, like, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { customers, orders, type NewCustomerRow } from "../../db/schema.js";

export async function createCustomer(input: NewCustomerRow) {
  const [row] = await db.insert(customers).values(input).returning();
  return row;
}

export async function findCustomerByEmail(businessId: string, email: string) {
  return db.query.customers.findFirst({
    where: and(eq(customers.businessId, businessId), eq(customers.email, email)),
  });
}

export async function findCustomers(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(customers.businessId, businessId)];
  if (status) conditions.push(eq(customers.status, status));
  if (search) {
    conditions.push(
      or(
        like(customers.name, `%${search}%`),
        like(customers.email, `%${search}%`),
        like(customers.phone, `%${search}%`),
      )!,
    );
  }
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.customers.findMany({ where, limit, offset, orderBy: desc(customers.createdAt) }),
    db.$count(customers, where),
  ]);

  return { items, total };
}

export async function findCustomerById(businessId: string, id: string) {
  return db.query.customers.findFirst({
    where: and(eq(customers.businessId, businessId), eq(customers.id, id)),
  });
}

export async function updateCustomer(businessId: string, id: string, patch: Partial<NewCustomerRow>) {
  const [row] = await db
    .update(customers)
    .set(patch)
    .where(and(eq(customers.businessId, businessId), eq(customers.id, id)))
    .returning();
  return row;
}

export async function deleteCustomer(businessId: string, id: string) {
  await db.delete(customers).where(and(eq(customers.businessId, businessId), eq(customers.id, id)));
}

export async function listCustomerEmails(businessId: string): Promise<string[]> {
  const rows = await db
    .select({ email: customers.email })
    .from(customers)
    .where(eq(customers.businessId, businessId));
  return rows.map((r) => r.email);
}

export interface CustomerOrderAggregate {
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export async function getCustomerOrderAggregates(businessId: string): Promise<CustomerOrderAggregate[]> {
  const rows = await db
    .select({
      email: orders.customerEmail,
      orderCount: sql<number>`count(*)`,
      totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
      lastOrderAt: sql<string | null>`max(${orders.createdAt})`,
    })
    .from(orders)
    .where(and(eq(orders.businessId, businessId), isNotNull(orders.customerEmail)))
    .groupBy(orders.customerEmail);

  return rows.filter((r): r is CustomerOrderAggregate => r.email !== null);
}

export async function getCustomerSummary(businessId: string) {
  const [row] = await db
    .select({
      totalCustomers: sql<number>`count(*)`,
      activeCustomers: sql<number>`sum(case when ${customers.status} = 'active' then 1 else 0 end)`,
      newCustomers: sql<number>`sum(case when ${customers.createdAt} >= datetime('now', '-30 days') then 1 else 0 end)`,
    })
    .from(customers)
    .where(eq(customers.businessId, businessId));

  return row;
}
