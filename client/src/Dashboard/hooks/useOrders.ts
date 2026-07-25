import { apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  CreateOrderInput,
  FulfillmentStatus,
  Order,
  OrderListResult,
  OrderStats,
} from "../api/orders.types";

export function fetchOrders(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<OrderListResult>(`/api/platform/orders${qs ? `?${qs}` : ""}`);
}

export function fetchOrderStats() {
  return apiGet<OrderStats>("/api/platform/orders/stats");
}

export function createOrder(input: CreateOrderInput) {
  return apiPost<Order>("/api/platform/orders", input);
}

export function updateOrderStatus(
  id: string,
  patch: { paymentStatus?: Order["paymentStatus"]; fulfillmentStatus?: FulfillmentStatus },
) {
  return apiPatch<Order>(`/api/platform/orders/${id}/status`, patch);
}
