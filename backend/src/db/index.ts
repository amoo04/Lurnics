import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import { getBindings } from "../lib/env.js";

// SQLite has no native "ON UPDATE CURRENT_TIMESTAMP" column clause, so
// updated_at is kept in sync via triggers instead of relying on every
// repository remembering to set it by hand.
const TABLES_WITH_UPDATED_AT = ["users", "roles", "clients", "projects"];

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let client: Client | null = null;
let realDb: DrizzleDb | null = null;
let triggersReady: Promise<void> | null = null;

// Bindings (and therefore DATABASE_URL) are only available once a request
// reaches the app - `initBindings()` runs in middleware/startup before any
// repository code executes - so the client is created lazily on first use
// rather than at module load time. Unlike a fully-async wrapper, this stays
// synchronous so drizzle's chainable query builder (`db.select().from()...`)
// keeps working exactly as before for the ~25 repository files that import
// `db` directly.
function getDb(): DrizzleDb {
  if (!realDb) {
    client = createClient({ url: getBindings().DATABASE_URL });
    realDb = drizzle(client, { schema });
  }
  return realDb;
}

export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

// Safe to call on every request (Node startup, or Workers' first-request
// middleware) - only actually runs the trigger DDL once per process/isolate.
export function ensureUpdatedAtTriggers(): Promise<void> {
  getDb();
  triggersReady ??= (async () => {
    for (const table of TABLES_WITH_UPDATED_AT) {
      await client!.execute(`
        CREATE TRIGGER IF NOT EXISTS ${table}_set_updated_at
        AFTER UPDATE ON ${table}
        BEGIN
          UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
      `);
    }
  })();
  return triggersReady;
}
