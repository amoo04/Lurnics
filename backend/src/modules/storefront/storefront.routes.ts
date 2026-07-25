import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { shopQuerySchema, subscribeSchema } from "./storefront.schema.js";
import {
  getBlogList,
  getBlogPostPage,
  getCollectionPage,
  getShopProducts,
  getStorefront,
  getStorePage,
  subscribeToNewsletter,
} from "./storefront.service.js";

export const storefrontRoutes = new Hono<AppEnv>();

storefrontRoutes.get("/:slug", async (c) => {
  const data = await getStorefront(c.req.param("slug"));
  return c.json({ success: true, data });
});

storefrontRoutes.get("/:slug/products", async (c) => {
  const parsed = shopQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const data = await getShopProducts(c.req.param("slug"), parsed.data);
  return c.json({ success: true, data });
});

storefrontRoutes.get("/:slug/collections/:collectionSlug", async (c) => {
  const data = await getCollectionPage(c.req.param("slug"), c.req.param("collectionSlug"));
  return c.json({ success: true, data });
});

storefrontRoutes.get("/:slug/pages/:pageSlug", async (c) => {
  const data = await getStorePage(c.req.param("slug"), c.req.param("pageSlug"));
  return c.json({ success: true, data });
});

storefrontRoutes.get("/:slug/blog", async (c) => {
  const data = await getBlogList(c.req.param("slug"), c.req.query());
  return c.json({ success: true, data });
});

storefrontRoutes.get("/:slug/blog/:postSlug", async (c) => {
  const data = await getBlogPostPage(c.req.param("slug"), c.req.param("postSlug"));
  return c.json({ success: true, data });
});

storefrontRoutes.post("/:slug/subscribe", async (c) => {
  const parsed = subscribeSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid subscribe payload", parsed.error.flatten().fieldErrors);
  }

  const customer = await subscribeToNewsletter(c.req.param("slug"), parsed.data.email, parsed.data.name);
  return c.json({ success: true, data: { id: customer.id, email: customer.email } });
});
