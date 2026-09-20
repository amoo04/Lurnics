import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProducts,
  getInventorySummary,
  getProductSummary,
  updateProduct,
} from "./products.repository.js";
import type { CreateProductInput, UpdateProductInput } from "./products.schema.js";

export async function addProduct(businessId: string, input: CreateProductInput) {
  return createProduct({
    businessId,
    name: input.name,
    sku: input.sku,
    description: input.description,
    price: input.price,
    stockQuantity: input.stockQuantity ?? 0,
    type: input.type ?? "simple",
    collections: input.collections,
    imageUrl: input.imageUrl,
    status: input.status ?? "active",
  });
}

export async function listProducts(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findProducts(
    businessId,
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getProduct(businessId: string, id: string) {
  const product = await findProductById(businessId, id);
  if (!product) throw new NotFoundError("Product not found");
  return product;
}

export async function editProduct(businessId: string, id: string, input: UpdateProductInput) {
  await getProduct(businessId, id);
  return updateProduct(businessId, id, input);
}

export async function removeProduct(businessId: string, id: string) {
  await getProduct(businessId, id);
  await deleteProduct(businessId, id);
}

export async function getProductStats(businessId: string) {
  const summary = await getProductSummary(businessId);

  return {
    totalProducts: summary?.totalProducts ?? 0,
    activeProducts: summary?.activeProducts ?? 0,
    outOfStock: summary?.outOfStock ?? 0,
    inventoryValue: summary?.inventoryValue ?? 0,
  };
}

export async function getInventoryStats(businessId: string) {
  const summary = await getInventorySummary(businessId);

  return {
    totalProducts: summary?.totalProducts ?? 0,
    inventoryValue: summary?.inventoryValue ?? 0,
    lowStock: summary?.lowStock ?? 0,
    outOfStock: summary?.outOfStock ?? 0,
    inStock: summary?.inStock ?? 0,
  };
}
