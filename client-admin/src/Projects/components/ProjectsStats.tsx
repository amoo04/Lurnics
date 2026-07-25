import { FolderKanban, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useApiGet } from "../../lib/useApi";

interface ProjectStatusCount {
  status: string;
  count: number;
}

export default function ProjectsStats() {
  const { data: byStatus } = useApiGet<ProjectStatusCount[]>("/api/reports/projects");
  const total = byStatus?.reduce((sum, s) => sum + s.count, 0) ?? undefined;
  const inProgress = byStatus?.filter((s) => s.status !== "completed").reduce((sum, s) => sum + s.count, 0);
  const completed = byStatus?.find((s) => s.status === "completed")?.count;
  const discovery = byStatus?.find((s) => s.status === "discovery")?.count;

  const stats = [
    { icon: FolderKanban, iconBg: "bg-orange-50 text-orange-500", value: total, label: "Total Projects" },
    { icon: Loader2, iconBg: "bg-blue-50 text-blue-500", value: inProgress, label: "In Progress" },
    { icon: CheckCircle2, iconBg: "bg-green-50 text-green-600", value: completed, label: "Completed" },
    { icon: Clock, iconBg: "bg-orange-50 text-orange-500", value: discovery, label: "In Discovery" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-gray-900">{value ?? "—"}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
