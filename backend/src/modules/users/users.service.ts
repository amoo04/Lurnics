import bcrypt from "bcryptjs";
import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUsers,
  setUserRoles,
  softDeleteUser,
  updateUser,
} from "./users.repository.js";
import type { CreateUserInput, UpdateUserInput } from "./users.schema.js";

export async function listUsers(query: { page?: string; limit?: string; search?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findUsers(query.search, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getUser(id: string) {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function addUser(input: CreateUserInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new ConflictError("User with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({
    email: input.email,
    passwordHash,
    name: input.name,
    phone: input.phone,
  });

  if (input.roleIds?.length) {
    await setUserRoles(user.id, input.roleIds);
  }

  const { passwordHash: _hash, ...safeUser } = user;
  return safeUser;
}

export async function editUser(id: string, input: UpdateUserInput) {
  await getUser(id);
  const { roleIds, ...rest } = input;
  const user = await updateUser(id, rest);

  if (roleIds) {
    await setUserRoles(id, roleIds);
  }

  const { passwordHash: _hash, ...safeUser } = user;
  return safeUser;
}

export async function removeUser(id: string) {
  await getUser(id);
  await softDeleteUser(id);
}
