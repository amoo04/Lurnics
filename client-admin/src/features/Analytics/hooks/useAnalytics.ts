import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { LeadsBySourceRow, LeadsByServiceRow, LeadsFunnelRow, LeadsOverTimePoint } from "../api/analytics.types";

export function useLeadsFunnel() {
  return useApiGet<LeadsFunnelRow[]>("/api/analytics/leads-funnel");
}

export function useLeadsOverTime(months?: number) {
  return useApiGet<LeadsOverTimePoint[]>(`/api/analytics/leads-over-time${buildQuery({ months })}`);
}

export function useLeadsBySource() {
  return useApiGet<LeadsBySourceRow[]>("/api/analytics/leads-by-source");
}

export function useLeadsByService() {
  return useApiGet<LeadsByServiceRow[]>("/api/analytics/leads-by-service");
}
