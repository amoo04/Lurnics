import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { industries, type NewIndustryRow } from "../../db/schema.js";

export async function findIndustries(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.industries.findMany({ limit, offset, orderBy: (t, { asc }) => asc(t.name) }),
    db.$count(industries),
  ]);

  return { items, total };
}

export async function findIndustryBySlug(slug: string) {
  return db.query.industries.findFirst({ where: eq(industries.slug, slug) });
}

export async function findIndustryById(id: string) {
  return db.query.industries.findFirst({ where: eq(industries.id, id) });
}

export async function createIndustry(input: NewIndustryRow) {
  const [row] = await db.insert(industries).values(input).returning();
  return row;
}

export async function updateIndustry(id: string, input: Partial<NewIndustryRow>) {
  const [row] = await db.update(industries).set(input).where(eq(industries.id, id)).returning();
  return row;
}

export async function deleteIndustry(id: string) {
  await db.delete(industries).where(eq(industries.id, id));
}
