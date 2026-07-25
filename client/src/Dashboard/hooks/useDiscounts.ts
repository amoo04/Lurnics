import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  CreateDiscountInput,
  Discount,
  DiscountListResult,
  DiscountStats,
  UpdateDiscountInput,
} from "../api/discounts.types";

export function fetchDiscounts(params: { type?: string; status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<DiscountListResult>(`/api/platform/discounts${qs ? `?${qs}` : ""}`);
}

export function fetchDiscountStats() {
  return apiGet<DiscountStats>("/api/platform/discounts/stats");
}

export function createDiscount(input: CreateDiscountInput) {
  return apiPost<Discount>("/api/platform/discounts", input);
}

export function updateDiscount(id: string, patch: UpdateDiscountInput) {
  return apiPatch<Discount>(`/api/platform/discounts/${id}`, patch);
}

export function deleteDiscount(id: string) {
  return apiDelete<null>(`/api/platform/discounts/${id}`);
}
