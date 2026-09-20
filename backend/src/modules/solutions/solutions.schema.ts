import { z } from "zod";

export const createSolutionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateSolutionSchema = createSolutionSchema.partial();

export const listSolutionsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
export type UpdateSolutionInput = z.infer<typeof updateSolutionSchema>;
