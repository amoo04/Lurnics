import { sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { leads } from "../../db/schema.js";

export async function findLeadsFunnel() {
  return db
    .select({ status: leads.status, count: sql<number>`count(*)`.mapWith(Number) })
    .from(leads)
    .groupBy(leads.status);
}

export async function findLeadsOverTime(months: number) {
  return db
    .select({
      month: sql<string>`strftime('%Y-%m', ${leads.createdAt})`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(leads)
    .where(sql`${leads.createdAt} >= datetime('now', '-' || ${months} || ' months')`)
    .groupBy(sql`strftime('%Y-%m', ${leads.createdAt})`)
    .orderBy(sql`strftime('%Y-%m', ${leads.createdAt})`);
}
