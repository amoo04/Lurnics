import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, FileText, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { createPage, deletePage, fetchPageStats, fetchPages, updatePage } from "../hooks/usePages";
import { ApiError } from "../../lib/api";
import type { CreatePageInput, Page, PageStatus, PageType } from "../api/pages.types";

const STATUS_FILTERS: Array<{ id: PageStatus | "all"; label: string }> = [
  { id: "all", label: "All Pages" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<PageStatus, string> = {
  published: "bg-emerald-50 text-emerald-600",
  draft: "bg-amber-50 text-amber-600",
  archived: "bg-gray-100 text-gray-500",
};

const TYPE_LABELS: Record<PageType, string> = {
  page: "Page",
  homepage: "Homepage",
  shop_page: "Shop Page",
  collection_page: "Collection Page",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function PageModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: Page | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [type, setType] = useState<PageType>(editing?.type ?? "page");
  const [content, setContent] = useState(editing?.content ?? "");
  const [metaTitle, setMetaTitle] = useState(editing?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(editing?.metaDescription ?? "");
  const [status, setStatus] = useState<PageStatus>(editing?.status ?? "draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreatePageInput = { title, type, content, metaTitle, metaDescription, status };

    try {
      if (editing) {
        await updatePage(editing.id, input);
      } else {
        await createPage(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save page");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{editing ? "Edit Page" : "Create Page"}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
            {editing && <p className="mt-1 text-xs text-gray-400">/{editing.slug}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as PageType)} className={inputClass}>
              {Object.entries(TYPE_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Page content (HTML supported)"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          <div className="rounded-md border border-gray-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">SEO</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Meta Title ({metaTitle.length}/60)
                </label>
                <input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Shown as the headline in search results"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Meta Description ({metaDescription.length}/160)
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="Shown as the summary text in search results"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as PageStatus)} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Create Page"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Pages() {
  const { session } = useDashboardAuth();

  const [pages, setPages] = useState<Page[]>([]);
  const [stats, setStats] = useState<{ totalPages: number; publishedPages: number; draftPages: number; archivedPages: number } | null>(null);
  const [status, setStatus] = useState<PageStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; editing: Page | null }>({
    open: false,
    editing: null,
  });

  async function loadPages() {
    setLoading(true);
    try {
      const result = await fetchPages({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setPages(result.items);
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
    setStats(await fetchPageStats());
  }

  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadPages();
  }

  async function handleDelete(p: Page) {
    await deletePage(p.id);
    setPages((prev) => prev.filter((x) => x.id !== p.id));
    loadStats();
  }

  function closeModal() {
    setModalState({ open: false, editing: null });
  }

  const totalReal = stats?.totalPages ?? 0;
  const pct = (n: number) => (totalReal > 0 ? `${((n / totalReal) * 100).toFixed(1)}% of total` : "—");

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-500">Create and manage the pages on your online store.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, editing: null })}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Create Page
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Pages</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalPages ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">All time</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Published Pages</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.publishedPages ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">{pct(stats?.publishedPages ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Draft Pages</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.draftPages ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">{pct(stats?.draftPages ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Archived Pages</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.archivedPages ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">{pct(stats?.archivedPages ?? 0)}</p>
        </div>
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
              placeholder="Search pages…"
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
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <FileText size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No pages yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">Create your first page to start building your store.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Page</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Last Updated</th>
                    <th className="px-4 py-2.5 font-medium">Views</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-400">/{p.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          {TYPE_LABELS[p.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {session?.user.name} · {new Date(p.updatedAt.replace(" ", "T") + "Z").toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.viewCount === 0 ? "—" : p.viewCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModalState({ open: true, editing: p })}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="Edit page"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete page"
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
                Showing {pages.length} of {pagination.total} pages
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
        <PageModal
          editing={modalState.editing}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            setPage(1);
            loadPages();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
