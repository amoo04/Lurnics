import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createNotification,
  findNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notifications.repository.js";

export async function listNotifications(userId: string, query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findNotificationsForUser(
    userId,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function notify(
  userId: string,
  title: string,
  message: string,
  notificationType: string,
) {
  return createNotification({ userId, title, message, notificationType });
}

export async function readNotification(id: string) {
  return markNotificationRead(id);
}

export async function readAllNotifications(userId: string) {
  await markAllNotificationsRead(userId);
}
