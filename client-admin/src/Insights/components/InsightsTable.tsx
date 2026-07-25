import { Pencil, Trash2, ImageOff } from "lucide-react";
import type { Article } from "../api/insights.types";

const STATUS_STYLE: Record<string, string> = {
  published: "bg-green-50 text-green-600",
  draft: "bg-gray-100 text-gray-600",
};

interface InsightsTableProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export default function InsightsTable({ articles, loading, error, onEdit, onDelete }: InsightsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Loading…</p>}
      {error && <p className="px-4 py-6 text-center text-sm text-red-500">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-gray-500">No articles yet. Create your first one.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-md border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-300">
                        <ImageOff size={16} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{article.title}</p>
                      <p className="text-xs text-gray-500">/{article.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[article.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(article)}
                      className="text-gray-500 hover:text-gray-900"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(article.id)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
