import { FileText, CheckCircle2, PenLine } from "lucide-react";
import { useInsights } from "../hooks/useInsights";

export default function InsightsStats() {
  const { data, loading, error } = useInsights();
  const items = data?.items ?? [];
  const published = items.filter((a) => a.status === "published").length;
  const drafts = items.filter((a) => a.status === "draft").length;

  const stats = [
    { icon: FileText, label: "Total Articles", value: items.length },
    { icon: CheckCircle2, label: "Published", value: published },
    { icon: PenLine, label: "Drafts", value: drafts },
  ];

  return (
    <div className="grid gap-4 px-4 pb-6 sm:px-8 sm:grid-cols-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Icon size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{loading || error ? "—" : value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
