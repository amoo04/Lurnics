import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { activityLogs, type NewActivityLogRow } from "../../db/schema.js";

export async function findActivityLogs(
  filters: { entityType?: string; action?: string; userId?: string },
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (filters.entityType) conditions.push(eq(activityLogs.entityType, filters.entityType));
  if (filters.action) conditions.push(eq(activityLogs.action, filters.action));
  if (filters.userId) conditions.push(eq(activityLogs.userId, filters.userId));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.activityLogs.findMany({
      where,
      limit,
      offset,
      orderBy: desc(activityLogs.createdAt),
      with: { user: { columns: { passwordHash: false } } },
    }),
    db.$count(activityLogs, where),
  ]);

  return { items, total };
}

export async function insertActivityLog(input: NewActivityLogRow) {
  await db.insert(activityLogs).values(input);
}
