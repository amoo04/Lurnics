import { Users, Star, Briefcase, DollarSign } from "lucide-react";
import { useApiGet } from "../../lib/useApi";
import { formatCurrency } from "../../lib/uiHelpers";

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
    { icon: Users, iconBg: "bg-orange-50 text-orange-500", value: allClients?.pagination.total, label: "Total Clients" },
    { icon: Star, iconBg: "bg-yellow-50 text-yellow-600", value: activeClients?.pagination.total, label: "Active Clients" },
    { icon: Briefcase, iconBg: "bg-green-50 text-green-600", value: projects?.pagination.total, label: "Total Projects" },
    {
      icon: DollarSign,
      iconBg: "bg-blue-50 text-blue-600",
      value: totalRevenue !== null ? formatCurrency(totalRevenue) : undefined,
      label: "Revenue (6mo)",
    },
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
