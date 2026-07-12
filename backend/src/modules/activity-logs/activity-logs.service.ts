import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { findActivityLogs, insertActivityLog } from "./activity-logs.repository.js";

export async function listActivityLogs(query: {
  page?: string;
  limit?: string;
  entityType?: string;
  action?: string;
  userId?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findActivityLogs(query, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

// Best-effort audit trail — a logging failure should never break the action it's recording.
export async function logActivity(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  ipAddress?: string,
) {
  try {
    await insertActivityLog({ userId: userId ?? undefined, action, entityType, entityId, ipAddress });
  } catch (error) {
    console.error("Failed to record activity log:", error);
  }
}
