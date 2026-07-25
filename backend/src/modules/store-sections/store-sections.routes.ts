import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { reorderSectionsSchema, updateSectionSchema } from "./store-sections.schema.js";
import { editSection, listSections, reorderSections } from "./store-sections.service.js";

export const storeSectionsRoutes = new Hono<AppEnv>();

storeSectionsRoutes.use("*", authenticatePlatform());

storeSectionsRoutes.get("/", async (c) => {
  const sections = await listSections(c.get("businessId"));
  return c.json({ success: true, data: sections });
});

storeSectionsRoutes.post("/reorder", async (c) => {
  const parsed = reorderSectionsSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid reorder payload", parsed.error.flatten().fieldErrors);
  }

  const sections = await reorderSections(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: sections });
});

storeSectionsRoutes.patch("/:id", async (c) => {
  const parsed = updateSectionSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid section payload", parsed.error.flatten().fieldErrors);
  }

  const section = await editSection(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: section });
});
