import "dotenv/config";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./index.js";
import { users, roles, permissions, rolePermissions, userRoles } from "./schema.js";

const SUPER_ADMIN_ROLE = "super_admin";
const WILDCARD_PERMISSION = "*:*";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error("SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_ADMIN_NAME must be set in the environment");
  }

  let role = await db.query.roles.findFirst({ where: eq(roles.name, SUPER_ADMIN_ROLE) });
  if (!role) {
    [role] = await db.insert(roles).values({ name: SUPER_ADMIN_ROLE, description: "Full system access" }).returning();
    console.log(`Created role: ${SUPER_ADMIN_ROLE}`);
  }

  let permission = await db.query.permissions.findFirst({ where: eq(permissions.name, WILDCARD_PERMISSION) });
  if (!permission) {
    [permission] = await db
      .insert(permissions)
      .values({ name: WILDCARD_PERMISSION, description: "Unrestricted access to all resources" })
      .returning();
    console.log(`Created permission: ${WILDCARD_PERMISSION}`);
  }

  const existingLink = await db.query.rolePermissions.findFirst({
    where: and(eq(rolePermissions.roleId, role.id), eq(rolePermissions.permissionId, permission.id)),
  });
  if (!existingLink) {
    await db.insert(rolePermissions).values({ roleId: role.id, permissionId: permission.id });
    console.log("Linked role to permission");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (user) {
    await db.update(users).set({ passwordHash, name }).where(eq(users.id, user.id));
    console.log(`Updated existing user: ${email}`);
  } else {
    [user] = await db.insert(users).values({ email, passwordHash, name, isEmailVerified: true }).returning();
    console.log(`Created user: ${email}`);
  }

  const existingUserRole = await db.query.userRoles.findFirst({
    where: and(eq(userRoles.userId, user.id), eq(userRoles.roleId, role.id)),
  });
  if (!existingUserRole) {
    await db.insert(userRoles).values({ userId: user.id, roleId: role.id });
    console.log("Linked user to super_admin role");
  }

  console.log(`\nSuper admin ready:`);
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
