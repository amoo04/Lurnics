import {
  findInvoicesByStatus,
  findProjectsByStatus,
  findRevenueByMonth,
} from "./reports.repository.js";

export async function getRevenueReport(query: { months?: string }) {
  const months = Math.min(24, Math.max(1, Number.parseInt(query.months ?? "6", 10) || 6));
  return findRevenueByMonth(months);
}

export async function getProjectsReport() {
  return findProjectsByStatus();
}

export async function getInvoicesReport() {
  return findInvoicesByStatus();
}
