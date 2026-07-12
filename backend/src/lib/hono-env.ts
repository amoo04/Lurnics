import type { Env } from "hono";

export interface AppEnv extends Env {
  Variables: {
    userId: string;
    userEmail: string;
    userName: string;
    userRole: string;
    userRoles: string[];
    userPermissions: string[];
  };
}
