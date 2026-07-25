import { z } from "zod";

const PAYMENT_STATUSES = ["paid", "pending", "refunded"] as const;
const FULFILLMENT_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  channel: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  itemsCount: z.number().int().min(1).optional(),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z
  .object({
    paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
    fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  })
  .refine((v) => v.paymentStatus || v.fulfillmentStatus, {
    message: "Provide at least one status to update",
  });

export const listOrdersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(FULFILLMENT_STATUSES).optional(),
  search: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
