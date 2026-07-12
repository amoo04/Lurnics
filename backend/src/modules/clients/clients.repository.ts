import { and, desc, eq, isNull, like, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { clients, type NewClientRow } from "../../db/schema.js";

export async function findClients(
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [isNull(clients.deletedAt)];
  if (status) conditions.push(eq(clients.status, status));
  if (search) conditions.push(like(clients.companyName, `%${search}%`));
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.clients.findMany({ where, limit, offset, orderBy: desc(clients.createdAt) }),
    db.$count(clients, where),
  ]);

  return { items, total };
}

export async function findClientById(id: string) {
  return db.query.clients.findFirst({
    where: and(eq(clients.id, id), isNull(clients.deletedAt)),
  });
}

export async function findClientByEmail(email: string) {
  return db.query.clients.findFirst({
    where: and(eq(clients.email, email), isNull(clients.deletedAt)),
  });
}

export async function createClient(input: NewClientRow) {
  const [row] = await db.insert(clients).values(input).returning();
  return row;
}

export async function updateClient(id: string, input: Partial<NewClientRow>) {
  const [row] = await db.update(clients).set(input).where(eq(clients.id, id)).returning();
  return row;
}

export async function softDeleteClient(id: string) {
  await db
    .update(clients)
    .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(clients.id, id));
}
