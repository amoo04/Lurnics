import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createSolutionSchema,
  listSolutionsQuerySchema,
  updateSolutionSchema,
} from "./solutions.schema.js";
import {
  addSolution,
  editSolution,
  getSolutionBySlug,
  listSolutions,
  removeSolution,
} from "./solutions.service.js";

export const solutionsRoutes = new Hono<AppEnv>();

solutionsRoutes.get("/", async (c) => {
  const parsed = listSolutionsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listSolutions(parsed.data);
  return c.json({ success: true, data: result });
});

solutionsRoutes.get("/:slug", async (c) => {
  const solution = await getSolutionBySlug(c.req.param("slug"));
  return c.json({ success: true, data: solution });
});

solutionsRoutes.post("/", authenticate(), requirePermission("solutions:write"), async (c) => {
  const parsed = createSolutionSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid solution payload", parsed.error.flatten().fieldErrors);
  }

  const solution = await addSolution(parsed.data);
  return c.json({ success: true, data: solution }, 201);
});

solutionsRoutes.patch(
  "/:id",
  authenticate(),
  requirePermission("solutions:write"),
  async (c) => {
    const parsed = updateSolutionSchema.safeParse(await c.req.json());
    if (!parsed.success) {
      throw new ValidationError("Invalid solution payload", parsed.error.flatten().fieldErrors);
    }

    const solution = await editSolution(c.req.param("id"), parsed.data);
    return c.json({ success: true, data: solution });
  },
);

solutionsRoutes.delete(
  "/:id",
  authenticate(),
  requirePermission("solutions:delete"),
  async (c) => {
    await removeSolution(c.req.param("id"));
    return c.json({ success: true, data: null });
  },
);
