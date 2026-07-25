import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type { CreateNavItemInput, NavItem, UpdateNavItemInput } from "../api/navigation.types";

export function fetchNavItems(location = "main") {
  return apiGet<NavItem[]>(`/api/platform/navigation?location=${location}`);
}

export function createNavItem(input: CreateNavItemInput) {
  return apiPost<NavItem>("/api/platform/navigation", input);
}

export function updateNavItem(id: string, patch: UpdateNavItemInput) {
  return apiPatch<NavItem>(`/api/platform/navigation/${id}`, patch);
}

export function deleteNavItem(id: string) {
  return apiDelete<null>(`/api/platform/navigation/${id}`);
}

export function reorderNavItems(location: string, orderedIds: string[]) {
  return apiPost<NavItem[]>("/api/platform/navigation/reorder", { location, orderedIds });
}
