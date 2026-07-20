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
    { icon: CheckCircle2, iconBg: "bg-orange-50 text-orange-500", value: active, label: "Active Contracts" },
    { icon: Calendar, iconBg: "bg-yellow-50 text-yellow-600", value: expiringSoon, label: "Expiring Soon" },
    { icon: AlertTriangle, iconBg: "bg-red-50 text-red-500", value: overdue, label: "Overdue" },
    { icon: DollarSign, iconBg: "bg-green-50 text-green-600", value: formatCurrency(arr), label: "Annual Recurring Revenue" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-lg font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
