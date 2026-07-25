import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createBlogPostSchema, listBlogPostsQuerySchema, updateBlogPostSchema } from "./blog.schema.js";
import { addBlogPost, editBlogPost, getBlogPost, getBlogStats, listBlogPosts, removeBlogPost } from "./blog.service.js";

export const blogRoutes = new Hono<AppEnv>();

blogRoutes.use("*", authenticatePlatform());

blogRoutes.post("/", async (c) => {
  const parsed = createBlogPostSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid blog post payload", parsed.error.flatten().fieldErrors);
  }

  const post = await addBlogPost(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: post }, 201);
});

blogRoutes.get("/stats", async (c) => {
  const stats = await getBlogStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

blogRoutes.get("/", async (c) => {
  const parsed = listBlogPostsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listBlogPosts(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

blogRoutes.get("/:id", async (c) => {
  const post = await getBlogPost(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: post });
});

blogRoutes.patch("/:id", async (c) => {
  const parsed = updateBlogPostSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid blog post payload", parsed.error.flatten().fieldErrors);
  }

  const post = await editBlogPost(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: post });
});

blogRoutes.delete("/:id", async (c) => {
  await removeBlogPost(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
