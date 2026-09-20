import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate } from "../../middleware/auth.js";
import { listNotificationsQuerySchema } from "./notifications.schema.js";
import {
  listNotifications,
  readAllNotifications,
  readNotification,
} from "./notifications.service.js";

export const notificationsRoutes = new Hono<AppEnv>();

notificationsRoutes.use("*", authenticate());

notificationsRoutes.get("/", async (c) => {
  const parsed = listNotificationsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listNotifications(c.get("userId"), parsed.data);
  return c.json({ success: true, data: result });
});

notificationsRoutes.patch("/:id/read", async (c) => {
  const notification = await readNotification(c.req.param("id"));
  return c.json({ success: true, data: notification });
});

notificationsRoutes.patch("/read-all", async (c) => {
  await readAllNotifications(c.get("userId"));
  return c.json({ success: true, data: null });
});
