import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, Users, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomerStats,
  fetchCustomers,
  updateCustomer,
} from "../hooks/useCustomers";
import { ApiError } from "../../lib/api";
import type {
  Customer,
  CustomerStats,
  CustomerStatus,
  CreateCustomerInput,
} from "../api/customers.types";

const STATUS_FILTERS: Array<{ id: CustomerStatus | "all"; label: string }> = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "blocked", label: "Blocked" },
];

const STATUS_STYLES: Record<CustomerStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-amber-50 text-amber-600",
  blocked: "bg-red-50 text-red-600",
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function CustomerModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [status, setStatus] = useState<CustomerStatus>(editing?.status ?? "active");
  const [tags, setTags] = useState(editing?.tags ?? "");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateCustomerInput = {
      name,
      email,
      phone: phone || undefined,
      status,
      tags: tags || undefined,
      notes: notes || undefined,
    };

    try {
      if (editing) {
        await updateCustomer(editing.id, input);
      } else {
        await createCustomer(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save customer");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {editing ? "Edit Customer" : "Add Customer"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Phone (Optional)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus)} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tags (Optional, comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="VIP, Repeat" className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Notes (Optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Customers() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; editing: Customer | null }>({
    open: false,
    editing: null,
  });

  async function loadCustomers() {
    setLoading(true);
    try {
      const result = await fetchCustomers({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setCustomers(result.items);
      setPagination({
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
        total: result.pagination.total,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setStats(await fetchCustomerStats());
  }

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadCustomers();
  }

  async function handleDelete(customer: Customer) {
    await deleteCustomer(customer.id);
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    loadStats();
  }

  function closeModal() {
    setModalState({ open: false, editing: null });
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage your customers and their activity</p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, editing: null })}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Customers</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalCustomers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Active Customers</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.activeCustomers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">New (Last 30 Days)</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.newCustomers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Returning Customers</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.returningCustomers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Spent</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.totalSpent ?? 0, currency)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </form>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as CustomerStatus | "all");
              setPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Users size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No customers yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Customers you add or who place orders will show up here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Customer</th>
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 font-medium">Phone</th>
                    <th className="px-4 py-2.5 font-medium">Orders</th>
                    <th className="px-4 py-2.5 font-medium">Total Spent</th>
                    <th className="px-4 py-2.5 font-medium">Last Order</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Tags</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-400">
                              Joined {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.orderCount}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatMoney(customer.totalSpent, currency)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[customer.status]}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {parseTags(customer.tags).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModalState({ open: true, editing: customer })}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="Edit customer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(customer)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete customer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <p>
                Showing {customers.length} of {pagination.total} customers
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {modalState.open && (
        <CustomerModal
          editing={modalState.editing}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            setPage(1);
            loadCustomers();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
