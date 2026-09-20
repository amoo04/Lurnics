import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, Tag, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  createDiscount,
  deleteDiscount,
  fetchDiscountStats,
  fetchDiscounts,
  updateDiscount,
} from "../hooks/useDiscounts";
import { ApiError } from "../../lib/api";
import type {
  CreateDiscountInput,
  Discount,
  DiscountAppliesTo,
  DiscountKind,
  DiscountStatus,
  DiscountValueType,
} from "../api/discounts.types";

const TYPE_TABS: Array<{ id: DiscountKind | "all"; label: string }> = [
  { id: "all", label: "All Discounts" },
  { id: "code", label: "Code Discounts" },
  { id: "automatic", label: "Automatic Discounts" },
];

const STATUS_FILTERS: Array<{ id: DiscountStatus | "all"; label: string }> = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active" },
  { id: "scheduled", label: "Scheduled" },
  { id: "expired", label: "Expired" },
  { id: "disabled", label: "Disabled" },
];

const STATUS_STYLES: Record<DiscountStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  scheduled: "bg-blue-50 text-blue-600",
  expired: "bg-gray-100 text-gray-500",
  disabled: "bg-red-50 text-red-600",
};

function formatValue(discount: Discount) {
  if (discount.discountType === "free_shipping") return "Free Shipping";
  if (discount.discountType === "percentage") return `${discount.value ?? 0}% OFF`;
  return `${discount.value ?? 0} OFF`;
}

const APPLIES_TO_LABELS: Record<DiscountAppliesTo, string> = {
  entire_order: "Entire order",
  shipping: "Shipping",
  specific_collections: "Specific collections",
  specific_products: "Specific products",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function DiscountModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: Discount | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [code, setCode] = useState(editing?.code ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [type, setType] = useState<DiscountKind>(editing?.type ?? "code");
  const [discountType, setDiscountType] = useState<DiscountValueType>(editing?.discountType ?? "percentage");
  const [value, setValue] = useState(editing?.value != null ? String(editing.value) : "");
  const [appliesTo, setAppliesTo] = useState<DiscountAppliesTo>(editing?.appliesTo ?? "entire_order");
  const [usageLimit, setUsageLimit] = useState(editing?.usageLimit != null ? String(editing.usageLimit) : "");
  const [startDate, setStartDate] = useState(editing?.startDate ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(editing?.endDate ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateDiscountInput = {
      code,
      description: description || undefined,
      type,
      discountType,
      value: discountType === "free_shipping" ? undefined : Number(value) || 0,
      appliesTo,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      startDate,
      endDate: endDate || undefined,
    };

    try {
      if (editing) {
        await updateDiscount(editing.id, input);
      } else {
        await createDiscount(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save discount");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {editing ? "Edit Discount" : "Create Discount"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Code</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Description (Optional)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as DiscountKind)} className={inputClass}>
                <option value="code">Code</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountValueType)}
                className={inputClass}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
          </div>

          {discountType !== "free_shipping" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Value {discountType === "percentage" ? "(%)" : ""}
              </label>
              <input
                type="number"
                min={0}
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Applies To</label>
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value as DiscountAppliesTo)}
              className={inputClass}
            >
              {Object.entries(APPLIES_TO_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Usage Limit (Optional)</label>
            <input
              type="number"
              min={1}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Unlimited"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">End Date (Optional)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Create Discount"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [stats, setStats] = useState<{ totalDiscounts: number; activeDiscounts: number; codeDiscounts: number; automaticDiscounts: number; totalUses: number } | null>(null);
  const [tab, setTab] = useState<DiscountKind | "all">("all");
  const [status, setStatus] = useState<DiscountStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; editing: Discount | null }>({
    open: false,
    editing: null,
  });

  async function loadDiscounts() {
    setLoading(true);
    try {
      const result = await fetchDiscounts({
        type: tab === "all" ? undefined : tab,
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setDiscounts(result.items);
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
    setStats(await fetchDiscountStats());
  }

  useEffect(() => {
    loadDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadDiscounts();
  }

  async function handleDelete(discount: Discount) {
    await deleteDiscount(discount.id);
    setDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
    loadStats();
  }

  function closeModal() {
    setModalState({ open: false, editing: null });
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Discounts</h1>
          <p className="text-sm text-gray-500">Create and manage discount codes and automatic discounts.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, editing: null })}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Create Discount
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Discounts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalDiscounts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Active Discounts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.activeDiscounts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Uses</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalUses ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Code / Automatic</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats?.codeDiscounts ?? 0} / {stats?.automaticDiscounts ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-4 py-2">
          {TYPE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t.id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code or name…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </form>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as DiscountStatus | "all");
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
        ) : discounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Tag size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No discounts yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Create a discount code or automatic discount to offer savings to customers.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Discount</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Value</th>
                    <th className="px-4 py-2.5 font-medium">Applies To</th>
                    <th className="px-4 py-2.5 font-medium">Usage</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Dates</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => (
                    <tr key={discount.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{discount.code}</p>
                        {discount.description && <p className="text-xs text-gray-400">{discount.description}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            discount.type === "code" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {discount.type === "code" ? "Code" : "Automatic"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatValue(discount)}</td>
                      <td className="px-4 py-3 text-gray-500">{APPLIES_TO_LABELS[discount.appliesTo]}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {discount.usageCount}
                        {discount.usageLimit ? ` / ${discount.usageLimit}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[discount.status]}`}>
                          {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {discount.startDate}
                        {discount.endDate ? ` – ${discount.endDate}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModalState({ open: true, editing: discount })}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="Edit discount"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(discount)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete discount"
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
                Showing {discounts.length} of {pagination.total} discounts
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
        <DiscountModal
          editing={modalState.editing}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            setPage(1);
            loadDiscounts();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
