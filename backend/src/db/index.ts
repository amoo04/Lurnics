import { createClient, type Client } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "./schema.js";
import { getBindings } from "../lib/env.js";

// SQLite has no native "ON UPDATE CURRENT_TIMESTAMP" column clause, so
// updated_at is kept in sync via triggers instead of relying on every
// repository remembering to set it by hand.
const TABLES_WITH_UPDATED_AT = ["users", "roles", "clients", "projects", "pages", "store_sections", "blog_posts"];

type DrizzleDb = ReturnType<typeof drizzleLibsql<typeof schema>>;

let libsqlClient: Client | null = null;
let realDb: DrizzleDb | null = null;
let triggersReady: Promise<void> | null = null;
let usingD1 = false;

// Two drivers, one query API: production/staging (deployed, or `wrangler
// dev`) run on the real D1 binding; local Node dev (`pnpm dev`) has no D1
// binding available at all, so it falls back to a local SQLite file via
// @libsql/client. Both produce a drizzle instance with the identical
// select/insert/query.* surface the ~25 repository files already use, so a
// single narrow cast here is all that's needed to keep every call site
// (and the chainable query builder) working unmodified either way.
function getDb(): DrizzleDb {
  if (!realDb) {
    const { DB } = getBindings();
    if (DB) {
      usingD1 = true;
      realDb = drizzleD1(DB, { schema }) as unknown as DrizzleDb;
    } else {
      const url = getBindings().DATABASE_URL ?? "file:./data/lurnics.db";
      libsqlClient = createClient({ url });
      realDb = drizzleLibsql(libsqlClient, { schema });
    }
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
    const { DB } = getBindings();
    for (const table of TABLES_WITH_UPDATED_AT) {
      const sql = `
        CREATE TRIGGER IF NOT EXISTS ${table}_set_updated_at
        AFTER UPDATE ON ${table}
        BEGIN
          UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
      `;
      if (usingD1 && DB) {
        await DB.exec(sql.replace(/\s+/g, " ").trim());
      } else {
        await libsqlClient!.execute(sql);
      }
    }
  })();
  return triggersReady;
}
