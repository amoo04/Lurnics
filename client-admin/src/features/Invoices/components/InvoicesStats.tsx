import { Receipt, DollarSign, Clock, AlertTriangle, FileText } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";
import { formatCurrency } from "../../../lib/uiHelpers";

interface InvoiceStatusRow {
  status: string;
  count: number;
  total: number;
}

export default function InvoicesStats() {
  const { data } = useApiGet<InvoiceStatusRow[]>("/api/reports/invoices");

  const totalCount = data?.reduce((sum, r) => sum + r.count, 0) ?? undefined;
  const paidTotal = data?.find((r) => r.status === "paid")?.total ?? 0;
  const pendingTotal = data?.find((r) => r.status === "pending")?.total ?? 0;
  const overdueTotal = data?.find((r) => r.status === "overdue")?.total ?? 0;
  const draftCount = data?.find((r) => r.status === "draft")?.count;

  const stats = [
    { icon: Receipt, iconBg: "bg-indigo-500/20 text-indigo-300", value: totalCount, label: "Total Invoices" },
    { icon: DollarSign, iconBg: "bg-green-500/20 text-green-300", value: data ? formatCurrency(paidTotal) : undefined, label: "Paid" },
    { icon: Clock, iconBg: "bg-blue-500/20 text-blue-300", value: data ? formatCurrency(pendingTotal) : undefined, label: "Pending" },
    { icon: AlertTriangle, iconBg: "bg-red-500/20 text-red-300", value: data ? formatCurrency(overdueTotal) : undefined, label: "Overdue" },
    { icon: FileText, iconBg: "bg-gray-500/20 text-gray-300", value: draftCount, label: "Draft Invoices" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-lg font-bold">{value ?? "—"}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
