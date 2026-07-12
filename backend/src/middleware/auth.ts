import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import * as jose from "jose";
import { UnauthorizedError, ForbiddenError } from "./error.js";
import type { AppEnv } from "../lib/hono-env.js";

export type JWTPayload = {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export async function signToken(
  payload: Omit<JWTPayload, "iat" | "exp">,
): Promise<string> {
  const key = new TextEncoder().encode(getSecret());
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const key = new TextEncoder().encode(getSecret());
    const { payload } = await jose.jwtVerify(token, key);
    return payload as unknown as JWTPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

function extractToken(c: Context<AppEnv>): string | undefined {
  const authHeader = c.req.header("Authorization");
  return authHeader?.replace("Bearer ", "") || getCookie(c, "access_token");
}

function applyPayload(c: Context<AppEnv>, payload: JWTPayload) {
  c.set("userId", payload.sub);
  c.set("userEmail", payload.email);
  c.set("userName", payload.name);
  c.set("userRoles", payload.roles);
  c.set("userPermissions", payload.permissions);
  c.set("userRole", payload.roles[0] ?? "");
}

export function authenticate(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const token = extractToken(c);
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = await verifyToken(token);
    applyPayload(c, payload);

    await next();
  };
}

export function requireRole(...roles: string[]): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const userRoles = c.get("userRoles");

    if (!userRoles || userRoles.length === 0) {
      throw new ForbiddenError("Insufficient permissions");
    }

    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      throw new ForbiddenError(`Requires role: ${roles.join(" or ")}`);
    }

    await next();
  };
}

export function requirePermission(permission: string): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const userPermissions = c.get("userPermissions");

    if (!userPermissions || userPermissions.length === 0) {
      throw new ForbiddenError("Permission denied");
    }

    const hasPerm = userPermissions.includes(permission) || userPermissions.includes("*:*");
    if (!hasPerm) {
      throw new ForbiddenError(`Permission denied: ${permission}`);
    }

    await next();
  };
}

export function requireAnyPermission(permissions: string[]): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const userPermissions = c.get("userPermissions");

    if (!userPermissions || userPermissions.length === 0) {
      throw new ForbiddenError("Permission denied");
    }

    const hasAny = permissions.some(
      (p) => userPermissions.includes(p) || userPermissions.includes("*:*"),
    );
    if (!hasAny) {
      throw new ForbiddenError(`Permission denied: requires one of [${permissions.join(", ")}]`);
    }

    await next();
  };
}

export function optionalAuth(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const token = extractToken(c);

    if (token) {
      try {
        const payload = await verifyToken(token);
        applyPayload(c, payload);
      } catch {
        // Token invalid, continue without auth
      }
    }

    await next();
  };
}

export function adminOnly(): MiddlewareHandler<AppEnv> {
  return requireRole("admin");
}
