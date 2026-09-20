import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  stockQuantity: z.number().int().min(0).optional(),
  type: z.string().optional(),
  collections: z.string().optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(["active", "draft"]).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["active", "draft", "low_stock", "out_of_stock"]).optional(),
  search: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
