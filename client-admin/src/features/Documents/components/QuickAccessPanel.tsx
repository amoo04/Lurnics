import { Building2, ChevronRight } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";

interface DocumentsReport {
  total: number;
  byType: { fileType: string; count: number }[];
  byClient: { clientId: string; companyName: string; count: number }[];
  recentCount: number;
}

interface QuickAccessPanelProps {
  onSelectClient: (clientId: string) => void;
}

export default function QuickAccessPanel({ onSelectClient }: QuickAccessPanelProps) {
  const { data, loading } = useApiGet<DocumentsReport>("/api/reports/documents");
  const byClient = data?.byClient ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 font-semibold text-gray-900">Top Clients by Documents</h3>
      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {!loading && byClient.length === 0 && (
        <p className="text-sm text-gray-500">No documents linked to clients yet.</p>
      )}
      <div className="space-y-1">
        {byClient.map(({ clientId, companyName, count }) => (
          <button
            key={clientId}
            type="button"
            onClick={() => onSelectClient(clientId)}
            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 size={16} className="text-orange-500 shrink-0" />
              <span className="truncate">{companyName}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              {count}
              <ChevronRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
