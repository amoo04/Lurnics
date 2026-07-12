import { useState } from "react";
import { Search } from "lucide-react";
import type { MaintenanceContract } from "../api/maintenance.types";
import { deleteMaintenance } from "../hooks/useMaintenance";
import { avatarColorFor, daysUntil, formatCurrency, formatDate, getInitial } from "../../../lib/uiHelpers";
import { ApiError } from "../../../lib/api";

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-500/20 text-green-300",
  expiring_soon: "bg-orange-500/20 text-orange-300",
  overdue: "bg-red-500/20 text-red-300",
  cancelled: "bg-gray-500/20 text-gray-300",
};

interface Props {
  contracts: MaintenanceContract[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  onChanged: () => void;
}

export default function MaintenanceContractsTable({
  contracts,
  loading,
  error,
  search,
  onSearchChange,
  status,
  onStatusChange,
  page,
  totalPages,
  total,
  onPageChange,
  onChanged,
}: Props) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this maintenance contract?")) return;
    try {
      await deleteMaintenance(id);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete contract");
    }
  }

  return (
    <div>
      <h3 className="mb-4 font-semibold">Maintenance Contracts</h3>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-400">
          <Search size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by plan..."
            className="w-full bg-transparent outline-none placeholder:text-gray-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="">Status: All</option>
          <option value="active">Active</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {loading && <p className="p-4 text-sm text-gray-500">Loading contracts…</p>}
        {error && <p className="p-4 text-sm text-red-400">{error}</p>}
        {!loading && !error && contracts.length === 0 && <p className="p-4 text-sm text-gray-500">No contracts found.</p>}

        {contracts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500">
                  <th className="py-2 font-medium">Client / Project</th>
                  <th className="py-2 font-medium">Plan</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Renewal Date</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Days Left</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => {
                  const days = daysUntil(c.expiryDate);
                  return (
                    <tr key={c.id} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${avatarColorFor(c.client?.companyName ?? "?")}`}
                          >
                            {getInitial(c.client?.companyName ?? "?")}
                          </span>
                          <div>
                            <p className="text-gray-200">{c.client?.companyName ?? "—"}</p>
                            <p className="text-xs text-gray-500">{c.project?.projectName ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs text-indigo-300">{c.planType}</span>
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${STATUS_COLOR[c.status]}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{formatDate(c.expiryDate)}</td>
                      <td className="py-3 text-gray-400">{formatCurrency(c.amount)}/year</td>
                      <td className={`py-3 ${days < 0 ? "text-red-400" : days < 30 ? "text-yellow-400" : "text-green-400"}`}>
                        {days < 0 ? `${days} days` : `${days} days`}
                      </td>
                      <td className="relative py-3 text-gray-500" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setMenuOpenFor(menuOpenFor === c.id ? null : c.id)} className="px-2">
                          ···
                        </button>
                        {menuOpenFor === c.id && (
                          <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-white/10 bg-[#0f1024] py-1 text-xs shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpenFor(null);
                                handleDelete(c.id);
                              }}
                              className="block w-full px-3 py-2 text-left text-red-400 hover:bg-white/5"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {(page - 1) * 8 + 1} to {Math.min(page * 8, total)} of {total} contracts
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
