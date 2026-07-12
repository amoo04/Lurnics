import { apiDelete, apiPatch, apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { CreateProjectInput, Paginated, Project } from "../api/projects.types";

export function useProjects(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  clientId?: string;
}) {
  const query = buildQuery({
    page: params.page,
    limit: params.limit ?? 6,
    search: params.search,
    status: params.status,
    clientId: params.clientId,
  });
  return useApiGet<Paginated<Project>>(`/api/projects${query}`);
}

export function createProject(input: CreateProjectInput) {
  return apiPost<Project>("/api/projects", input);
}

export function updateProject(id: string, input: Partial<CreateProjectInput> & { status?: string }) {
  return apiPatch<Project>(`/api/projects/${id}`, input);
}

export function deleteProject(id: string) {
  return apiDelete(`/api/projects/${id}`);
}
