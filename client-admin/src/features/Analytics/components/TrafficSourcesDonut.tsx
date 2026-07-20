import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLeadsBySource } from "../hooks/useAnalytics";

const COLORS = ["#f97316", "#34d399", "#60a5fa", "#f472b6", "#facc15", "#9ca3af", "#fb923c"];

export default function TrafficSourcesDonut() {
  const { data, loading, error } = useLeadsBySource();

  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const chartData = data?.map((d, i) => ({
    label: d.source,
    value: d.count,
    pct: total > 0 ? Math.round((d.count / total) * 100) : 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full lg:w-80 lg:shrink-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Leads by Source</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (!chartData || chartData.length === 0) && (
        <p className="text-sm text-gray-500">No lead source data yet.</p>
      )}

      {chartData && chartData.length > 0 && (
        <>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={45} outerRadius={65} paddingAngle={2}>
                  {chartData.map((d) => (
                    <Cell key={d.label} fill={d.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-gray-900">{total.toLocaleString()}</p>
              <p className="text-xs text-gray-500">total leads</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs">
            {chartData.map(({ label, pct, color }) => (
              <li key={label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
                <span className="text-gray-500">{pct}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
