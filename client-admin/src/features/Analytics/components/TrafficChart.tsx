import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", visitors: 4200, leads: 38 },
  { month: "Feb", visitors: 5100, leads: 45 },
  { month: "Mar", visitors: 6800, leads: 58 },
  { month: "Apr", visitors: 7400, leads: 62 },
  { month: "May", visitors: 9600, leads: 84 },
  { month: "Jun", visitors: 12480, leads: 142 },
];

export default function TrafficChart() {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Visitors &amp; Leads</h3>
        <span className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-400">Last 6 Months</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0f1024", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              labelStyle={{ color: "#e5e7eb" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#visitorsFill)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#leadsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
