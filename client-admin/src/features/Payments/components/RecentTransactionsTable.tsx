import { Banknote } from "lucide-react";
import type { Payment } from "../api/payments.types";
import { formatCurrency, formatDate } from "../../../lib/uiHelpers";

const STATUS_COLOR: Record<string, string> = {
  completed: "bg-green-500/20 text-green-300",
  pending: "bg-yellow-500/20 text-yellow-300",
  failed: "bg-red-500/20 text-red-300",
};

export default function RecentTransactionsTable({
  payments,
  loading,
  error,
}: {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Recent Transactions</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && payments.length === 0 && <p className="text-sm text-gray-500">No payments recorded yet.</p>}

      {payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="py-2 font-medium">Invoice</th>
                <th className="py-2 font-medium">Client</th>
                <th className="py-2 font-medium">Project</th>
                <th className="py-2 font-medium">Amount</th>
                <th className="py-2 font-medium">Method</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 text-gray-200">{p.invoice?.invoiceNumber ?? "—"}</td>
                  <td className="py-3 text-gray-400">{p.invoice?.client?.companyName ?? "—"}</td>
                  <td className="py-3 text-gray-400">{p.invoice?.project?.projectName ?? "—"}</td>
                  <td className="py-3 text-gray-200">{formatCurrency(p.amount)}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Banknote size={14} />
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="py-3 text-gray-400">{formatDate(p.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
