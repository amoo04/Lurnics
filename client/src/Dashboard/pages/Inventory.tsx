import { useEffect, useState, type FormEvent } from "react";
import { Search, ChevronLeft, ChevronRight, Boxes, Download, Pencil, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { fetchInventoryStats, fetchProducts, updateProduct } from "../hooks/useProducts";
import type { InventoryStats, Product, ProductFilterStatus } from "../api/products.types";

const LOW_STOCK_THRESHOLD = 10;

const TABS: Array<{ id: "all" | "low_stock" | "out_of_stock"; label: string }> = [
  { id: "all", label: "All Items" },
  { id: "low_stock", label: "Low Stock" },
  { id: "out_of_stock", label: "Out of Stock" },
];

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function stockStatus(product: Product): { label: string; style: string } {
  if (product.stockQuantity <= 0) return { label: "Out of Stock", style: "bg-red-50 text-red-600" };
  if (product.stockQuantity <= LOW_STOCK_THRESHOLD) {
    return { label: "Low Stock", style: "bg-amber-50 text-amber-600" };
  }
  return { label: "In Stock", style: "bg-emerald-50 text-emerald-600" };
}

function downloadCsv(products: Product[]) {
  const header = ["Product", "SKU", "Stock On Hand", "Status", "Price", "Value"];
  const rows = products.map((p) => {
    const status = stockStatus(p).label;
    return [
      p.name,
      p.sku ?? "",
      String(p.stockQuantity),
      status,
      p.price.toString(),
      (p.price * p.stockQuantity).toString(),
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function AdjustStockModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const [quantity, setQuantity] = useState(String(product.stockQuantity));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updateProduct(product.id, { stockQuantity: Math.max(0, Number(quantity) || 0) });
      onSaved(updated);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Adjust Stock</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          {product.name}
          {product.sku && <span className="text-gray-400"> · {product.sku}</span>}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Stock On Hand</label>
            <input
              type="number"
              min={0}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [tab, setTab] = useState<"all" | "low_stock" | "out_of_stock">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const result = await fetchProducts({
        status: tab === "all" ? undefined : (tab as ProductFilterStatus),
        search: search || undefined,
        page,
      });
      setProducts(result.items);
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
    setStats(await fetchInventoryStats());
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadProducts();
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Track and manage your stock levels</p>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(products)}
          disabled={products.length === 0}
          className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Inventory Value</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatMoney(stats?.inventoryValue ?? 0, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalProducts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Low Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{stats?.lowStock ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Out of Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{stats?.outOfStock ?? 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-4 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t.id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
              <span className="text-xs text-gray-400">
                {t.id === "all" ? stats?.totalProducts ?? 0 : t.id === "low_stock" ? stats?.lowStock ?? 0 : stats?.outOfStock ?? 0}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU…"
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
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Boxes size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No inventory items</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Add products to start tracking stock levels here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Product</th>
                    <th className="px-4 py-2.5 font-medium">SKU</th>
                    <th className="px-4 py-2.5 font-medium">Stock On Hand</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Value</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const badge = stockStatus(product);
                    return (
                      <tr key={product.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt=""
                                className="h-9 w-9 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-300">
                                <Boxes size={16} />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              {product.collections && <p className="text-xs text-gray-400">{product.collections}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{product.sku ?? "—"}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{product.stockQuantity}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.style}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatMoney(product.price * product.stockQuantity, currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setAdjusting(product)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="Adjust stock"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <p>
                Showing {products.length} of {pagination.total} items
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

      {adjusting && (
        <AdjustStockModal
          product={adjusting}
          onClose={() => setAdjusting(null)}
          onSaved={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setAdjusting(null);
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
