import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { createUserSchema, listUsersQuerySchema, updateUserSchema } from "./users.schema.js";
import { addUser, editUser, getUser, listUsers, removeUser } from "./users.service.js";

export const usersRoutes = new Hono<AppEnv>();

usersRoutes.use("*", authenticate());

usersRoutes.get("/", requirePermission("users:read"), async (c) => {
  const parsed = listUsersQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listUsers(parsed.data);
  return c.json({ success: true, data: result });
});

usersRoutes.get("/:id", requirePermission("users:read"), async (c) => {
  const user = await getUser(c.req.param("id"));
  return c.json({ success: true, data: user });
});

usersRoutes.post("/", requirePermission("users:write"), async (c) => {
  const parsed = createUserSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid user payload", parsed.error.flatten().fieldErrors);
  }

  const user = await addUser(parsed.data);
  return c.json({ success: true, data: user }, 201);
});

usersRoutes.patch("/:id", requirePermission("users:write"), async (c) => {
  const parsed = updateUserSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid user payload", parsed.error.flatten().fieldErrors);
  }

  const user = await editUser(c.req.param("id"), parsed.data);
  return c.json({ success: true, data: user });
});

usersRoutes.delete("/:id", requirePermission("users:delete"), async (c) => {
  await removeUser(c.req.param("id"));
  return c.json({ success: true, data: null });
});
