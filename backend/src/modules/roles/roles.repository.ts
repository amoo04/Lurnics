import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { permissions, rolePermissions, roles, type NewRoleRow } from "../../db/schema.js";

export async function findRoles() {
  return db.query.roles.findMany({
    with: { rolePermissions: { with: { permission: true } } },
    orderBy: (t, { asc }) => asc(t.name),
  });
}

export async function findRoleById(id: string) {
  return db.query.roles.findFirst({
    where: eq(roles.id, id),
    with: { rolePermissions: { with: { permission: true } } },
  });
}

export async function findRoleByName(name: string) {
  return db.query.roles.findFirst({ where: eq(roles.name, name) });
}

export async function createRole(input: NewRoleRow) {
  const [row] = await db.insert(roles).values(input).returning();
  return row;
}

export async function updateRole(id: string, input: Partial<NewRoleRow>) {
  const [row] = await db.update(roles).set(input).where(eq(roles.id, id)).returning();
  return row;
}

export async function deleteRole(id: string) {
  await db.delete(roles).where(eq(roles.id, id));
}

export async function findAllPermissions() {
  return db.query.permissions.findMany({ orderBy: (t, { asc }) => asc(t.name) });
}

export async function setRolePermissions(roleId: string, permissionIds: string[]) {
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  if (permissionIds.length === 0) return;
  await db
    .insert(rolePermissions)
    .values(permissionIds.map((permissionId) => ({ roleId, permissionId })));
}
