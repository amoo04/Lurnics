import type { MiddlewareHandler } from "hono";
import { verifyToken } from "../lib/jwt.js";
import type { AppEnv } from "../lib/hono-env.js";

export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verifyToken(token);
    c.set("user", payload);
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  await next();
};
