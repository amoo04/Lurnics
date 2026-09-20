import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createNavItemSchema, reorderNavItemsSchema, updateNavItemSchema } from "./navigation.schema.js";
import { addNavItem, editNavItem, listNavItems, removeNavItem, reorderNavItems } from "./navigation.service.js";

export const navigationRoutes = new Hono<AppEnv>();

navigationRoutes.use("*", authenticatePlatform());

navigationRoutes.get("/", async (c) => {
  const location = c.req.query("location") ?? "main";
  const items = await listNavItems(c.get("businessId"), location);
  return c.json({ success: true, data: items });
});

navigationRoutes.post("/", async (c) => {
  const parsed = createNavItemSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid navigation item payload", parsed.error.flatten().fieldErrors);
  }

  const item = await addNavItem(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: item }, 201);
});

navigationRoutes.post("/reorder", async (c) => {
  const body = await c.req.json();
  const parsed = reorderNavItemsSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid reorder payload", parsed.error.flatten().fieldErrors);
  }

  const location = typeof body.location === "string" ? body.location : "main";
  const items = await reorderNavItems(c.get("businessId"), location, parsed.data.orderedIds);
  return c.json({ success: true, data: items });
});

navigationRoutes.patch("/:id", async (c) => {
  const parsed = updateNavItemSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid navigation item payload", parsed.error.flatten().fieldErrors);
  }

  const item = await editNavItem(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: item });
});

navigationRoutes.delete("/:id", async (c) => {
  await removeNavItem(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
