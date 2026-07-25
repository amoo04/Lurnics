import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, FolderOpen, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  createCollection,
  deleteCollection,
  fetchCollection,
  fetchCollections,
  fetchCollectionStats,
  updateCollection,
} from "../hooks/useCollections";
import { apiGet, ApiError } from "../../lib/api";
import type {
  Collection,
  CollectionStats,
  CollectionStatus,
  CreateCollectionInput,
} from "../api/collections.types";
import type { Product, ProductListResult } from "../api/products.types";

const STATUS_FILTERS: Array<{ id: CollectionStatus | "all"; label: string }> = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function CollectionModal({
  editingId,
  onClose,
  onSaved,
}: {
  editingId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<CollectionStatus>("active");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const [productsResult, existing] = await Promise.all([
        apiGet<ProductListResult>("/api/platform/products?limit=100"),
        editingId ? fetchCollection(editingId) : Promise.resolve(null),
      ]);

      setProducts(productsResult.items);

      if (existing) {
        setName(existing.name);
        setDescription(existing.description ?? "");
        setImageUrl(existing.imageUrl ?? "");
        setStatus(existing.status);
        setSelectedProductIds(new Set(existing.productIds));
      }

      setLoading(false);
    }
    load();
  }, [editingId]);

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateCollectionInput = {
      name,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      status,
      productIds: Array.from(selectedProductIds),
    };

    try {
      if (editingId) {
        await updateCollection(editingId, input);
      } else {
        await createCollection(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save collection");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {editingId ? "Edit Collection" : "Create Collection"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Collection Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Men's Perfumes"
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
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CollectionStatus)}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Products ({selectedProductIds.size} selected)
              </label>
              {products.length === 0 ? (
                <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-400">
                  No products yet — add products first, then assign them here.
                </p>
              ) : (
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-2">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{product.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Saving…" : editingId ? "Save Changes" : "Create Collection"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [status, setStatus] = useState<CollectionStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; editingId: string | null }>({
    open: false,
    editingId: null,
  });

  async function loadCollections() {
    setLoading(true);
    try {
      const result = await fetchCollections({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setCollections(result.items);
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
    setStats(await fetchCollectionStats());
  }

  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadCollections();
  }

  async function handleToggleStatus(collection: Collection) {
    const nextStatus = collection.status === "active" ? "inactive" : "active";
    await updateCollection(collection.id, { status: nextStatus });
    setCollections((prev) =>
      prev.map((c) => (c.id === collection.id ? { ...c, status: nextStatus } : c)),
    );
    loadStats();
  }

  async function handleDelete(collection: Collection) {
    await deleteCollection(collection.id);
    setCollections((prev) => prev.filter((c) => c.id !== collection.id));
    loadStats();
  }

  function closeModal() {
    setModalState({ open: false, editingId: null });
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500">Organize your products into collections to make them easy to find and shop.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, editingId: null })}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Create Collection
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Collections</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalCollections ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Active Collections</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.activeCollections ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Products in Collections</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.productsInCollections ?? 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </form>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as CollectionStatus | "all");
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
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <FolderOpen size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No collections yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Group your products into collections to make your store easier to shop.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Collection</th>
                    <th className="px-4 py-2.5 font-medium">Description</th>
                    <th className="px-4 py-2.5 font-medium">Products</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Date Created</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {collection.imageUrl ? (
                            <img
                              src={collection.imageUrl}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-300">
                              <FolderOpen size={16} />
                            </div>
                          )}
                          <p className="font-medium text-gray-900">{collection.name}</p>
                        </div>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-gray-500">{collection.description ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{collection.productCount}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(collection)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            collection.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              collection.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {collection.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModalState({ open: true, editingId: collection.id })}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="Edit collection"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(collection)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete collection"
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
                Showing {collections.length} of {pagination.total} collections
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
        <CollectionModal
          editingId={modalState.editingId}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            setPage(1);
            loadCollections();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
