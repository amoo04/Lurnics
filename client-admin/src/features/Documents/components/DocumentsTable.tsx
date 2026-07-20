import { useState } from "react";
import { Search, FileText } from "lucide-react";
import type { Document } from "../api/documents.types";
import { formatDate } from "../../../lib/uiHelpers";

const fileTypeColor: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  DOCX: "bg-blue-50 text-blue-600",
  DOC: "bg-blue-50 text-blue-600",
  XLSX: "bg-green-50 text-green-600",
  XLS: "bg-green-50 text-green-600",
  PNG: "bg-orange-50 text-orange-500",
  JPG: "bg-orange-50 text-orange-500",
  JPEG: "bg-orange-50 text-orange-500",
  ZIP: "bg-gray-100 text-gray-600",
  PPTX: "bg-orange-50 text-orange-500",
};

interface DocumentsTableProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function DocumentsTable({
  documents,
  loading,
  error,
  onDelete,
  search,
  onSearchChange,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: DocumentsTableProps) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500">
          <Search size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading && <p className="p-4 text-sm text-gray-500">Loading documents…</p>}
        {error && <p className="p-4 text-sm text-red-500">{error}</p>}
        {!loading && !error && documents.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No documents found.</p>
        )}

        {documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Client / Project</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Uploaded By</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const typeLabel = doc.fileType.toUpperCase();
                  return (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-gray-900 hover:text-orange-500"
                        >
                          <FileText size={16} className="text-gray-400" />
                          {doc.documentName}
                        </a>
                      </td>
                      <td className="py-3 text-gray-500">
                        <p>{doc.client?.companyName ?? "—"}</p>
                        {doc.project?.projectName && (
                          <p className="text-xs text-gray-500">{doc.project.projectName}</p>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${fileTypeColor[typeLabel] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {typeLabel}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{doc.uploader?.name ?? "—"}</td>
                      <td className="py-3 text-gray-500">{formatDate(doc.uploadedAt)}</td>
                      <td className="relative py-3 text-gray-500">
                        <button
                          type="button"
                          onClick={() => setMenuOpenFor(menuOpenFor === doc.id ? null : doc.id)}
                          className="px-2"
                        >
                          ···
                        </button>
                        {menuOpenFor === doc.id && (
                          <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpenFor(null);
                                onDelete(doc.id);
                              }}
                              className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} documents
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`h-8 w-8 rounded-md text-sm ${
                    p === page ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
