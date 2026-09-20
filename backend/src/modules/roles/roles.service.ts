import { ConflictError, NotFoundError } from "../../middleware/error.js";
import {
  createRole,
  deleteRole,
  findAllPermissions,
  findRoleById,
  findRoleByName,
  findRoles,
  setRolePermissions,
  updateRole,
} from "./roles.repository.js";
import type { CreateRoleInput, UpdateRoleInput } from "./roles.schema.js";

export async function listRoles() {
  return findRoles();
}

export async function listPermissions() {
  return findAllPermissions();
}

export async function getRole(id: string) {
  const role = await findRoleById(id);
  if (!role) throw new NotFoundError("Role not found");
  return role;
}

export async function addRole(input: CreateRoleInput) {
  const existing = await findRoleByName(input.name);
  if (existing) throw new ConflictError("Role with this name already exists");
  return createRole(input);
}

export async function editRole(id: string, input: UpdateRoleInput) {
  await getRole(id);
  return updateRole(id, input);
}

export async function removeRole(id: string) {
  await getRole(id);
  await deleteRole(id);
}

export async function assignRolePermissions(id: string, permissionIds: string[]) {
  await getRole(id);
  await setRolePermissions(id, permissionIds);
  return getRole(id);
}
