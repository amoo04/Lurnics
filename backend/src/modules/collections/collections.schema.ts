import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  productIds: z.array(z.string()).optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export const listCollectionsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  search: z.string().optional(),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
