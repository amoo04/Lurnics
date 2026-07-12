import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createCaseStudySchema,
  listCaseStudiesQuerySchema,
  updateCaseStudySchema,
} from "./case-studies.schema.js";
import {
  addCaseStudy,
  editCaseStudy,
  getPublishedCaseStudyBySlug,
  listAllCaseStudies,
  listPublishedCaseStudies,
  removeCaseStudy,
} from "./case-studies.service.js";

export const caseStudiesRoutes = new Hono<AppEnv>();

caseStudiesRoutes.get("/", async (c) => {
  const parsed = listCaseStudiesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listPublishedCaseStudies(parsed.data);
  return c.json({ success: true, data: result });
});

caseStudiesRoutes.get(
  "/admin",
  authenticate(),
  requirePermission("case-studies:read"),
  async (c) => {
    const parsed = listCaseStudiesQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
    }

    const result = await listAllCaseStudies(parsed.data);
    return c.json({ success: true, data: result });
  },
);

caseStudiesRoutes.get("/:slug", async (c) => {
  const caseStudy = await getPublishedCaseStudyBySlug(c.req.param("slug"));
  return c.json({ success: true, data: caseStudy });
});

caseStudiesRoutes.post(
  "/",
  authenticate(),
  requirePermission("case-studies:write"),
  async (c) => {
    const parsed = createCaseStudySchema.safeParse(await c.req.json());
    if (!parsed.success) {
      throw new ValidationError("Invalid case study payload", parsed.error.flatten().fieldErrors);
    }

    const caseStudy = await addCaseStudy(parsed.data);
    return c.json({ success: true, data: caseStudy }, 201);
  },
);

caseStudiesRoutes.patch(
  "/:id",
  authenticate(),
  requirePermission("case-studies:write"),
  async (c) => {
    const parsed = updateCaseStudySchema.safeParse(await c.req.json());
    if (!parsed.success) {
      throw new ValidationError("Invalid case study payload", parsed.error.flatten().fieldErrors);
    }

    const caseStudy = await editCaseStudy(c.req.param("id"), parsed.data);
    return c.json({ success: true, data: caseStudy });
  },
);

caseStudiesRoutes.delete(
  "/:id",
  authenticate(),
  requirePermission("case-studies:delete"),
  async (c) => {
    await removeCaseStudy(c.req.param("id"));
    return c.json({ success: true, data: null });
  },
);
