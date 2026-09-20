import { z } from "zod";

export const createIndustrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateIndustrySchema = createIndustrySchema.partial();

export const listIndustriesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateIndustryInput = z.infer<typeof createIndustrySchema>;
export type UpdateIndustryInput = z.infer<typeof updateIndustrySchema>;
