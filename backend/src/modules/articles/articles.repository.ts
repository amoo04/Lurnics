import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { articles, type NewArticleRow } from "../../db/schema.js";

export async function findArticles(
  status: string | undefined,
  limit: number,
  offset: number,
) {
  const where = status ? eq(articles.status, status) : undefined;

  const [items, total] = await Promise.all([
    db.query.articles.findMany({ where, limit, offset, orderBy: desc(articles.createdAt) }),
    db.$count(articles, where),
  ]);

  return { items, total };
}

export async function findArticleBySlug(slug: string) {
  return db.query.articles.findFirst({ where: eq(articles.slug, slug) });
}

export async function findPublishedArticleBySlug(slug: string) {
  return db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.status, "published")),
  });
}

export async function findArticleById(id: string) {
  return db.query.articles.findFirst({ where: eq(articles.id, id) });
}

export async function createArticle(input: NewArticleRow) {
  const [row] = await db.insert(articles).values(input).returning();
  return row;
}

export async function updateArticle(id: string, input: Partial<NewArticleRow>) {
  const [row] = await db.update(articles).set(input).where(eq(articles.id, id)).returning();
  return row;
}

export async function deleteArticle(id: string) {
  await db.delete(articles).where(eq(articles.id, id));
}
