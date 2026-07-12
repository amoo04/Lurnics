import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { leads, type NewLeadRow } from "../../db/schema.js";

export async function createLead(input: NewLeadRow) {
  const [row] = await db.insert(leads).values(input).returning();
  return row;
}

export async function findLeads(status: string | undefined, limit: number, offset: number) {
  const where = status ? eq(leads.status, status) : undefined;

  const [items, total] = await Promise.all([
    db.query.leads.findMany({ where, limit, offset, orderBy: desc(leads.createdAt) }),
    db.$count(leads, where),
  ]);

  return { items, total };
}

export async function findLeadById(id: string) {
  return db.query.leads.findFirst({ where: eq(leads.id, id) });
}

export async function updateLeadStatus(id: string, status: string) {
  const [row] = await db.update(leads).set({ status }).where(eq(leads.id, id)).returning();
  return row;
}

export async function deleteLead(id: string) {
  await db.delete(leads).where(eq(leads.id, id));
}
