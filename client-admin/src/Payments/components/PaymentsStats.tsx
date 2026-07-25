import { DollarSign, Clock, XCircle, Receipt, TrendingUp } from "lucide-react";
import type { Payment } from "../api/payments.types";
import { formatCurrency } from "../../lib/uiHelpers";

export default function PaymentsStats({ payments }: { payments: Payment[] }) {
  const completed = payments.filter((p) => p.status === "completed");
  const pending = payments.filter((p) => p.status === "pending");
  const failed = payments.filter((p) => p.status === "failed");
  const totalReceived = completed.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = failed.reduce((sum, p) => sum + p.amount, 0);
  const avgPayment = payments.length > 0 ? payments.reduce((s, p) => s + p.amount, 0) / payments.length : 0;

  const stats = [
    { icon: DollarSign, iconBg: "bg-green-50 text-green-600", value: formatCurrency(totalReceived), label: "Total Received" },
    { icon: Clock, iconBg: "bg-orange-50 text-orange-500", value: formatCurrency(totalPending), label: "Pending Payments" },
    { icon: XCircle, iconBg: "bg-red-50 text-red-600", value: formatCurrency(totalFailed), label: "Failed Payments" },
    { icon: Receipt, iconBg: "bg-blue-50 text-blue-600", value: payments.length, label: "Total Transactions" },
    { icon: TrendingUp, iconBg: "bg-orange-50 text-orange-500", value: formatCurrency(avgPayment), label: "Average Payment" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
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
