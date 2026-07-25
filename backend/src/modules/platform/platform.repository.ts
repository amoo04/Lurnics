import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  businesses,
  businessMembers,
  platformUsers,
  type NewBusinessMemberRow,
  type NewBusinessRow,
  type NewPlatformUserRow,
} from "../../db/schema.js";

export async function createPlatformUser(input: NewPlatformUserRow) {
  const [row] = await db.insert(platformUsers).values(input).returning();
  return row;
}

export async function findPlatformUserByEmail(email: string) {
  return db.query.platformUsers.findFirst({ where: eq(platformUsers.email, email) });
}

export async function findPlatformUserById(id: string) {
  return db.query.platformUsers.findFirst({ where: eq(platformUsers.id, id) });
}

export async function createBusiness(input: NewBusinessRow) {
  const [row] = await db.insert(businesses).values(input).returning();
  return row;
}

export async function findBusinessBySlug(slug: string) {
  return db.query.businesses.findFirst({ where: eq(businesses.slug, slug) });
}

export async function findBusinessById(id: string) {
  return db.query.businesses.findFirst({ where: eq(businesses.id, id) });
}

export async function updateBusiness(id: string, patch: Partial<NewBusinessRow>) {
  const [row] = await db.update(businesses).set(patch).where(eq(businesses.id, id)).returning();
  return row;
}

export async function createBusinessMember(input: NewBusinessMemberRow) {
  const [row] = await db.insert(businessMembers).values(input).returning();
  return row;
}

export async function findFirstMembershipForUser(userId: string) {
  return db.query.businessMembers.findFirst({
    where: eq(businessMembers.userId, userId),
    with: { business: true },
  });
}
