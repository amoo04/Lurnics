import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { invoiceLineItems, invoices, type NewInvoiceRow } from "../../db/schema.js";

export interface LineItemInput {
  description: string;
  amount: number;
}

function subtotalOf(lineItems: LineItemInput[]) {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

export async function findInvoices(
  status: string | undefined,
  clientId: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (status) conditions.push(eq(invoices.status, status));
  if (clientId) conditions.push(eq(invoices.clientId, clientId));
  if (search) conditions.push(or(like(invoices.invoiceNumber, `%${search}%`), like(invoices.notes, `%${search}%`)));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.invoices.findMany({
      where,
      limit,
      offset,
      orderBy: desc(invoices.createdAt),
      with: { client: true, project: true, payments: true, lineItems: true },
    }),
    db.$count(invoices, where),
  ]);

  return { items, total };
}

export async function findInvoiceById(id: string) {
  return db.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: { client: true, project: true, payments: true, lineItems: true },
  });
}

export async function findInvoiceByNumber(invoiceNumber: string) {
  return db.query.invoices.findFirst({ where: eq(invoices.invoiceNumber, invoiceNumber) });
}

export async function createInvoiceWithLineItems(
  input: Omit<NewInvoiceRow, "amount">,
  lineItems: LineItemInput[],
) {
  return db.transaction(async (tx) => {
    const [invoice] = await tx
      .insert(invoices)
      .values({ ...input, amount: subtotalOf(lineItems) })
      .returning();

    await tx.insert(invoiceLineItems).values(lineItems.map((item) => ({ ...item, invoiceId: invoice.id })));

    return invoice;
  });
}

export async function updateInvoiceWithLineItems(
  id: string,
  input: Partial<Omit<NewInvoiceRow, "amount">>,
  lineItems: LineItemInput[] | undefined,
) {
  return db.transaction(async (tx) => {
    const values: Partial<NewInvoiceRow> = { ...input };
    if (lineItems) {
      values.amount = subtotalOf(lineItems);
      await tx.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id));
      await tx.insert(invoiceLineItems).values(lineItems.map((item) => ({ ...item, invoiceId: id })));
    }

    const [invoice] = await tx.update(invoices).set(values).where(eq(invoices.id, id)).returning();
    return invoice;
  });
}

export async function deleteInvoice(id: string) {
  await db.delete(invoices).where(eq(invoices.id, id));
}
