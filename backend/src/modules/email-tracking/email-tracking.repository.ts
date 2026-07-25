import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import { customers, emailSends } from "../../db/schema.js";

export async function findSendByToken(token: string) {
  return db.query.emailSends.findFirst({ where: eq(emailSends.trackingToken, token) });
}

export async function markOpened(token: string) {
  await db
    .update(emailSends)
    .set({ openedAt: new Date().toISOString() })
    .where(and(eq(emailSends.trackingToken, token), isNull(emailSends.openedAt)));
}

export async function markClicked(token: string) {
  await db
    .update(emailSends)
    .set({ clickedAt: new Date().toISOString() })
    .where(and(eq(emailSends.trackingToken, token), isNull(emailSends.clickedAt)));
}

export async function optOutCustomer(businessId: string, email: string) {
  await db
    .update(customers)
    .set({ emailOptOut: true })
    .where(and(eq(customers.businessId, businessId), eq(customers.email, email)));
}
