import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { z } from "zod";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate } from "../../middleware/auth.js";
import { login } from "./auth.service.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRoutes = new Hono<AppEnv>();

authRoutes.post("/login", async (c) => {
  const parsed = loginSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    throw new ValidationError("Invalid login payload", parsed.error.flatten().fieldErrors);
  }

  const { token, user } = await login(parsed.data);

  setCookie(c, "access_token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return c.json({ success: true, data: { user } });
});

authRoutes.post("/logout", (c) => {
  deleteCookie(c, "access_token", { path: "/" });
  return c.json({ success: true, data: null });
});

authRoutes.get("/me", authenticate(), (c) => {
  return c.json({
    success: true,
    data: {
      user: {
        id: c.get("userId"),
        email: c.get("userEmail"),
        name: c.get("userName"),
        roles: c.get("userRoles"),
      },
    },
  });
});
