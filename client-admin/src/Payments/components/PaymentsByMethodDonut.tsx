import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Payment } from "../api/payments.types";
import { formatCurrency } from "../../lib/uiHelpers";

const COLORS = ["#f97316", "#34d399", "#60a5fa", "#facc15", "#f472b6"];

export default function PaymentsByMethodDonut({ payments }: { payments: Payment[] }) {
  const completed = payments.filter((p) => p.status === "completed");
  const byMethod = new Map<string, number>();
  for (const p of completed) byMethod.set(p.paymentMethod, (byMethod.get(p.paymentMethod) ?? 0) + p.amount);

  const data = Array.from(byMethod.entries()).map(([label, value]) => ({ label, value }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Payments by Method</h3>

      {total === 0 ? (
        <p className="text-sm text-gray-500">No completed payments yet.</p>
      ) : (
        <>
          <div className="relative h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" innerRadius={42} outerRadius={62} paddingAngle={2}>
                  {data.map((d, i) => (
                    <Cell key={d.label} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
              <p className="text-xs text-gray-500">Total Received</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs">
            {data.map((d, i) => (
              <li key={d.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.label}
                </span>
                <span className="text-gray-500">
                  {formatCurrency(d.value)} ({Math.round((d.value / total) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
