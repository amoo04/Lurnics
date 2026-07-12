import { useState } from "react";
import { Search } from "lucide-react";
import type { Client } from "../api/clients.types";
import { avatarColorFor, getInitial } from "../../../lib/uiHelpers";

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-500/20 text-green-300",
  inactive: "bg-gray-500/20 text-gray-300",
};

export default function ClientsTable({
  clients,
  loading,
  error,
  selectedId,
  onSelect,
  onDelete,
  search,
  onSearchChange,
  status,
  onStatusChange,
  page,
  totalPages,
  total,
  onPageChange,
}: ClientsTableProps) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-400">
          <Search size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clients..."
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
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {loading && <p className="p-4 text-sm text-gray-500">Loading clients…</p>}
        {error && <p className="p-4 text-sm text-red-400">{error}</p>}
        {!loading && !error && clients.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No clients found.</p>
        )}

        {clients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500">
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Contact</th>
                  <th className="py-2 font-medium">Industry</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => onSelect(client.id)}
                    className={`cursor-pointer border-b border-white/5 ${
                      selectedId === client.id ? "bg-indigo-500/10" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${avatarColorFor(client.companyName)}`}
                        >
                          {getInitial(client.companyName)}
                        </span>
                        <div>
                          <p className="text-gray-200">{client.companyName}</p>
                          <p className="text-xs text-gray-500">{client.contactPerson}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">
                      <p>{client.email ?? "—"}</p>
                      <p className="text-xs text-gray-500">{client.phone ?? "—"}</p>
                    </td>
                    <td className="py-3 text-gray-400">{client.industry ?? "—"}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[client.status]}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="relative py-3 text-gray-500" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setMenuOpenFor(menuOpenFor === client.id ? null : client.id)}
                        className="px-2"
                      >
                        ···
                      </button>
                      {menuOpenFor === client.id && (
                        <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-white/10 bg-[#0f1024] py-1 text-xs shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenFor(null);
                              onDelete(client.id);
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
              Showing {(page - 1) * 8 + 1} to {Math.min(page * 8, total)} of {total} clients
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
