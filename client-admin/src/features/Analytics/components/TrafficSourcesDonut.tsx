import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { label: "Organic Search", value: 42, color: "#818cf8" },
  { label: "Direct", value: 24, color: "#34d399" },
  { label: "Referral", value: 16, color: "#fb923c" },
  { label: "Social", value: 11, color: "#f472b6" },
  { label: "Paid Ads", value: 7, color: "#facc15" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export default function TrafficSourcesDonut() {
  return (
    <div className="w-full lg:w-80 lg:shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Traffic Sources</h3>

      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={65} paddingAngle={2}>
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold">{total}%</p>
          <p className="text-xs text-gray-500">of traffic</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-xs">
        {data.map(({ label, value, color }) => (
          <li key={label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-300">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              {label}
            </span>
            <span className="text-gray-500">{value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
