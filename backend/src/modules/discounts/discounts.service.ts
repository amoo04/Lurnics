import { ConflictError, NotFoundError, ValidationError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createDiscount,
  deleteDiscount,
  findDiscountByCode,
  findDiscountById,
  findDiscounts,
  getDiscountSummary,
  updateDiscount,
} from "./discounts.repository.js";
import type { CreateDiscountInput, UpdateDiscountInput } from "./discounts.schema.js";

export function deriveDiscountStatus(discount: {
  isActive: boolean;
  startDate: string;
  endDate: string | null;
}): "active" | "scheduled" | "expired" | "disabled" {
  if (!discount.isActive) return "disabled";

  const now = new Date();
  const start = new Date(discount.startDate);
  if (now < start) return "scheduled";

  if (discount.endDate) {
    const end = new Date(discount.endDate);
    if (now > end) return "expired";
  }

  return "active";
}

function withStatus<T extends { isActive: boolean; startDate: string; endDate: string | null }>(discount: T) {
  return { ...discount, status: deriveDiscountStatus(discount) };
}

export async function addDiscount(businessId: string, input: CreateDiscountInput) {
  const code = input.code.trim().toUpperCase();
  const existing = await findDiscountByCode(businessId, code);
  if (existing) throw new ConflictError("A discount with this code already exists");

  const discount = await createDiscount({
    businessId,
    code,
    description: input.description,
    type: input.type ?? "code",
    discountType: input.discountType ?? "percentage",
    value: input.value,
    appliesTo: input.appliesTo ?? "entire_order",
    minOrderAmount: input.minOrderAmount,
    usageLimit: input.usageLimit,
    startDate: input.startDate,
    endDate: input.endDate,
    isActive: input.isActive ?? true,
  });

  return withStatus(discount);
}

export async function listDiscounts(
  businessId: string,
  query: { page?: string; limit?: string; type?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findDiscounts(
    businessId,
    query.type,
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );

  return paginatedResult(items.map(withStatus), total, pagination);
}

export async function getDiscount(businessId: string, id: string) {
  const discount = await findDiscountById(businessId, id);
  if (!discount) throw new NotFoundError("Discount not found");
  return withStatus(discount);
}

export async function editDiscount(businessId: string, id: string, input: UpdateDiscountInput) {
  await getDiscount(businessId, id);

  if (input.code) {
    const code = input.code.trim().toUpperCase();
    const existing = await findDiscountByCode(businessId, code);
    if (existing && existing.id !== id) throw new ConflictError("A discount with this code already exists");
    input.code = code;
  }

  const discount = await updateDiscount(businessId, id, input);
  return withStatus(discount);
}

export async function removeDiscount(businessId: string, id: string) {
  await getDiscount(businessId, id);
  await deleteDiscount(businessId, id);
}

export async function redeemDiscount(businessId: string, id: string) {
  const discount = await getDiscount(businessId, id);
  if (discount.status !== "active") {
    throw new ValidationError(`Discount is ${discount.status}, cannot be redeemed`);
  }
  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    throw new ValidationError("Discount has reached its usage limit");
  }

  const updated = await updateDiscount(businessId, id, { usageCount: discount.usageCount + 1 });
  return withStatus(updated);
}

export async function getDiscountStats(businessId: string) {
  const summary = await getDiscountSummary(businessId);

  return {
    totalDiscounts: summary?.totalDiscounts ?? 0,
    activeDiscounts: summary?.activeDiscounts ?? 0,
    codeDiscounts: summary?.codeDiscounts ?? 0,
    automaticDiscounts: summary?.automaticDiscounts ?? 0,
    totalUses: summary?.totalUses ?? 0,
  };
}
