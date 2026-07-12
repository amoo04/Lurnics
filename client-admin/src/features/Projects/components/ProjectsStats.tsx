import { FolderKanban, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";

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
    { icon: FolderKanban, iconBg: "bg-indigo-500/20 text-indigo-300", value: total, label: "Total Projects" },
    { icon: Loader2, iconBg: "bg-blue-500/20 text-blue-300", value: inProgress, label: "In Progress" },
    { icon: CheckCircle2, iconBg: "bg-green-500/20 text-green-300", value: completed, label: "Completed" },
    { icon: Clock, iconBg: "bg-orange-500/20 text-orange-300", value: discovery, label: "In Discovery" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold">{value ?? "—"}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
