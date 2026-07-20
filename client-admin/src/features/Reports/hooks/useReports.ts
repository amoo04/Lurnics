import { useApiGet, buildQuery } from "../../../lib/useApi";
import type {
  DocumentsReport,
  InvoicesByStatusRow,
  ProjectsByStatusRow,
  RevenuePoint,
} from "../api/reports.types";

export function useRevenueReport(months?: number) {
  return useApiGet<RevenuePoint[]>(`/api/reports/revenue${buildQuery({ months })}`);
}

export function useProjectsReport() {
  return useApiGet<ProjectsByStatusRow[]>("/api/reports/projects");
}

export function useInvoicesReport() {
  return useApiGet<InvoicesByStatusRow[]>("/api/reports/invoices");
}

export function useDocumentsReport() {
  return useApiGet<DocumentsReport>("/api/reports/documents");
}
