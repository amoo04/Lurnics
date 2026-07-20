import type { Env } from "hono";
import type { AppBindings } from "./env.js";

export interface AppEnv extends Env {
  Bindings: AppBindings;
  Variables: {
    userId: string;
    userEmail: string;
    userName: string;
    userRole: string;
    userRoles: string[];
    userPermissions: string[];
  };
}
