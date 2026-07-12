import { CheckCircle2, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import type { MaintenanceContract } from "../api/maintenance.types";
import { formatCurrency } from "../../../lib/uiHelpers";

export default function MaintenanceStats({ contracts }: { contracts: MaintenanceContract[] }) {
  const active = contracts.filter((c) => c.status === "active").length;
  const expiringSoon = contracts.filter((c) => c.status === "expiring_soon").length;
  const overdue = contracts.filter((c) => c.status === "overdue").length;
  const arr = contracts
    .filter((c) => c.status === "active" || c.status === "expiring_soon")
    .reduce((sum, c) => sum + c.amount, 0);

  const stats = [
    { icon: CheckCircle2, iconBg: "bg-indigo-500/20 text-indigo-300", value: active, label: "Active Contracts" },
    { icon: Calendar, iconBg: "bg-yellow-500/20 text-yellow-300", value: expiringSoon, label: "Expiring Soon" },
    { icon: AlertTriangle, iconBg: "bg-red-500/20 text-red-300", value: overdue, label: "Overdue" },
    { icon: DollarSign, iconBg: "bg-green-500/20 text-green-300", value: formatCurrency(arr), label: "Annual Recurring Revenue" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-lg font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
