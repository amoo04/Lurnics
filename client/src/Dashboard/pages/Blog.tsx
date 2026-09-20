import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, Newspaper, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { createBlogPost, deleteBlogPost, fetchBlogPosts, fetchBlogStats, updateBlogPost } from "../hooks/useBlog";
import { ApiError } from "../../lib/api";
import type { BlogPost, BlogPostStatus, CreateBlogPostInput } from "../api/blog.types";

const STATUS_FILTERS: Array<{ id: BlogPostStatus | "all"; label: string }> = [
  { id: "all", label: "All Posts" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
];

const STATUS_STYLES: Record<BlogPostStatus, string> = {
  published: "bg-emerald-50 text-emerald-600",
  draft: "bg-amber-50 text-amber-600",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function PostModal({ editing, onClose, onSaved }: { editing: BlogPost | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(editing?.coverImageUrl ?? "");
  const [status, setStatus] = useState<BlogPostStatus>(editing?.status ?? "draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateBlogPostInput = {
      title,
      excerpt: excerpt || undefined,
      content,
      coverImageUrl: coverImageUrl || undefined,
      status,
    };

    try {
      if (editing) {
        await updateBlogPost(editing.id, input);
      } else {
        await createBlogPost(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{editing ? "Edit Post" : "Create Post"}</h2>
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
            <label className="mb-1 block text-xs font-medium text-gray-600">Excerpt (Optional)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Cover Image URL (Optional)</label>
            <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Post content (HTML supported)"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as BlogPostStatus)} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<{ totalPosts: number; publishedPosts: number; draftPosts: number; totalViews: number } | null>(null);
  const [status, setStatus] = useState<BlogPostStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; editing: BlogPost | null }>({ open: false, editing: null });

  async function loadPosts() {
    setLoading(true);
    try {
      const result = await fetchBlogPosts({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setPosts(result.items);
      setPagination({ page: result.pagination.page, totalPages: result.pagination.totalPages, total: result.pagination.total });
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setStats(await fetchBlogStats());
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadPosts();
  }

  async function handleDelete(post: BlogPost) {
    await deleteBlogPost(post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    loadStats();
  }

  function closeModal() {
    setModalState({ open: false, editing: null });
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500">Write and publish posts on your store.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, editing: null })}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Create Post
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Posts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalPosts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Published</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.publishedPosts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Drafts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.draftPosts ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Views</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalViews ?? 0}</p>
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
              placeholder="Search posts…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>
          <button type="submit" className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Search
          </button>
        </form>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Newspaper size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No posts yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">Create your first post to start your blog.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Post</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Published</th>
                    <th className="px-4 py-2.5 font-medium">Views</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-xs text-gray-400">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[post.status]}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{post.viewCount === 0 ? "—" : post.viewCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModalState({ open: true, editing: post })}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
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
                Showing {posts.length} of {pagination.total} posts
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
        <PostModal
          editing={modalState.editing}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            setPage(1);
            loadPosts();
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
