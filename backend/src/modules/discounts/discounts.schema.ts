import { z } from "zod";

export const createDiscountSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["code", "automatic"]).optional(),
  discountType: z.enum(["percentage", "fixed_amount", "free_shipping"]).optional(),
  value: z.number().min(0).optional(),
  appliesTo: z.enum(["entire_order", "shipping", "specific_collections", "specific_products"]).optional(),
  minOrderAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateDiscountSchema = createDiscountSchema.partial();

export const listDiscountsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(["code", "automatic"]).optional(),
  status: z.enum(["active", "scheduled", "expired", "disabled"]).optional(),
  search: z.string().optional(),
});

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountInput = z.infer<typeof updateDiscountSchema>;
