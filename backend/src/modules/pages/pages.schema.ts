import { z } from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  type: z.enum(["page", "homepage", "shop_page", "collection_page"]).optional(),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const updatePageSchema = createPageSchema.partial();

export const listPagesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  search: z.string().optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
