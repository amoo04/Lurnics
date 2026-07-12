import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { appSettings } from "../../db/schema.js";

export async function findSettings() {
  return db.query.appSettings.findFirst({ where: eq(appSettings.id, "default") });
}

export async function upsertSettings(data: Record<string, unknown>) {
  const existing = await findSettings();

  if (!existing) {
    const [row] = await db
      .insert(appSettings)
      .values({ id: "default", data, updatedAt: new Date().toISOString() })
      .returning();
    return row;
  }

  const [row] = await db
    .update(appSettings)
    .set({ data: { ...(existing.data as Record<string, unknown>), ...data }, updatedAt: new Date().toISOString() })
    .where(eq(appSettings.id, "default"))
    .returning();
  return row;
}
