import { z } from "zod";

export const cartItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const createCartSchema = z.object({
  customerName: z.string().optional(),
  customerEmail: z.string().email(),
  items: z.array(cartItemInputSchema).min(1),
});

export const listCartsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["active", "abandoned", "recovered"]).optional(),
  search: z.string().optional(),
});

export type CreateCartInput = z.infer<typeof createCartSchema>;
