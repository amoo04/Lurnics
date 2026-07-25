import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { getBindings } from "../../lib/env.js";
import { findBusinessById, findPlatformUserById } from "./platform.repository.js";
import { platformLoginSchema, registerBusinessSchema, updateBusinessSchema } from "./platform.schema.js";
import { loginPlatformUser, registerBusiness, updateBusinessSettings } from "./platform.service.js";

export const platformRoutes = new Hono<AppEnv>();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days, matches the platform token's expiry
};

platformRoutes.post("/register", async (c) => {
  const parsed = registerBusinessSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid registration payload", parsed.error.flatten().fieldErrors);
  }

  const result = await registerBusiness(parsed.data);

  setCookie(c, "platform_access_token", result.token, {
    ...COOKIE_OPTIONS,
    secure: getBindings().NODE_ENV === "production",
  });

  return c.json({ success: true, data: result }, 201);
});

platformRoutes.post("/login", async (c) => {
  const parsed = platformLoginSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid login payload", parsed.error.flatten().fieldErrors);
  }

  const result = await loginPlatformUser(parsed.data);

  setCookie(c, "platform_access_token", result.token, {
    ...COOKIE_OPTIONS,
    secure: getBindings().NODE_ENV === "production",
  });

  return c.json({ success: true, data: result });
});

platformRoutes.post("/logout", (c) => {
  deleteCookie(c, "platform_access_token", { path: "/" });
  return c.json({ success: true, data: null });
});

platformRoutes.get("/me", authenticatePlatform(), async (c) => {
  const [user, business] = await Promise.all([
    findPlatformUserById(c.get("platformUserId")),
    findBusinessById(c.get("businessId")),
  ]);

  return c.json({
    success: true,
    data: {
      user: user && { id: user.id, email: user.email, name: user.name },
      business: business && {
        id: business.id,
        name: business.name,
        slug: business.slug,
        currency: business.currency,
        theme: business.theme,
        customDomain: business.customDomain,
      },
      role: c.get("businessRole"),
    },
  });
});

platformRoutes.patch("/business", authenticatePlatform(), async (c) => {
  const parsed = updateBusinessSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid business payload", parsed.error.flatten().fieldErrors);
  }

  const business = await updateBusinessSettings(c.get("businessId"), parsed.data);
  return c.json({
    success: true,
    data: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      currency: business.currency,
      theme: business.theme,
      customDomain: business.customDomain,
    },
  });
});
