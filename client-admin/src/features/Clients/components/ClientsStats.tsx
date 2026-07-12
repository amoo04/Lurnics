import { Users, Star, Briefcase, DollarSign } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";
import { formatCurrency } from "../../../lib/uiHelpers";

interface CountResponse {
  pagination: { total: number };
}

export default function ClientsStats() {
  const { data: allClients } = useApiGet<CountResponse>("/api/clients?limit=1");
  const { data: activeClients } = useApiGet<CountResponse>("/api/clients?limit=1&status=active");
  const { data: projects } = useApiGet<CountResponse>("/api/projects?limit=1");
  const { data: revenue } = useApiGet<{ total: number }[]>("/api/reports/revenue?months=6");

  const totalRevenue = revenue?.reduce((sum, r) => sum + r.total, 0) ?? null;

  const stats = [
    { icon: Users, iconBg: "bg-indigo-500/20 text-indigo-300", value: allClients?.pagination.total, label: "Total Clients" },
    { icon: Star, iconBg: "bg-yellow-500/20 text-yellow-300", value: activeClients?.pagination.total, label: "Active Clients" },
    { icon: Briefcase, iconBg: "bg-green-500/20 text-green-300", value: projects?.pagination.total, label: "Total Projects" },
    {
      icon: DollarSign,
      iconBg: "bg-blue-500/20 text-blue-300",
      value: totalRevenue !== null ? formatCurrency(totalRevenue) : undefined,
      label: "Revenue (6mo)",
    },
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
