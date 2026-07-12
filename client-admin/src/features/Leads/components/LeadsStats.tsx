import { Target, Sparkles, Send, TrendingUp } from "lucide-react";
import type { Lead } from "../api/leads.types";

export default function LeadsStats({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length;
  const proposalsSent = leads.filter((l) => l.status === "proposal_sent" || l.status === "won").length;
  const won = leads.filter((l) => l.status === "won").length;
  const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";

  const stats = [
    { icon: Target, iconBg: "bg-indigo-500/20 text-indigo-300", value: total, label: "Total Leads" },
    { icon: Sparkles, iconBg: "bg-blue-500/20 text-blue-300", value: newThisWeek, label: "New This Week" },
    { icon: Send, iconBg: "bg-purple-500/20 text-purple-300", value: proposalsSent, label: "Proposals Sent" },
    { icon: TrendingUp, iconBg: "bg-green-500/20 text-green-300", value: `${conversionRate}%`, label: "Conversion Rate" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
