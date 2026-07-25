import { Folder, FileType, Upload, Users } from "lucide-react";
import { useApiGet } from "../../lib/useApi";

interface DocumentsReport {
  total: number;
  byType: { fileType: string; count: number }[];
  byClient: { clientId: string; companyName: string; count: number }[];
  recentCount: number;
}

interface CountResponse {
  pagination: { total: number };
}

export default function DocumentsStats() {
  const { data } = useApiGet<DocumentsReport>("/api/reports/documents");
  const { data: clients } = useApiGet<CountResponse>("/api/clients?limit=1");

  const typeCount = data?.byType.length;

  const stats = [
    { icon: Folder, iconBg: "bg-orange-50 text-orange-500", value: data?.total, label: "Total Documents" },
    { icon: FileType, iconBg: "bg-blue-50 text-blue-500", value: typeCount, label: "File Types" },
    { icon: Upload, iconBg: "bg-orange-50 text-orange-500", value: data?.recentCount, label: "Uploaded This Week" },
    { icon: Users, iconBg: "bg-green-50 text-green-600", value: clients?.pagination.total, label: "Total Clients" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-lg font-bold text-gray-900">{value ?? "—"}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
