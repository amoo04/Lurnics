import { Users, Clock, Star, Trash2, ChevronRight } from "lucide-react";

const items = [
  { icon: Users, label: "Shared with me", count: 74 },
  { icon: Clock, label: "Recent", count: 24 },
  { icon: Star, label: "Starred", count: 16 },
  { icon: Trash2, label: "Trash", count: 14 },
];

export default function QuickAccessPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-3 font-semibold">Quick Access</h3>
      <div className="space-y-1">
        {items.map(({ icon: Icon, label, count }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <Icon size={16} className="text-indigo-300" />
              {label}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              {count}
              <ChevronRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
