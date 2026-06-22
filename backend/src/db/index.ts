import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./data/lurnics.db",
});

// SQLite has no native "ON UPDATE CURRENT_TIMESTAMP" column clause, so
// updated_at is kept in sync via triggers instead of relying on every
// repository remembering to set it by hand.
const TABLES_WITH_UPDATED_AT = ["users", "roles", "clients", "projects"];

for (const table of TABLES_WITH_UPDATED_AT) {
  await client.execute(`
    CREATE TRIGGER IF NOT EXISTS ${table}_set_updated_at
    AFTER UPDATE ON ${table}
    BEGIN
      UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
}

export const db = drizzle(client, { schema });
