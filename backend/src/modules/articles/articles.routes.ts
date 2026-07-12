import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createArticleSchema,
  listArticlesQuerySchema,
  updateArticleSchema,
} from "./articles.schema.js";
import {
  addArticle,
  editArticle,
  getPublishedArticleBySlug,
  listAllArticles,
  listPublishedArticles,
  removeArticle,
} from "./articles.service.js";

export const articlesRoutes = new Hono<AppEnv>();

articlesRoutes.get("/", async (c) => {
  const parsed = listArticlesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listPublishedArticles(parsed.data);
  return c.json({ success: true, data: result });
});

articlesRoutes.get("/admin", authenticate(), requirePermission("articles:read"), async (c) => {
  const parsed = listArticlesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listAllArticles(parsed.data);
  return c.json({ success: true, data: result });
});

articlesRoutes.get("/:slug", async (c) => {
  const article = await getPublishedArticleBySlug(c.req.param("slug"));
  return c.json({ success: true, data: article });
});

articlesRoutes.post("/", authenticate(), requirePermission("articles:write"), async (c) => {
  const parsed = createArticleSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid article payload", parsed.error.flatten().fieldErrors);
  }

  const article = await addArticle(parsed.data);
  return c.json({ success: true, data: article }, 201);
});

articlesRoutes.patch("/:id", authenticate(), requirePermission("articles:write"), async (c) => {
  const parsed = updateArticleSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid article payload", parsed.error.flatten().fieldErrors);
  }

  const article = await editArticle(c.req.param("id"), parsed.data);
  return c.json({ success: true, data: article });
});

articlesRoutes.delete(
  "/:id",
  authenticate(),
  requirePermission("articles:delete"),
  async (c) => {
    await removeArticle(c.req.param("id"));
    return c.json({ success: true, data: null });
  },
);
