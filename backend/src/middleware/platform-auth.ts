import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import * as jose from "jose";
import { UnauthorizedError, ForbiddenError } from "./error.js";
import type { AppEnv } from "../lib/hono-env.js";
import { getBindings } from "../lib/env.js";

// Completely separate token space from middleware/auth.ts (internal
// admin/client-admin auth). Same JWT_SECRET, but `aud: "platform"` is
// required on verify, so a platform token can never be used against an
// internal admin route or vice versa.
export type PlatformJWTPayload = {
  sub: string; // platformUsers.id
  email: string;
  name: string;
  businessId: string;
  businessRole: string;
  iat: number;
  exp: number;
};

function getSecret(): string {
  const secret = getBindings().JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export async function signPlatformToken(
  payload: Omit<PlatformJWTPayload, "iat" | "exp">,
): Promise<string> {
  const key = new TextEncoder().encode(getSecret());
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setAudience("platform")
    .sign(key);
}

export async function verifyPlatformToken(token: string): Promise<PlatformJWTPayload> {
  try {
    const key = new TextEncoder().encode(getSecret());
    const { payload } = await jose.jwtVerify(token, key, { audience: "platform" });
    return payload as unknown as PlatformJWTPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

function extractToken(c: Context<AppEnv>): string | undefined {
  const authHeader = c.req.header("Authorization");
  return authHeader?.replace("Bearer ", "") || getCookie(c, "platform_access_token");
}

export function authenticatePlatform(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const token = extractToken(c);
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = await verifyPlatformToken(token);
    c.set("platformUserId", payload.sub);
    c.set("platformUserEmail", payload.email);
    c.set("platformUserName", payload.name);
    c.set("businessId", payload.businessId);
    c.set("businessRole", payload.businessRole);

    await next();
  };
}

export function requireBusinessRole(...roles: string[]): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const role = c.get("businessRole");
    if (!role || !roles.includes(role)) {
      throw new ForbiddenError(`Requires business role: ${roles.join(" or ")}`);
    }
    await next();
  };
}
