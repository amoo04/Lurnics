import { useInvoicesReport } from "../hooks/useReports";
import { formatCurrency } from "../../lib/uiHelpers";

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-green-500",
  pending: "bg-yellow-400",
  overdue: "bg-red-500",
  draft: "bg-gray-400",
};

export default function InvoicesReportCard() {
  const { data, loading, error } = useInvoicesReport();
  const totalAmount = data?.reduce((sum, d) => sum + d.total, 0) ?? 0;
  const maxTotal = data?.reduce((max, d) => Math.max(max, d.total), 0) ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 font-semibold text-gray-900">Invoices by Status</h3>
      <p className="mb-4 text-xs text-gray-500">{data ? formatCurrency(totalAmount) : "—"} total invoiced</p>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (!data || data.length === 0) && (
        <p className="text-sm text-gray-500">No invoices yet.</p>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((row) => (
            <li key={row.status}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 capitalize text-gray-700">
                  <span className={`h-2 w-2 rounded-full ${STATUS_COLOR[row.status] ?? "bg-gray-400"}`} />
                  {row.status}
                  <span className="text-xs text-gray-400">({row.count})</span>
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(row.total)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div
                  className={`h-1.5 rounded-full ${STATUS_COLOR[row.status] ?? "bg-gray-400"}`}
                  style={{ width: maxTotal > 0 ? `${(row.total / maxTotal) * 100}%` : "0%" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
