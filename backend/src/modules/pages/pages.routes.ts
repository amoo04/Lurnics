import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createPageSchema, listPagesQuerySchema, updatePageSchema } from "./pages.schema.js";
import { addPage, editPage, getPage, getPageStats, listPages, removePage } from "./pages.service.js";

export const pagesRoutes = new Hono<AppEnv>();

pagesRoutes.use("*", authenticatePlatform());

pagesRoutes.post("/", async (c) => {
  const parsed = createPageSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid page payload", parsed.error.flatten().fieldErrors);
  }

  const page = await addPage(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: page }, 201);
});

pagesRoutes.get("/stats", async (c) => {
  const stats = await getPageStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

pagesRoutes.get("/", async (c) => {
  const parsed = listPagesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listPages(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

pagesRoutes.get("/:id", async (c) => {
  const page = await getPage(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: page });
});

pagesRoutes.patch("/:id", async (c) => {
  const parsed = updatePageSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid page payload", parsed.error.flatten().fieldErrors);
  }

  const page = await editPage(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: page });
});

pagesRoutes.delete("/:id", async (c) => {
  await removePage(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
