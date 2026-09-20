import { defineConfig } from "drizzle-kit";

// Separate from drizzle.config.ts (which targets the local Turso/libsql dev
// database) - this one generates D1-compatible migration SQL from the same
// schema.ts, into wrangler.jsonc's configured migrations_dir ("drizzle"),
// applied via `wrangler d1 migrations apply <db-name> --remote`.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
