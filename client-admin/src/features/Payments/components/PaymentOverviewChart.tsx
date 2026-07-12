import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Payment } from "../api/payments.types";

export default function PaymentOverviewChart({ payments }: { payments: Payment[] }) {
  const byDate = new Map<string, { date: string; received: number; pending: number; failed: number }>();

  for (const p of payments) {
    const date = p.paymentDate.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { date, received: 0, pending: 0, failed: 0 });
    const entry = byDate.get(date)!;
    if (p.status === "completed") entry.received += p.amount;
    else if (p.status === "pending") entry.pending += p.amount;
    else entry.failed += p.amount;
  }

  const data = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Payment Overview</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No payments recorded yet.</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{ background: "#0f1024", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(value) => `₦${Number(value).toLocaleString()}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="received" name="Received" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pending" name="Pending" stroke="#facc15" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failed" name="Failed" stroke="#f87171" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
