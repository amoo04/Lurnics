import { useState } from "react";
import { Search } from "lucide-react";
import { invoiceTotal, type Invoice } from "../api/invoices.types";
import { deleteInvoice } from "../hooks/useInvoices";
import { avatarColorFor, formatCurrency, formatDate, getInitial } from "../../../lib/uiHelpers";
import { ApiError } from "../../../lib/api";

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-green-500/20 text-green-300",
  pending: "bg-yellow-500/20 text-yellow-300",
  overdue: "bg-red-500/20 text-red-300",
  draft: "bg-gray-500/20 text-gray-300",
};

interface InvoicesTableProps {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
  onChanged: () => void;
}

export default function InvoicesTable({
  invoices,
  loading,
  error,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  status,
  onStatusChange,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onChanged,
}: InvoicesTableProps) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this invoice? This can't be undone.")) return;
    try {
      await deleteInvoice(id);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete invoice");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-400">
          <Search size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoices..."
            className="w-full bg-transparent outline-none placeholder:text-gray-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="">Status: All</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {loading && <p className="p-4 text-sm text-gray-500">Loading invoices…</p>}
        {error && <p className="p-4 text-sm text-red-400">{error}</p>}
        {!loading && !error && invoices.length === 0 && <p className="p-4 text-sm text-gray-500">No invoices found.</p>}

        {invoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500">
                  <th className="py-2 font-medium">Invoice #</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Project</th>
                  <th className="py-2 font-medium">Due Date</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => onSelect(invoice.id)}
                    className={`cursor-pointer border-b border-white/5 ${
                      selectedId === invoice.id ? "bg-indigo-500/10" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="py-3 text-gray-200">{invoice.invoiceNumber}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${avatarColorFor(invoice.client?.companyName ?? "?")}`}
                        >
                          {getInitial(invoice.client?.companyName ?? "?")}
                        </span>
                        <span className="text-gray-300">{invoice.client?.companyName ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{invoice.project?.projectName ?? "—"}</td>
                    <td className="py-3 text-gray-400">{formatDate(invoice.dueDate)}</td>
                    <td className="py-3 text-gray-200">{formatCurrency(invoiceTotal(invoice))}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="relative py-3 text-gray-500" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => setMenuOpenFor(menuOpenFor === invoice.id ? null : invoice.id)} className="px-2">
                        ···
                      </button>
                      {menuOpenFor === invoice.id && (
                        <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-white/10 bg-[#0f1024] py-1 text-xs shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenFor(null);
                              handleDelete(invoice.id);
                            }}
                            className="block w-full px-3 py-2 text-left text-red-400 hover:bg-white/5"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} invoices
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`h-8 w-8 rounded-md text-sm ${
                    p === page ? "bg-indigo-500 text-white" : "border border-white/10 text-gray-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
