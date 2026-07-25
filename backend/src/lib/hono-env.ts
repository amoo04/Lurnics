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
    // Set only on platform (business/tenant) routes - see
    // middleware/platform-auth.ts. Unrelated to the internal admin fields
    // above, and never both set on the same request.
    platformUserId: string;
    platformUserEmail: string;
    platformUserName: string;
    businessId: string;
    businessRole: string;
  };
}
