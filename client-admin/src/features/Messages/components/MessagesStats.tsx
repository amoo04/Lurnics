import { MessageSquare, Mail, Ticket, CheckCircle2 } from "lucide-react";

const stats = [
  { icon: MessageSquare, iconBg: "bg-indigo-500/20 text-indigo-300", value: "1,254", label: "Total Messages", change: "+18.4%", up: true },
  { icon: Mail, iconBg: "bg-red-500/20 text-red-300", value: "24", label: "Unread Messages", change: "-12.5%", up: false },
  { icon: Ticket, iconBg: "bg-green-500/20 text-green-300", value: "8", label: "Open Tickets", change: "-11.1%", up: false },
  { icon: CheckCircle2, iconBg: "bg-orange-500/20 text-orange-300", value: "142", label: "Resolved Tickets", change: "+24.3%", up: true },
];

export default function MessagesStats() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label, change, up }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
          <p className={`mt-1 text-xs ${up ? "text-green-400" : "text-red-400"}`}>
            {change} from last month
          </p>
        </div>
      ))}
    </div>
  );
}
