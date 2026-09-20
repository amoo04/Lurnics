import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const listBlogPostsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  search: z.string().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
