import { useEffect, useState, type FormEvent } from "react";
import { Search, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { fetchCartStats, fetchCarts } from "../hooks/useCarts";
import type { Cart, CartStats, CartStatus } from "../api/carts.types";

const STATUS_FILTERS: Array<{ id: CartStatus | "all"; label: string }> = [
  { id: "all", label: "All Carts" },
  { id: "active", label: "Active" },
  { id: "abandoned", label: "Abandoned" },
  { id: "recovered", label: "Recovered" },
];

const STATUS_STYLES: Record<CartStatus, string> = {
  active: "bg-blue-50 text-blue-600",
  abandoned: "bg-amber-50 text-amber-600",
  recovered: "bg-emerald-50 text-emerald-600",
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 3)}****@${domain}`;
}

export default function AbandonedCart() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";

  const [carts, setCarts] = useState<Cart[]>([]);
  const [stats, setStats] = useState<CartStats | null>(null);
  const [status, setStatus] = useState<CartStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  async function loadCarts() {
    setLoading(true);
    try {
      const result = await fetchCarts({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setCarts(result.items);
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
    setStats(await fetchCartStats());
  }

  useEffect(() => {
    loadCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadCarts();
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Abandoned Cart</h1>
        <p className="text-sm text-gray-500">
          Recover lost sales by reaching out to customers about their abandoned carts.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Abandoned Carts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalAbandonedCarts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Recovery Rate</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {((stats?.recoveryRate ?? 0) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Recovered Orders</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.recoveredOrders ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Revenue Recovered</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.revenueRecovered ?? 0, currency)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Avg. Recovered Order</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.conversionValue ?? 0, currency)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
        <p className="font-medium text-gray-700">About recovery tracking</p>
        <p className="mt-1">
          A cart counts as "abandoned" once an hour passes with no matching order, and "recovered" the moment a
          real order comes in from that customer — no automated reminder emails are sent yet (that needs a
          background scheduler, which isn't wired up). Reach out manually from the Customers page for now.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-4 py-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setStatus(f.id);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                status === f.id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <ShoppingCart size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No carts yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Carts started through your store will show up here, along with whether they were recovered.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Customer</th>
                    <th className="px-4 py-2.5 font-medium">Items</th>
                    <th className="px-4 py-2.5 font-medium">Cart Value</th>
                    <th className="px-4 py-2.5 font-medium">Last Activity</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => (
                    <tr key={cart.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{cart.customerName ?? "Guest"}</p>
                        <p className="text-xs text-gray-400">{maskEmail(cart.customerEmail)}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {cart.items.map((item) => item.productName).join(", ")}
                        <span className="text-gray-400"> ({cart.items.reduce((n, i) => n + i.quantity, 0)})</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatMoney(cart.value, currency)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(cart.lastActivityAt.replace(" ", "T") + "Z").toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[cart.status]}`}>
                          {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <p>
                Showing {carts.length} of {pagination.total} carts
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
    </DashboardLayout>
  );
}
