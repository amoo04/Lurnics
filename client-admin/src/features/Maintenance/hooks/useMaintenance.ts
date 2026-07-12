import { apiDelete, apiPatch, apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { CreateMaintenanceInput, MaintenanceContract, Paginated } from "../api/maintenance.types";

export function useMaintenanceContracts(params: { page?: number; limit?: number; search?: string; status?: string }) {
  const query = buildQuery({ page: params.page, limit: params.limit ?? 8, search: params.search, status: params.status });
  return useApiGet<Paginated<MaintenanceContract>>(`/api/maintenance${query}`);
}

export function createMaintenance(input: CreateMaintenanceInput) {
  return apiPost<MaintenanceContract>("/api/maintenance", input);
}

export function updateMaintenance(id: string, input: Partial<CreateMaintenanceInput>) {
  return apiPatch<MaintenanceContract>(`/api/maintenance/${id}`, input);
}

export function deleteMaintenance(id: string) {
  return apiDelete(`/api/maintenance/${id}`);
}
