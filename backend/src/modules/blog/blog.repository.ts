import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { blogPosts, type NewBlogPostRow } from "../../db/schema.js";

export async function createBlogPost(input: NewBlogPostRow) {
  const [row] = await db.insert(blogPosts).values(input).returning();
  return row;
}

export async function findBlogPostBySlug(businessId: string, slug: string) {
  return db.query.blogPosts.findFirst({ where: and(eq(blogPosts.businessId, businessId), eq(blogPosts.slug, slug)) });
}

export async function findPublishedBlogPostBySlug(businessId: string, slug: string) {
  return db.query.blogPosts.findFirst({
    where: and(eq(blogPosts.businessId, businessId), eq(blogPosts.slug, slug), eq(blogPosts.status, "published")),
  });
}

export async function findBlogPosts(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(blogPosts.businessId, businessId)];
  if (status) conditions.push(eq(blogPosts.status, status));
  if (search) conditions.push(or(like(blogPosts.title, `%${search}%`), like(blogPosts.slug, `%${search}%`))!);
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.blogPosts.findMany({ where, limit, offset, orderBy: desc(blogPosts.createdAt) }),
    db.$count(blogPosts, where),
  ]);

  return { items, total };
}

export async function findPublishedBlogPosts(businessId: string, limit: number, offset: number) {
  const where = and(eq(blogPosts.businessId, businessId), eq(blogPosts.status, "published"));
  const [items, total] = await Promise.all([
    db.query.blogPosts.findMany({ where, limit, offset, orderBy: desc(blogPosts.publishedAt) }),
    db.$count(blogPosts, where),
  ]);
  return { items, total };
}

export async function findBlogPostById(businessId: string, id: string) {
  return db.query.blogPosts.findFirst({ where: and(eq(blogPosts.businessId, businessId), eq(blogPosts.id, id)) });
}

export async function updateBlogPost(businessId: string, id: string, patch: Partial<NewBlogPostRow>) {
  const [row] = await db
    .update(blogPosts)
    .set(patch)
    .where(and(eq(blogPosts.businessId, businessId), eq(blogPosts.id, id)))
    .returning();
  return row;
}

export async function deleteBlogPost(businessId: string, id: string) {
  await db.delete(blogPosts).where(and(eq(blogPosts.businessId, businessId), eq(blogPosts.id, id)));
}

export async function incrementBlogPostViews(id: string) {
  await db
    .update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, id));
}

export async function getBlogSummary(businessId: string) {
  const [row] = await db
    .select({
      totalPosts: sql<number>`count(*)`,
      publishedPosts: sql<number>`sum(case when ${blogPosts.status} = 'published' then 1 else 0 end)`,
      draftPosts: sql<number>`sum(case when ${blogPosts.status} = 'draft' then 1 else 0 end)`,
      totalViews: sql<number>`coalesce(sum(${blogPosts.viewCount}), 0)`,
    })
    .from(blogPosts)
    .where(eq(blogPosts.businessId, businessId));

  return row;
}
