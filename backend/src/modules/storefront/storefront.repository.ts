import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products, productCollections, collections } from "../../db/schema.js";

export async function findFeaturedProducts(businessId: string, limit: number) {
  return db.query.products.findMany({
    where: and(eq(products.businessId, businessId), eq(products.status, "active"), gt(products.stockQuantity, 0)),
    orderBy: desc(products.createdAt),
    limit,
  });
}

export async function findShopProducts(
  businessId: string,
  limit: number,
  offset: number,
  collectionId?: string,
) {
  if (collectionId) {
    const where = and(
      eq(products.businessId, businessId),
      eq(products.status, "active"),
      eq(productCollections.collectionId, collectionId),
    );

    const [items, total] = await Promise.all([
      db
        .select({ product: products })
        .from(products)
        .innerJoin(productCollections, eq(productCollections.productId, products.id))
        .where(where)
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .innerJoin(productCollections, eq(productCollections.productId, products.id))
        .where(where),
    ]);

    return { items: items.map((r) => r.product), total: total[0]?.count ?? 0 };
  }

  const where = and(eq(products.businessId, businessId), eq(products.status, "active"));
  const [items, total] = await Promise.all([
    db.query.products.findMany({ where, orderBy: desc(products.createdAt), limit, offset }),
    db.$count(products, where),
  ]);

  return { items, total };
}

export async function findActiveCollections(businessId: string, limit: number) {
  return db.query.collections.findMany({
    where: and(eq(collections.businessId, businessId), eq(collections.status, "active")),
    orderBy: desc(collections.createdAt),
    limit,
  });
}
