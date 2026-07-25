import { useApiGet } from "../../lib/useApi";
import type { ActivityLogEntry, Paginated, ProjectStatusCount, RevenuePoint } from "../api/dashboard.types";
import type { Project } from "../../Projects/api/projects.types";

export function useRevenue() {
  return useApiGet<RevenuePoint[]>("/api/reports/revenue?months=6");
}

export function useProjectsByStatus() {
  return useApiGet<ProjectStatusCount[]>("/api/reports/projects");
}

export function useRecentActivity() {
  return useApiGet<Paginated<ActivityLogEntry>>("/api/activity-logs?limit=5");
}

export function useRecentProjects() {
  return useApiGet<Paginated<Project>>("/api/projects?limit=5");
}

export function useDashboardCounts() {
  const clients = useApiGet<Paginated<unknown>>("/api/clients?limit=1");
  const projects = useApiGet<Paginated<unknown>>("/api/projects?limit=1");
  const leads = useApiGet<Paginated<unknown>>("/api/leads?limit=1");

  return {
    totalClients: clients.data?.pagination.total ?? null,
    totalProjects: projects.data?.pagination.total ?? null,
    totalLeads: leads.data?.pagination.total ?? null,
    loading: clients.loading || projects.loading || leads.loading,
  };
}
