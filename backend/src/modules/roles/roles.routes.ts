import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { createRoleSchema, setRolePermissionsSchema, updateRoleSchema } from "./roles.schema.js";
import {
  addRole,
  assignRolePermissions,
  editRole,
  getRole,
  listPermissions,
  listRoles,
  removeRole,
} from "./roles.service.js";

export const rolesRoutes = new Hono<AppEnv>();

rolesRoutes.use("*", authenticate());

rolesRoutes.get("/", requirePermission("roles:read"), async (c) => {
  const roles = await listRoles();
  return c.json({ success: true, data: roles });
});

rolesRoutes.get("/permissions", requirePermission("roles:read"), async (c) => {
  const permissions = await listPermissions();
  return c.json({ success: true, data: permissions });
});

rolesRoutes.get("/:id", requirePermission("roles:read"), async (c) => {
  const role = await getRole(c.req.param("id"));
  return c.json({ success: true, data: role });
});

rolesRoutes.post("/", requirePermission("roles:write"), async (c) => {
  const parsed = createRoleSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid role payload", parsed.error.flatten().fieldErrors);
  }

  const role = await addRole(parsed.data);
  return c.json({ success: true, data: role }, 201);
});

rolesRoutes.patch("/:id", requirePermission("roles:write"), async (c) => {
  const parsed = updateRoleSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid role payload", parsed.error.flatten().fieldErrors);
  }

  const role = await editRole(c.req.param("id"), parsed.data);
  return c.json({ success: true, data: role });
});

rolesRoutes.put("/:id/permissions", requirePermission("roles:write"), async (c) => {
  const parsed = setRolePermissionsSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid permissions payload", parsed.error.flatten().fieldErrors);
  }

  const role = await assignRolePermissions(c.req.param("id"), parsed.data.permissionIds);
  return c.json({ success: true, data: role });
});

rolesRoutes.delete("/:id", requirePermission("roles:delete"), async (c) => {
  await removeRole(c.req.param("id"));
  return c.json({ success: true, data: null });
});
