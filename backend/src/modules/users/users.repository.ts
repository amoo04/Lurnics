import { and, eq, isNull, like, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { userRoles, users, type NewUserRow } from "../../db/schema.js";

export async function findUsers(search: string | undefined, limit: number, offset: number) {
  const conditions = [isNull(users.deletedAt)];
  if (search) conditions.push(like(users.name, `%${search}%`));
  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db.query.users.findMany({
      where,
      limit,
      offset,
      orderBy: (t, { desc }) => desc(t.createdAt),
      columns: { passwordHash: false },
      with: { userRoles: { with: { role: true } } },
    }),
    db.$count(users, where),
  ]);

  return { items, total };
}

export async function findActiveUserIds(): Promise<string[]> {
  const rows = await db.query.users.findMany({
    where: isNull(users.deletedAt),
    columns: { id: true },
  });
  return rows.map((row) => row.id);
}

export async function findUserById(id: string) {
  return db.query.users.findFirst({
    where: and(eq(users.id, id), isNull(users.deletedAt)),
    columns: { passwordHash: false },
    with: { userRoles: { with: { role: true } } },
  });
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: and(eq(users.email, email), isNull(users.deletedAt)),
  });
}

export async function createUser(input: NewUserRow) {
  const [row] = await db.insert(users).values(input).returning();
  return row;
}

export async function updateUser(id: string, input: Partial<NewUserRow>) {
  const [row] = await db.update(users).set(input).where(eq(users.id, id)).returning();
  return row;
}

export async function softDeleteUser(id: string) {
  await db
    .update(users)
    .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(users.id, id));
}

export async function setUserRoles(userId: string, roleIds: string[]) {
  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  if (roleIds.length === 0) return;
  await db.insert(userRoles).values(roleIds.map((roleId) => ({ userId, roleId })));
}
