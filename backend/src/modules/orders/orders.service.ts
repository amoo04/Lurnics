import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { convertCartForCustomer } from "../carts/carts.service.js";
import {
  createOrder,
  findOrderById,
  findOrders,
  getOrderStatusCounts,
  getOrderSummary,
  updateOrderStatus,
} from "./orders.repository.js";
import type { CreateOrderInput, UpdateOrderStatusInput } from "./orders.schema.js";

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${stamp}${rand}`;
}

export async function placeOrder(businessId: string, currency: string, input: CreateOrderInput) {
  const order = await createOrder({
    businessId,
    orderNumber: generateOrderNumber(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    channel: input.channel ?? "Online Store",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus ?? "pending",
    fulfillmentStatus: input.fulfillmentStatus ?? "pending",
    itemsCount: input.itemsCount ?? 1,
    totalAmount: input.totalAmount,
    currency,
    notes: input.notes,
  });

  // If this customer had an open cart, this order genuinely recovers it -
  // no guessing involved, just a real link.
  if (input.customerEmail) {
    await convertCartForCustomer(businessId, input.customerEmail, order.id);
  }

  return order;
}

export async function listOrders(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findOrders(
    businessId,
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getOrder(businessId: string, id: string) {
  const order = await findOrderById(businessId, id);
  if (!order) throw new NotFoundError("Order not found");
  return order;
}

export async function changeOrderStatus(businessId: string, id: string, input: UpdateOrderStatusInput) {
  await getOrder(businessId, id);
  return updateOrderStatus(businessId, id, input);
}

export async function getOrderStats(businessId: string) {
  const [summary, statusCounts] = await Promise.all([
    getOrderSummary(businessId),
    getOrderStatusCounts(businessId),
  ]);

  const totalOrders = summary?.totalOrders ?? 0;
  const totalRevenue = summary?.totalRevenue ?? 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusBreakdown: Record<string, number> = {};
  for (const row of statusCounts) statusBreakdown[row.status] = row.count;

  return { totalOrders, totalRevenue, averageOrderValue, statusBreakdown };
}
