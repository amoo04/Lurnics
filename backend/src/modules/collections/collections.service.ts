import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  countDistinctProductsInCollections,
  createCollection,
  deleteCollection,
  findCollectionById,
  findCollectionBySlug,
  findCollections,
  findProductIdsForCollection,
  getCollectionSummary,
  getProductCounts,
  setCollectionProducts,
  updateCollection,
} from "./collections.repository.js";
import type { CreateCollectionInput, UpdateCollectionInput } from "./collections.schema.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(businessId: string, name: string): Promise<string> {
  const base = slugify(name) || "collection";
  let slug = base;
  let suffix = 2;

  while (await findCollectionBySlug(businessId, slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function addCollection(businessId: string, input: CreateCollectionInput) {
  const slug = await generateUniqueSlug(businessId, input.name);
  const collection = await createCollection({
    businessId,
    name: input.name,
    slug,
    description: input.description,
    imageUrl: input.imageUrl,
    status: input.status ?? "active",
  });

  if (input.productIds && input.productIds.length > 0) {
    await setCollectionProducts(businessId, collection.id, input.productIds);
  }

  return { ...collection, productCount: input.productIds?.length ?? 0 };
}

export async function listCollections(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findCollections(
    businessId,
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );

  const counts = await getProductCounts(items.map((c) => c.id));
  const withCounts = items.map((c) => ({ ...c, productCount: counts[c.id] ?? 0 }));

  return paginatedResult(withCounts, total, pagination);
}

export async function getCollection(businessId: string, id: string) {
  const collection = await findCollectionById(businessId, id);
  if (!collection) throw new NotFoundError("Collection not found");

  const productIds = await findProductIdsForCollection(id);
  return { ...collection, productIds };
}

export async function editCollection(businessId: string, id: string, input: UpdateCollectionInput) {
  await getCollection(businessId, id);

  const { productIds, ...fields } = input;
  if (Object.keys(fields).length > 0) {
    await updateCollection(businessId, id, fields);
  }

  if (productIds !== undefined) {
    await setCollectionProducts(businessId, id, productIds);
  }

  return getCollection(businessId, id);
}

export async function removeCollection(businessId: string, id: string) {
  await getCollection(businessId, id);
  await deleteCollection(businessId, id);
}

export async function getCollectionStats(businessId: string) {
  const [summary, productsInCollections] = await Promise.all([
    getCollectionSummary(businessId),
    countDistinctProductsInCollections(businessId),
  ]);

  return {
    totalCollections: summary?.totalCollections ?? 0,
    activeCollections: summary?.activeCollections ?? 0,
    productsInCollections,
  };
}
