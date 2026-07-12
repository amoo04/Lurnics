import { DollarSign, Clock, XCircle, Receipt, TrendingUp } from "lucide-react";
import type { Payment } from "../api/payments.types";
import { formatCurrency } from "../../../lib/uiHelpers";

export default function PaymentsStats({ payments }: { payments: Payment[] }) {
  const completed = payments.filter((p) => p.status === "completed");
  const pending = payments.filter((p) => p.status === "pending");
  const failed = payments.filter((p) => p.status === "failed");
  const totalReceived = completed.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = failed.reduce((sum, p) => sum + p.amount, 0);
  const avgPayment = payments.length > 0 ? payments.reduce((s, p) => s + p.amount, 0) / payments.length : 0;

  const stats = [
    { icon: DollarSign, iconBg: "bg-green-500/20 text-green-300", value: formatCurrency(totalReceived), label: "Total Received" },
    { icon: Clock, iconBg: "bg-orange-500/20 text-orange-300", value: formatCurrency(totalPending), label: "Pending Payments" },
    { icon: XCircle, iconBg: "bg-red-500/20 text-red-300", value: formatCurrency(totalFailed), label: "Failed Payments" },
    { icon: Receipt, iconBg: "bg-blue-500/20 text-blue-300", value: payments.length, label: "Total Transactions" },
    { icon: TrendingUp, iconBg: "bg-purple-500/20 text-purple-300", value: formatCurrency(avgPayment), label: "Average Payment" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
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
