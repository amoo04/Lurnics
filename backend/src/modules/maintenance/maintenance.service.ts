import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import {
  createMaintenance,
  deleteMaintenance,
  findMaintenanceById,
  findMaintenanceContracts,
  updateMaintenance,
} from "./maintenance.repository.js";
import type { CreateMaintenanceInput, UpdateMaintenanceInput } from "./maintenance.schema.js";

export async function listMaintenance(query: {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findMaintenanceContracts(
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getMaintenance(id: string) {
  const contract = await findMaintenanceById(id);
  if (!contract) throw new NotFoundError("Maintenance contract not found");
  return contract;
}

export async function addMaintenance(userId: string, input: CreateMaintenanceInput) {
  const contract = await createMaintenance({ ...input, autoReminder: input.autoReminder ?? true });
  await logActivity(userId, "create", "maintenance", contract.id);
  return contract;
}

export async function editMaintenance(userId: string, id: string, input: UpdateMaintenanceInput) {
  await getMaintenance(id);
  const contract = await updateMaintenance(id, input);
  await logActivity(userId, "update", "maintenance", id);
  return contract;
}

export async function removeMaintenance(userId: string, id: string) {
  await getMaintenance(id);
  await deleteMaintenance(id);
  await logActivity(userId, "delete", "maintenance", id);
}
