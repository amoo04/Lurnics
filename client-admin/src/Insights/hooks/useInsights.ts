import { apiDelete, apiPatch, apiPost } from "../../lib/api";
import { useApiGet, buildQuery } from "../../lib/useApi";
import type { Article, CreateArticleInput, Paginated } from "../api/insights.types";

export function useInsights(status?: string) {
  return useApiGet<Paginated<Article>>(`/api/articles/admin${buildQuery({ status, limit: 100 })}`);
}

export function createArticle(input: CreateArticleInput) {
  return apiPost<Article>("/api/articles", input);
}

export function updateArticle(id: string, input: Partial<CreateArticleInput>) {
  return apiPatch<Article>(`/api/articles/${id}`, input);
}

export function deleteArticle(id: string) {
  return apiDelete(`/api/articles/${id}`);
}
