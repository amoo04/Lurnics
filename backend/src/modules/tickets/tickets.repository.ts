import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { supportTickets, type NewSupportTicketRow } from "../../db/schema.js";

export async function findTickets(
  status: string | undefined,
  priority: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (status) conditions.push(eq(supportTickets.status, status));
  if (priority) conditions.push(eq(supportTickets.priority, priority));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.supportTickets.findMany({
      where,
      limit,
      offset,
      orderBy: desc(supportTickets.createdAt),
      with: { client: true, project: true, assignee: true },
    }),
    db.$count(supportTickets, where),
  ]);

  return { items, total };
}

export async function findTicketById(id: string) {
  return db.query.supportTickets.findFirst({
    where: eq(supportTickets.id, id),
    with: { client: true, project: true, assignee: true },
  });
}

export async function createTicket(input: NewSupportTicketRow) {
  const [row] = await db.insert(supportTickets).values(input).returning();
  return row;
}

export async function updateTicket(id: string, input: Partial<NewSupportTicketRow>) {
  const [row] = await db
    .update(supportTickets)
    .set(input)
    .where(eq(supportTickets.id, id))
    .returning();
  return row;
}

export async function deleteTicket(id: string) {
  await db.delete(supportTickets).where(eq(supportTickets.id, id));
}
