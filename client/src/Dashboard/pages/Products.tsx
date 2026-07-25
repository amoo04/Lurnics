import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, PackageSearch, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import {
  createProduct,
  deleteProduct,
  fetchProductStats,
  fetchProducts,
  updateProduct,
} from "../hooks/useProducts";
import { ApiError } from "../../lib/api";
import type {
  CreateProductInput,
  Product,
  ProductFilterStatus,
  ProductStats,
} from "../api/products.types";

const LOW_STOCK_THRESHOLD = 10;

const STATUS_FILTERS: Array<{ id: ProductFilterStatus | "all"; label: string }> = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
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

function displayStatus(product: Product): { label: string; style: string } {
  if (product.status === "draft") return { label: "Draft", style: "bg-gray-100 text-gray-500" };
  if (product.stockQuantity <= 0) return { label: "Out of Stock", style: "bg-red-50 text-red-600" };
  if (product.stockQuantity <= LOW_STOCK_THRESHOLD) {
    return { label: "Low Stock", style: "bg-amber-50 text-amber-600" };
  }
  return { label: "Active", style: "bg-emerald-50 text-emerald-600" };
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function ProductModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [collections, setCollections] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateProductInput = {
      name,
      sku: sku || undefined,
      price: Number(price) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      collections: collections || undefined,
      imageUrl: imageUrl || undefined,
      description: description || undefined,
    };

    try {
      const product = await createProduct(input);
      onSaved(product);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Add Product</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Product Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ocean Blue Perfume"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">SKU (Optional)</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="LRN-PRF-001" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Collections (Optional)</label>
              <input
                value={collections}
                onChange={(e) => setCollections(e.target.value)}
                placeholder="Perfumes, Men"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Image URL (Optional)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [status, setStatus] = useState<ProductFilterStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const result = await fetchProducts({
        status: status === "all" ? undefined : status,
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
    setStats(await fetchProductStats());
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadProducts();
  }

  async function handleToggleStatus(product: Product) {
    const nextStatus = product.status === "active" ? "draft" : "active";
    const updated = await updateProduct(product.id, { status: nextStatus });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    loadStats();
  }

  async function handleDelete(product: Product) {
    await deleteProduct(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    loadStats();
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage all your products and inventory</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalProducts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Active Products</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.activeProducts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Out of Stock</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.outOfStock ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Inventory Value</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatMoney(stats?.inventoryValue ?? 0, currency)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </form>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ProductFilterStatus | "all");
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
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <PackageSearch size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No products yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Add your first product to start building your store.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Product</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Inventory</th>
                    <th className="px-4 py-2.5 font-medium">Price</th>
                    <th className="px-4 py-2.5 font-medium">Collections</th>
                    <th className="px-4 py-2.5 font-medium">Date Added</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const badge = displayStatus(product);
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
                                <PackageSearch size={16} />
                              </div>
                            )}
                            <div>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(product)}
                                className="text-left font-medium text-gray-900 hover:text-orange-600"
                                title={product.status === "active" ? "Move to draft" : "Publish"}
                              >
                                {product.name}
                              </button>
                              {product.sku && <p className="text-xs text-gray-400">{product.sku}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.style}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{product.stockQuantity} in stock</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatMoney(product.price, currency)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{product.collections ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete product"
                          >
                            <Trash2 size={15} />
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
                Showing {products.length} of {pagination.total} products
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

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            setPage(1);
            loadProducts();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
