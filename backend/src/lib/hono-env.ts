import type { Env } from "hono";

export interface AppEnv extends Env {
  Variables: {
    userId: string;
    userEmail: string;
    userRole: string;
    userRoles: string[];
    userPermissions: string[];
  };
}
