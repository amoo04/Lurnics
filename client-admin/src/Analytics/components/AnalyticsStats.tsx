import { Target, TrendingUp, Percent, Globe2 } from "lucide-react";
import { useLeadsFunnel, useLeadsBySource, useLeadsOverTime } from "../hooks/useAnalytics";

export default function AnalyticsStats() {
  const { data: funnel, loading: funnelLoading } = useLeadsFunnel();
  const { data: overTime, loading: overTimeLoading } = useLeadsOverTime(6);
  const { data: bySource, loading: bySourceLoading } = useLeadsBySource();

  const loading = funnelLoading || overTimeLoading || bySourceLoading;

  const totalLeads = funnel?.reduce((sum, r) => sum + r.count, 0) ?? null;
  const won = funnel?.find((r) => r.status === "won")?.count ?? 0;
  const conversionRate =
    totalLeads !== null && totalLeads > 0 ? `${((won / totalLeads) * 100).toFixed(1)}%` : totalLeads === 0 ? "0%" : null;

  const leadsThisPeriod = overTime?.reduce((sum, p) => sum + p.count, 0) ?? null;

  const topSource =
    bySource && bySource.length > 0
      ? [...bySource].sort((a, b) => b.count - a.count)[0]
      : bySource && bySource.length === 0
        ? null
        : undefined;

  const stats = [
    { icon: Target, value: loading ? null : totalLeads, label: "Total Leads", color: "#f97316" },
    { icon: TrendingUp, value: loading ? null : leadsThisPeriod, label: "Leads (Last 6mo)", color: "#34d399" },
    { icon: Percent, value: loading ? null : conversionRate, label: "Conversion Rate (Won)", color: "#facc15" },
    {
      icon: Globe2,
      value: loading ? null : topSource === null ? "—" : topSource ? topSource.source : null,
      label: "Top Lead Source",
      color: "#fb923c",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, value, label, color }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1a`, color }}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-gray-900">{value ?? "—"}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
