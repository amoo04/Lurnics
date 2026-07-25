import { apiPatch } from "../../lib/api";
import { useApiGet } from "../../lib/useApi";
import type { Notification, Paginated } from "../api/notifications.types";

export function useNotifications() {
  return useApiGet<Paginated<Notification>>("/api/notifications?limit=20");
}

export function markNotificationRead(id: string) {
  return apiPatch<Notification>(`/api/notifications/${id}/read`);
}

export function markAllNotificationsRead() {
  return apiPatch<null>("/api/notifications/read-all");
}
