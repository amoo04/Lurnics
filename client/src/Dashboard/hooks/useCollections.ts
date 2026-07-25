import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  Collection,
  CollectionDetail,
  CollectionListResult,
  CollectionStats,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../api/collections.types";

export function fetchCollections(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<CollectionListResult>(`/api/platform/collections${qs ? `?${qs}` : ""}`);
}

export function fetchCollectionStats() {
  return apiGet<CollectionStats>("/api/platform/collections/stats");
}

export function fetchCollection(id: string) {
  return apiGet<CollectionDetail>(`/api/platform/collections/${id}`);
}

export function createCollection(input: CreateCollectionInput) {
  return apiPost<Collection>("/api/platform/collections", input);
}

export function updateCollection(id: string, patch: UpdateCollectionInput) {
  return apiPatch<CollectionDetail>(`/api/platform/collections/${id}`, patch);
}

export function deleteCollection(id: string) {
  return apiDelete<null>(`/api/platform/collections/${id}`);
}
