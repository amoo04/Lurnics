import { findLeadsFunnel, findLeadsOverTime } from "./analytics.repository.js";

export async function getLeadsFunnel() {
  return findLeadsFunnel();
}

export async function getLeadsOverTime(query: { months?: string }) {
  const months = Math.min(24, Math.max(1, Number.parseInt(query.months ?? "6", 10) || 6));
  return findLeadsOverTime(months);
}
