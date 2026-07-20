import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLeadsOverTime } from "../hooks/useAnalytics";

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function TrafficChart() {
  const { data, loading, error } = useLeadsOverTime(6);
  const chartData = data?.map((p) => ({ ...p, label: formatMonth(p.month) }));

  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Leads Over Time</h3>
        <span className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500">Last 6 Months</span>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (!chartData || chartData.length === 0) && (
        <p className="text-sm text-gray-500">No leads recorded in this period.</p>
      )}

      {chartData && chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }}
                labelStyle={{ color: "#111827" }}
                formatter={(value) => [value, "Leads"]}
              />
              <Area type="monotone" dataKey="count" name="Leads" stroke="#f97316" strokeWidth={2} fill="url(#leadsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
