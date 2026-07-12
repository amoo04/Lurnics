import { Folder, Cloud, Share2, Upload, Trash2 } from "lucide-react";

const stats = [
  { icon: Folder, iconBg: "bg-indigo-500/20 text-indigo-300", value: "356", label: "Total Documents", change: "+12.5%" },
  { icon: Cloud, iconBg: "bg-blue-500/20 text-blue-300", value: "18.4 GB", label: "Total Size", change: "+8.3%" },
  { icon: Share2, iconBg: "bg-green-500/20 text-green-300", value: "128", label: "Shared Documents", change: "+15.7%" },
  { icon: Upload, iconBg: "bg-orange-500/20 text-orange-300", value: "24", label: "Recently Uploaded", note: "in the last 7 days" },
  { icon: Trash2, iconBg: "bg-red-500/20 text-red-300", value: "14", label: "Trash", note: "items" },
];

export default function DocumentsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-5">
      {stats.map(({ icon: Icon, iconBg, value, label, change, note }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-lg font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
          {change ? (
            <p className="mt-1 text-xs text-green-400">{change} from last month</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">{note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
