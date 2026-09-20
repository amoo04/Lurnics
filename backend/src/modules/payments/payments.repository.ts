import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { payments, type NewPaymentRow } from "../../db/schema.js";

export async function findPayments(
  status: string | undefined,
  invoiceId: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (status) conditions.push(eq(payments.status, status));
  if (invoiceId) conditions.push(eq(payments.invoiceId, invoiceId));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.payments.findMany({
      where,
      limit,
      offset,
      orderBy: desc(payments.paymentDate),
      with: { invoice: { with: { client: true, project: true } } },
    }),
    db.$count(payments, where),
  ]);

  return { items, total };
}

export async function findPaymentById(id: string) {
  return db.query.payments.findFirst({
    where: eq(payments.id, id),
    with: { invoice: { with: { client: true, project: true } } },
  });
}

export async function createPayment(input: NewPaymentRow) {
  const [row] = await db.insert(payments).values(input).returning();
  return row;
}

export async function updatePayment(id: string, input: Partial<NewPaymentRow>) {
  const [row] = await db.update(payments).set(input).where(eq(payments.id, id)).returning();
  return row;
}

export async function deletePayment(id: string) {
  await db.delete(payments).where(eq(payments.id, id));
}
