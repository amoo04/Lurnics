import { FileText } from "lucide-react";
import { useApiGet } from "../../lib/useApi";
import type { Document, Paginated } from "../api/documents.types";
import { formatDate } from "../../lib/uiHelpers";

export default function RecentUploadsPanel() {
  const { data, loading, error } = useApiGet<Paginated<Document>>("/api/documents?limit=5");
  const uploads = data?.items ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Uploads</h3>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && uploads.length === 0 && (
        <p className="text-sm text-gray-500">No documents uploaded yet.</p>
      )}

      <ul className="space-y-3">
        {uploads.map((doc) => (
          <li key={doc.id} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-500">
              <FileText size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-900">{doc.documentName}</p>
              <p className="text-xs text-gray-500">{doc.client?.companyName ?? "No client"}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{formatDate(doc.uploadedAt)}</p>
              <p>{doc.fileType.toUpperCase()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
