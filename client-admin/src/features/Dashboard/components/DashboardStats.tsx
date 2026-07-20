import { FolderKanban, Users, DollarSign, Target } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";
import { formatCurrency } from "../../../lib/uiHelpers";
import { useDashboardCounts, useRevenue } from "../hooks/useDashboard";

interface LeadsFunnelRow {
  status: string;
  count: number;
}

export default function DashboardStats() {
  const { totalClients, totalProjects, totalLeads } = useDashboardCounts();
  const { data: revenue } = useRevenue();
  const { data: funnel } = useApiGet<LeadsFunnelRow[]>("/api/analytics/leads-funnel");

  const totalRevenue = revenue?.reduce((sum, r) => sum + r.total, 0) ?? null;
  const totalFunnelLeads = funnel?.reduce((sum, r) => sum + r.count, 0) ?? 0;
  const won = funnel?.find((r) => r.status === "won")?.count ?? 0;
  const conversionRate = totalFunnelLeads > 0 ? ((won / totalFunnelLeads) * 100).toFixed(1) : null;

  const stats = [
    { icon: FolderKanban, value: totalProjects, label: "Total Projects", color: "#f97316" },
    { icon: Users, value: totalClients, label: "Total Clients", color: "#34d399" },
    {
      icon: DollarSign,
      value: totalRevenue !== null ? formatCurrency(totalRevenue) : null,
      label: "Revenue (6mo)",
      color: "#facc15",
    },
    { icon: Target, value: totalLeads, label: "Leads", color: "#60a5fa" },
    {
      icon: Target,
      value: conversionRate !== null ? `${conversionRate}%` : null,
      label: "Lead → Won Rate",
      color: "#f97316",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
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
