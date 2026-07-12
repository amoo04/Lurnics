import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { label: "Documents", value: 12.6, color: "#818cf8" },
  { label: "Images", value: 3.2, color: "#34d399" },
  { label: "Archives", value: 1.8, color: "#facc15" },
  { label: "Other", value: 0.8, color: "#fb923c" },
];

const total = 18.4;
const usedPercent = Math.round((total / 50) * 100);

export default function StorageOverviewPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Storage Overview</h3>
        <button type="button" className="text-xs text-indigo-400">View Details</button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={36} outerRadius={52} paddingAngle={2}>
                {data.map((d) => (
                  <Cell key={d.label} fill={d.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm font-bold">{total} GB</p>
            <p className="text-xs text-gray-500">of 50 GB used</p>
          </div>
        </div>

        <ul className="space-y-1.5 text-xs">
          {data.map(({ label, value, color }) => (
            <li key={label} className="flex items-center gap-2 text-gray-300">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              {label}
              <span className="text-gray-500">{value} GB</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-xs text-gray-500">{usedPercent}% of storage used</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-indigo-400" style={{ width: `${usedPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
