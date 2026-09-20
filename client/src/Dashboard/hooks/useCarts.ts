import { apiGet } from "../../lib/api";
import type { CartListResult, CartStats } from "../api/carts.types";

export function fetchCarts(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<CartListResult>(`/api/platform/carts${qs ? `?${qs}` : ""}`);
}

export function fetchCartStats() {
  return apiGet<CartStats>("/api/platform/carts/stats");
}
