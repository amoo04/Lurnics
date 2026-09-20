import { findLeadsBySource, findLeadsByService, findLeadsFunnel, findLeadsOverTime } from "./analytics.repository.js";

export async function getLeadsFunnel() {
  return findLeadsFunnel();
}

export async function getLeadsOverTime(query: { months?: string }) {
  const months = Math.min(24, Math.max(1, Number.parseInt(query.months ?? "6", 10) || 6));
  return findLeadsOverTime(months);
}

export async function getLeadsBySource() {
  return findLeadsBySource();
}

export async function getLeadsByService() {
  const rows = await findLeadsByService();
  return rows.map((row) => ({
    ...row,
    conversionRate: row.count > 0 ? Math.round((row.wonCount / row.count) * 1000) / 10 : 0,
  }));
}
