import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useRevenue } from "../hooks/useDashboard";

export default function RevenueChart() {
  const { data, loading, error } = useRevenue();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Revenue Overview</h3>
        <span className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-400">Last 6 months</span>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && (!data || data.length === 0) && (
        <p className="text-sm text-gray-500">No completed payments yet.</p>
      )}

      {data && data.length > 0 && (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
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
                formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={2} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
