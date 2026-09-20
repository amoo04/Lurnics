import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { clients, documents, invoices, payments, projects } from "../../db/schema.js";

export async function findRevenueByMonth(months: number) {
  return db
    .select({
      month: sql<string>`strftime('%Y-%m', ${payments.paymentDate})`,
      total: sql<number>`sum(${payments.amount})`.mapWith(Number),
    })
    .from(payments)
    .where(
      sql`${payments.status} = 'completed' and ${payments.paymentDate} >= datetime('now', '-' || ${months} || ' months')`,
    )
    .groupBy(sql`strftime('%Y-%m', ${payments.paymentDate})`)
    .orderBy(sql`strftime('%Y-%m', ${payments.paymentDate})`);
}

export async function findProjectsByStatus() {
  return db
    .select({ status: projects.status, count: sql<number>`count(*)`.mapWith(Number) })
    .from(projects)
    .groupBy(projects.status);
}

export async function findInvoicesByStatus() {
  return db
    .select({
      status: invoices.status,
      count: sql<number>`count(*)`.mapWith(Number),
      total: sql<number>`sum(${invoices.amount})`.mapWith(Number),
    })
    .from(invoices)
    .groupBy(invoices.status);
}

export async function findDocumentsByType() {
  return db
    .select({
      fileType: documents.fileType,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(documents)
    .groupBy(documents.fileType);
}

export async function findDocumentsByClient() {
  return db
    .select({
      clientId: documents.clientId,
      companyName: clients.companyName,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(documents)
    .innerJoin(clients, eq(documents.clientId, clients.id))
    .groupBy(documents.clientId)
    .orderBy(sql`count(*) desc`)
    .limit(5);
}

export async function countDocuments() {
  return db.$count(documents);
}

export async function countRecentDocuments(days: number) {
  return db.$count(
    documents,
    sql`${documents.uploadedAt} >= datetime('now', '-' || ${days} || ' days')`,
  );
}
