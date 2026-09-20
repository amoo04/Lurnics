import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { integrationConfigs } from "../../db/schema.js";

export async function findIntegrations() {
  return db.query.integrationConfigs.findMany({ orderBy: (t, { asc }) => asc(t.key) });
}

export async function findIntegrationByKey(key: string) {
  return db.query.integrationConfigs.findFirst({ where: eq(integrationConfigs.key, key) });
}

export async function upsertIntegration(
  key: string,
  input: { config?: Record<string, unknown>; connected?: boolean },
) {
  const existing = await findIntegrationByKey(key);

  if (!existing) {
    const [row] = await db
      .insert(integrationConfigs)
      .values({
        key,
        config: input.config ?? {},
        connected: input.connected ?? false,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    return row;
  }

  const [row] = await db
    .update(integrationConfigs)
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(integrationConfigs.key, key))
    .returning();
  return row;
}
