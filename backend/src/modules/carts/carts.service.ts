import { NotFoundError, ValidationError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { findProductById } from "../products/products.repository.js";
import {
  ABANDONED_AFTER_HOURS,
  convertCart,
  createCart,
  findCartById,
  findCartItems,
  findCarts,
  findOpenCartByEmail,
  getCartSummary,
  getRecoveredRevenue,
} from "./carts.repository.js";
import type { CreateCartInput } from "./carts.schema.js";

export function deriveCartStatus(cart: {
  convertedOrderId: string | null;
  lastActivityAt: string;
}): "active" | "abandoned" | "recovered" {
  if (cart.convertedOrderId) return "recovered";

  // SQLite's CURRENT_TIMESTAMP is UTC but formatted with no "Z"/offset
  // marker ("2026-07-23 17:04:38"), so a naive `new Date(...)` parses it
  // as local time instead - drifting the comparison by the server's UTC
  // offset. Force it to be read as UTC.
  const utcString = cart.lastActivityAt.replace(" ", "T") + "Z";
  const hoursSinceActivity = (Date.now() - new Date(utcString).getTime()) / (1000 * 60 * 60);
  return hoursSinceActivity > ABANDONED_AFTER_HOURS ? "abandoned" : "active";
}

async function withItemsAndValue<T extends { id: string; convertedOrderId: string | null; lastActivityAt: string }>(
  cart: T,
) {
  const items = await findCartItems(cart.id);
  const value = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { ...cart, items, value, status: deriveCartStatus(cart) };
}

export async function startCart(businessId: string, input: CreateCartInput) {
  const items = [];
  for (const line of input.items) {
    const product = await findProductById(businessId, line.productId);
    if (!product) throw new ValidationError(`Product ${line.productId} not found`);
    items.push({
      productId: product.id,
      productName: product.name,
      quantity: line.quantity,
      unitPrice: product.price,
    });
  }

  const cart = await createCart(
    { businessId, customerName: input.customerName, customerEmail: input.customerEmail },
    items,
  );

  return withItemsAndValue(cart);
}

export async function listCarts(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findCarts(businessId, query.status, query.search, pagination.limit, pagination.offset);
  const withDetails = await Promise.all(items.map(withItemsAndValue));
  return paginatedResult(withDetails, total, pagination);
}

export async function getCart(businessId: string, id: string) {
  const cart = await findCartById(businessId, id);
  if (!cart) throw new NotFoundError("Cart not found");
  return withItemsAndValue(cart);
}

// Called from orders.service when an order is placed - if the customer
// has an open cart, it's genuinely "recovered", not just guessed.
export async function convertCartForCustomer(businessId: string, customerEmail: string, orderId: string) {
  const cart = await findOpenCartByEmail(businessId, customerEmail);
  if (!cart) return null;
  return convertCart(cart.id, orderId);
}

export async function getCartStats(businessId: string) {
  const [summary, revenueRecovered] = await Promise.all([
    getCartSummary(businessId),
    getRecoveredRevenue(businessId),
  ]);

  const abandonedCarts = summary?.abandonedCarts ?? 0;
  const recoveredCarts = summary?.recoveredCarts ?? 0;
  const recoveryRate = abandonedCarts + recoveredCarts > 0 ? recoveredCarts / (abandonedCarts + recoveredCarts) : 0;
  const conversionValue = recoveredCarts > 0 ? revenueRecovered / recoveredCarts : 0;

  return {
    totalAbandonedCarts: abandonedCarts,
    recoveredOrders: recoveredCarts,
    recoveryRate,
    revenueRecovered,
    conversionValue,
  };
}
