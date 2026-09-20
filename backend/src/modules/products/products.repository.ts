import { and, desc, eq, gt, like, lte, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products, type NewProductRow } from "../../db/schema.js";

const LOW_STOCK_THRESHOLD = 10;

export async function createProduct(input: NewProductRow) {
  const [row] = await db.insert(products).values(input).returning();
  return row;
}

export async function findProducts(
  businessId: string,
  statusFilter: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [eq(products.businessId, businessId)];

  if (statusFilter === "active") conditions.push(eq(products.status, "active"));
  else if (statusFilter === "draft") conditions.push(eq(products.status, "draft"));
  else if (statusFilter === "out_of_stock") conditions.push(lte(products.stockQuantity, 0));
  else if (statusFilter === "low_stock") {
    conditions.push(gt(products.stockQuantity, 0), lte(products.stockQuantity, LOW_STOCK_THRESHOLD));
  }

  if (search) {
    conditions.push(or(like(products.name, `%${search}%`), like(products.sku, `%${search}%`))!);
  }

  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.products.findMany({ where, limit, offset, orderBy: desc(products.createdAt) }),
    db.$count(products, where),
  ]);

  return { items, total };
}

export async function findProductById(businessId: string, id: string) {
  return db.query.products.findFirst({
    where: and(eq(products.businessId, businessId), eq(products.id, id)),
  });
}

export async function updateProduct(businessId: string, id: string, patch: Partial<NewProductRow>) {
  const [row] = await db
    .update(products)
    .set(patch)
    .where(and(eq(products.businessId, businessId), eq(products.id, id)))
    .returning();
  return row;
}

export async function deleteProduct(businessId: string, id: string) {
  await db.delete(products).where(and(eq(products.businessId, businessId), eq(products.id, id)));
}

export async function getProductSummary(businessId: string) {
  const [row] = await db
    .select({
      totalProducts: sql<number>`count(*)`,
      activeProducts: sql<number>`sum(case when ${products.status} = 'active' and ${products.stockQuantity} > 0 then 1 else 0 end)`,
      outOfStock: sql<number>`sum(case when ${products.stockQuantity} <= 0 then 1 else 0 end)`,
      inventoryValue: sql<number>`coalesce(sum(${products.price} * ${products.stockQuantity}), 0)`,
    })
    .from(products)
    .where(eq(products.businessId, businessId));

  return row;
}

export async function getInventorySummary(businessId: string) {
  const [row] = await db
    .select({
      totalProducts: sql<number>`count(*)`,
      inventoryValue: sql<number>`coalesce(sum(${products.price} * ${products.stockQuantity}), 0)`,
      lowStock: sql<number>`sum(case when ${products.stockQuantity} > 0 and ${products.stockQuantity} <= ${LOW_STOCK_THRESHOLD} then 1 else 0 end)`,
      outOfStock: sql<number>`sum(case when ${products.stockQuantity} <= 0 then 1 else 0 end)`,
      inStock: sql<number>`sum(case when ${products.stockQuantity} > ${LOW_STOCK_THRESHOLD} then 1 else 0 end)`,
    })
    .from(products)
    .where(eq(products.businessId, businessId));

  return row;
}
