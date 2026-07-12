import type { Payment } from "../api/payments.types";

const STATUS_META: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "bg-green-400" },
  pending: { label: "Pending", color: "bg-yellow-400" },
  failed: { label: "Failed", color: "bg-red-400" },
};

export default function PaymentStatusOverview({ payments }: { payments: Payment[] }) {
  const total = payments.length;
  const counts = ["completed", "pending", "failed"].map((status) => ({
    status,
    value: payments.filter((p) => p.status === status).length,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Payment Status Overview</h3>

      {total === 0 ? (
        <p className="text-sm text-gray-500">No payments recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {counts.map(({ status, value }) => {
            const percent = total > 0 ? (value / total) * 100 : 0;
            const meta = STATUS_META[status];
            return (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">{meta.label}</span>
                  <span className="text-gray-500">
                    {value} ({percent.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${meta.color}`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
