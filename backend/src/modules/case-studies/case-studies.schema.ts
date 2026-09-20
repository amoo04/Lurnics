import { z } from "zod";

export const createCaseStudySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  industryId: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(1),
  liveUrl: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  published: z.boolean().optional(),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

export const listCaseStudiesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  industryId: z.string().optional(),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
