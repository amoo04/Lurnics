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

export async function findLeadsBySource() {
  return db
    .select({
      source: sql<string>`coalesce(${leads.source}, 'unknown')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(leads)
    .groupBy(leads.source)
    .orderBy(sql`count(*) desc`);
}

export async function findLeadsByService() {
  return db
    .select({
      service: leads.service,
      count: sql<number>`count(*)`.mapWith(Number),
      wonCount: sql<number>`sum(case when ${leads.status} = 'won' then 1 else 0 end)`.mapWith(Number),
    })
    .from(leads)
    .where(sql`${leads.service} is not null`)
    .groupBy(leads.service)
    .orderBy(sql`count(*) desc`);
}
