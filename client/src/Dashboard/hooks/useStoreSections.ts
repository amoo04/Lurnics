import { apiGet, apiPatch, apiPost } from "../../lib/api";
import type { StoreSection } from "../api/store-sections.types";

export function fetchSections() {
  return apiGet<StoreSection[]>("/api/platform/store-sections");
}

export function updateSection(id: string, patch: { visible?: boolean; content?: Record<string, unknown> }) {
  return apiPatch<StoreSection>(`/api/platform/store-sections/${id}`, patch);
}

export function reorderSections(orderedIds: string[]) {
  return apiPost<StoreSection[]>("/api/platform/store-sections/reorder", { orderedIds });
}
