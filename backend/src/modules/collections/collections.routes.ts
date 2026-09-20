import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createCollectionSchema, listCollectionsQuerySchema, updateCollectionSchema } from "./collections.schema.js";
import {
  addCollection,
  editCollection,
  getCollection,
  getCollectionStats,
  listCollections,
  removeCollection,
} from "./collections.service.js";

export const collectionsRoutes = new Hono<AppEnv>();

collectionsRoutes.use("*", authenticatePlatform());

collectionsRoutes.post("/", async (c) => {
  const parsed = createCollectionSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid collection payload", parsed.error.flatten().fieldErrors);
  }

  const collection = await addCollection(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: collection }, 201);
});

collectionsRoutes.get("/stats", async (c) => {
  const stats = await getCollectionStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

collectionsRoutes.get("/", async (c) => {
  const parsed = listCollectionsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listCollections(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

collectionsRoutes.get("/:id", async (c) => {
  const collection = await getCollection(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: collection });
});

collectionsRoutes.patch("/:id", async (c) => {
  const parsed = updateCollectionSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid collection payload", parsed.error.flatten().fieldErrors);
  }

  const collection = await editCollection(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: collection });
});

collectionsRoutes.delete("/:id", async (c) => {
  await removeCollection(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
