import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { pages, type NewPageRow } from "../../db/schema.js";

export async function createPage(input: NewPageRow) {
  const [row] = await db.insert(pages).values(input).returning();
  return row;
}

export async function findPageBySlug(businessId: string, slug: string) {
  return db.query.pages.findFirst({ where: and(eq(pages.businessId, businessId), eq(pages.slug, slug)) });
}

export async function findPublishedPageBySlug(businessId: string, slug: string) {
  return db.query.pages.findFirst({
    where: and(eq(pages.businessId, businessId), eq(pages.slug, slug), eq(pages.status, "published")),
  });
}

export async function findAllPublishedPages(businessId: string) {
  return db.query.pages.findMany({
    where: and(eq(pages.businessId, businessId), eq(pages.status, "published")),
  });
}

export async function findPages(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(pages.businessId, businessId)];
  if (status) conditions.push(eq(pages.status, status));
  if (search) {
    conditions.push(or(like(pages.title, `%${search}%`), like(pages.slug, `%${search}%`))!);
  }
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.pages.findMany({ where, limit, offset, orderBy: desc(pages.updatedAt) }),
    db.$count(pages, where),
  ]);

  return { items, total };
}

export async function findPageById(businessId: string, id: string) {
  return db.query.pages.findFirst({ where: and(eq(pages.businessId, businessId), eq(pages.id, id)) });
}

export async function updatePage(businessId: string, id: string, patch: Partial<NewPageRow>) {
  const [row] = await db
    .update(pages)
    .set(patch)
    .where(and(eq(pages.businessId, businessId), eq(pages.id, id)))
    .returning();
  return row;
}

export async function deletePage(businessId: string, id: string) {
  await db.delete(pages).where(and(eq(pages.businessId, businessId), eq(pages.id, id)));
}

export async function incrementPageViews(id: string) {
  await db
    .update(pages)
    .set({ viewCount: sql`${pages.viewCount} + 1` })
    .where(eq(pages.id, id));
}

export async function getPageSummary(businessId: string) {
  const [row] = await db
    .select({
      totalPages: sql<number>`count(*)`,
      publishedPages: sql<number>`sum(case when ${pages.status} = 'published' then 1 else 0 end)`,
      draftPages: sql<number>`sum(case when ${pages.status} = 'draft' then 1 else 0 end)`,
      archivedPages: sql<number>`sum(case when ${pages.status} = 'archived' then 1 else 0 end)`,
    })
    .from(pages)
    .where(eq(pages.businessId, businessId));

  return row;
}
