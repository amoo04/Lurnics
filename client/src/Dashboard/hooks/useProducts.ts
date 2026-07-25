import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  CreateProductInput,
  InventoryStats,
  Product,
  ProductListResult,
  ProductStats,
  UpdateProductInput,
} from "../api/products.types";

export function fetchProducts(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<ProductListResult>(`/api/platform/products${qs ? `?${qs}` : ""}`);
}

export function fetchProductStats() {
  return apiGet<ProductStats>("/api/platform/products/stats");
}

export function fetchInventoryStats() {
  return apiGet<InventoryStats>("/api/platform/products/inventory/stats");
}

export function createProduct(input: CreateProductInput) {
  return apiPost<Product>("/api/platform/products", input);
}

export function updateProduct(id: string, patch: UpdateProductInput) {
  return apiPatch<Product>(`/api/platform/products/${id}`, patch);
}

export function deleteProduct(id: string) {
  return apiDelete<null>(`/api/platform/products/${id}`);
}
