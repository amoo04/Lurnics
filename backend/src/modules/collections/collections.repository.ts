import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  collections,
  productCollections,
  type NewCollectionRow,
} from "../../db/schema.js";

export async function createCollection(input: NewCollectionRow) {
  const [row] = await db.insert(collections).values(input).returning();
  return row;
}

export async function findCollectionBySlug(businessId: string, slug: string) {
  return db.query.collections.findFirst({
    where: and(eq(collections.businessId, businessId), eq(collections.slug, slug)),
  });
}

export async function findCollections(
  businessId: string,
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(collections.businessId, businessId)];
  if (status) conditions.push(eq(collections.status, status));
  if (search) conditions.push(like(collections.name, `%${search}%`));
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.collections.findMany({ where, limit, offset, orderBy: desc(collections.createdAt) }),
    db.$count(collections, where),
  ]);

  return { items, total };
}

export async function findCollectionById(businessId: string, id: string) {
  return db.query.collections.findFirst({
    where: and(eq(collections.businessId, businessId), eq(collections.id, id)),
  });
}

export async function updateCollection(businessId: string, id: string, patch: Partial<NewCollectionRow>) {
  const [row] = await db
    .update(collections)
    .set(patch)
    .where(and(eq(collections.businessId, businessId), eq(collections.id, id)))
    .returning();
  return row;
}

export async function deleteCollection(businessId: string, id: string) {
  await db.delete(collections).where(and(eq(collections.businessId, businessId), eq(collections.id, id)));
}

export async function getProductCounts(collectionIds: string[]): Promise<Record<string, number>> {
  if (collectionIds.length === 0) return {};

  const rows = await db
    .select({ collectionId: productCollections.collectionId, count: sql<number>`count(*)` })
    .from(productCollections)
    .where(inArray(productCollections.collectionId, collectionIds))
    .groupBy(productCollections.collectionId);

  const map: Record<string, number> = {};
  for (const row of rows) map[row.collectionId] = row.count;
  return map;
}

export async function findProductIdsForCollection(collectionId: string): Promise<string[]> {
  const rows = await db
    .select({ productId: productCollections.productId })
    .from(productCollections)
    .where(eq(productCollections.collectionId, collectionId));
  return rows.map((r) => r.productId);
}

export async function setCollectionProducts(businessId: string, collectionId: string, productIds: string[]) {
  await db
    .delete(productCollections)
    .where(and(eq(productCollections.businessId, businessId), eq(productCollections.collectionId, collectionId)));

  if (productIds.length > 0) {
    await db
      .insert(productCollections)
      .values(productIds.map((productId) => ({ businessId, collectionId, productId })));
  }
}

export async function getCollectionSummary(businessId: string) {
  const [row] = await db
    .select({
      totalCollections: sql<number>`count(*)`,
      activeCollections: sql<number>`sum(case when ${collections.status} = 'active' then 1 else 0 end)`,
    })
    .from(collections)
    .where(eq(collections.businessId, businessId));

  return row;
}

export async function countDistinctProductsInCollections(businessId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(distinct ${productCollections.productId})` })
    .from(productCollections)
    .where(eq(productCollections.businessId, businessId));

  return row?.count ?? 0;
}
