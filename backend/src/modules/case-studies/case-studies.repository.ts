import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import { caseStudies, type NewCaseStudyRow } from "../../db/schema.js";

export async function findCaseStudies(
  industryId: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [isNotNull(caseStudies.publishedAt)];
  if (industryId) conditions.push(eq(caseStudies.industryId, industryId));
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.caseStudies.findMany({
      where,
      limit,
      offset,
      orderBy: desc(caseStudies.publishedAt),
      with: { industry: true },
    }),
    db.$count(caseStudies, where),
  ]);

  return { items, total };
}

export async function findAllCaseStudies(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.caseStudies.findMany({
      limit,
      offset,
      orderBy: desc(caseStudies.publishedAt),
      with: { industry: true },
    }),
    db.$count(caseStudies),
  ]);

  return { items, total };
}

export async function findPublishedCaseStudyBySlug(slug: string) {
  return db.query.caseStudies.findFirst({
    where: and(eq(caseStudies.slug, slug), isNotNull(caseStudies.publishedAt)),
    with: { industry: true },
  });
}

export async function findCaseStudyBySlug(slug: string) {
  return db.query.caseStudies.findFirst({ where: eq(caseStudies.slug, slug) });
}

export async function findCaseStudyById(id: string) {
  return db.query.caseStudies.findFirst({ where: eq(caseStudies.id, id) });
}

export async function createCaseStudy(input: NewCaseStudyRow) {
  const [row] = await db.insert(caseStudies).values(input).returning();
  return row;
}

export async function updateCaseStudy(id: string, input: Partial<NewCaseStudyRow>) {
  const [row] = await db
    .update(caseStudies)
    .set(input)
    .where(eq(caseStudies.id, id))
    .returning();
  return row;
}

export async function deleteCaseStudy(id: string) {
  await db.delete(caseStudies).where(eq(caseStudies.id, id));
}
