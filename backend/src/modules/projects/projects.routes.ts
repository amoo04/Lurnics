import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { projectMembersRoutes } from "../project-members/project-members.routes.js";
import {
  createProjectSchema,
  listProjectsQuerySchema,
  updateProjectSchema,
} from "./projects.schema.js";
import {
  addProject,
  editProject,
  getProject,
  listProjects,
  removeProject,
} from "./projects.service.js";

export const projectsRoutes = new Hono<AppEnv>();

projectsRoutes.use("*", authenticate());

projectsRoutes.get("/", requirePermission("projects:read"), async (c) => {
  const parsed = listProjectsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listProjects(parsed.data);
  return c.json({ success: true, data: result });
});

projectsRoutes.get("/:id", requirePermission("projects:read"), async (c) => {
  const project = await getProject(c.req.param("id"));
  return c.json({ success: true, data: project });
});

projectsRoutes.post("/", requirePermission("projects:write"), async (c) => {
  const parsed = createProjectSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid project payload", parsed.error.flatten().fieldErrors);
  }

  const project = await addProject(c.get("userId"), parsed.data);
  return c.json({ success: true, data: project }, 201);
});

projectsRoutes.patch("/:id", requirePermission("projects:write"), async (c) => {
  const parsed = updateProjectSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid project payload", parsed.error.flatten().fieldErrors);
  }

  const project = await editProject(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: project });
});

projectsRoutes.delete("/:id", requirePermission("projects:delete"), async (c) => {
  await removeProject(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});

projectsRoutes.route("/:projectId/members", projectMembersRoutes);
