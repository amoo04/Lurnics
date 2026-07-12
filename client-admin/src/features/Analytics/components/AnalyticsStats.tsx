import { Users, MousePointerClick, Percent, DollarSign, Repeat } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const sparkline = [4, 6, 5, 8, 7, 10, 9, 12];

const stats = [
  { icon: Users, value: "12,480", label: "Total Visitors", change: "+22.4%", up: true, color: "#818cf8" },
  { icon: MousePointerClick, value: "142", label: "New Leads", change: "+18.3%", up: true, color: "#34d399" },
  { icon: Percent, value: "4.8%", label: "Conversion Rate", change: "+1.2%", up: true, color: "#facc15" },
  { icon: DollarSign, value: "₦2.4M", label: "Avg. Deal Size", change: "+9.1%", up: true, color: "#fb923c" },
  { icon: Repeat, value: "92%", label: "Client Retention", change: "-1.5%", up: false, color: "#a78bfa" },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
      {stats.map(({ icon: Icon, value, label, change, up, color }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <Icon size={18} />
            </div>
            <span className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}>{change}</span>
          </div>
          <p className="mt-3 text-xl font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
          <div className="mt-2 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline.map((v) => ({ v }))}>
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
