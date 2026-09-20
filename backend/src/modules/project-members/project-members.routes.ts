import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { requirePermission } from "../../middleware/auth.js";
import { addProjectMemberSchema } from "./project-members.schema.js";
import {
  assignProjectMember,
  listProjectMembers,
  unassignProjectMember,
} from "./project-members.service.js";

export const projectMembersRoutes = new Hono<AppEnv>();

projectMembersRoutes.get("/", requirePermission("projects:read"), async (c) => {
  const members = await listProjectMembers(c.req.param("projectId") as string);
  return c.json({ success: true, data: members });
});

projectMembersRoutes.post("/", requirePermission("projects:write"), async (c) => {
  const parsed = addProjectMemberSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid member payload", parsed.error.flatten().fieldErrors);
  }

  const member = await assignProjectMember(c.req.param("projectId") as string, parsed.data);
  return c.json({ success: true, data: member }, 201);
});

projectMembersRoutes.delete("/:userId", requirePermission("projects:write"), async (c) => {
  await unassignProjectMember(c.req.param("projectId") as string, c.req.param("userId"));
  return c.json({ success: true, data: null });
});
