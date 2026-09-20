import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type { CreatePageInput, Page, PageListResult, PageStats, UpdatePageInput } from "../api/pages.types";

export function fetchPages(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<PageListResult>(`/api/platform/pages${qs ? `?${qs}` : ""}`);
}

export function fetchPageStats() {
  return apiGet<PageStats>("/api/platform/pages/stats");
}

export function createPage(input: CreatePageInput) {
  return apiPost<Page>("/api/platform/pages", input);
}

export function updatePage(id: string, patch: UpdatePageInput) {
  return apiPatch<Page>(`/api/platform/pages/${id}`, patch);
}

export function deletePage(id: string) {
  return apiDelete<null>(`/api/platform/pages/${id}`);
}
