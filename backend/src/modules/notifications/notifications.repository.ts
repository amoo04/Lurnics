import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { notifications, type NewNotificationRow } from "../../db/schema.js";

export async function findNotificationsForUser(userId: string, limit: number, offset: number) {
  const where = eq(notifications.userId, userId);

  const [items, total] = await Promise.all([
    db.query.notifications.findMany({
      where,
      limit,
      offset,
      orderBy: (t, { desc }) => desc(t.createdAt),
    }),
    db.$count(notifications, where),
  ]);

  return { items, total };
}

export async function createNotification(input: NewNotificationRow) {
  const [row] = await db.insert(notifications).values(input).returning();
  return row;
}

export async function markNotificationRead(id: string) {
  const [row] = await db
    .update(notifications)
    .set({ readStatus: true })
    .where(eq(notifications.id, id))
    .returning();
  return row;
}

export async function markAllNotificationsRead(userId: string) {
  await db
    .update(notifications)
    .set({ readStatus: true })
    .where(eq(notifications.userId, userId));
}
