import { Pencil, Trash2, ImageOff, ExternalLink } from "lucide-react";
import type { CaseStudy } from "../api/success-stories.types";

interface SuccessStoriesTableProps {
  caseStudies: CaseStudy[];
  loading: boolean;
  error: string | null;
  onEdit: (caseStudy: CaseStudy) => void;
  onDelete: (id: string) => void;
}

export default function SuccessStoriesTable({
  caseStudies,
  loading,
  error,
  onEdit,
  onDelete,
}: SuccessStoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Loading…</p>}
      {error && <p className="px-4 py-6 text-center text-sm text-red-500">{error}</p>}
      {!loading && !error && caseStudies.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          No success stories yet. Create your first one.
        </p>
      )}

      {!loading && !error && caseStudies.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Live Site</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map((caseStudy) => (
              <tr key={caseStudy.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {caseStudy.featuredImage ? (
                      <img
                        src={caseStudy.featuredImage}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-md border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-300">
                        <ImageOff size={16} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{caseStudy.title}</p>
                      <p className="text-xs text-gray-500">/{caseStudy.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{caseStudy.industry?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      caseStudy.publishedAt ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {caseStudy.publishedAt ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {caseStudy.liveUrl ? (
                    <a
                      href={caseStudy.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-500 hover:text-orange-600"
                    >
                      Visit
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(caseStudy)}
                      className="text-gray-500 hover:text-gray-900"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(caseStudy.id)}
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
