import { apiDelete, apiPatch, apiPost } from "../../lib/api";
import { buildQuery, useApiGet } from "../../lib/useApi";
import type { Client, CreateClientInput, Paginated } from "../api/clients.types";

export function useClients(params: { page?: number; search?: string; status?: string }) {
  const query = buildQuery({ page: params.page, limit: 8, search: params.search, status: params.status });
  return useApiGet<Paginated<Client>>(`/api/clients${query}`);
}

export function useClient(id: string | undefined) {
  return useApiGet<Client>(id ? `/api/clients/${id}` : null);
}

export function createClient(input: CreateClientInput) {
  return apiPost<Client>("/api/clients", input);
}

export function updateClient(id: string, input: Partial<CreateClientInput>) {
  return apiPatch<Client>(`/api/clients/${id}`, input);
}

export function deleteClient(id: string) {
  return apiDelete(`/api/clients/${id}`);
}
