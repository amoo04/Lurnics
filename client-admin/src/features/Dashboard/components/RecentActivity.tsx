import { PlusCircle, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { useRecentActivity } from "../hooks/useDashboard";

const ACTION_ICON: Record<string, { icon: LucideIcon; iconBg: string }> = {
  create: { icon: PlusCircle, iconBg: "bg-orange-50 text-orange-500" },
  update: { icon: Pencil, iconBg: "bg-blue-50 text-blue-500" },
  delete: { icon: Trash2, iconBg: "bg-red-50 text-red-500" },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentActivity() {
  const { data, loading, error } = useRecentActivity();
  const items = data?.items ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-sm text-gray-500">No activity yet.</p>}

      <ul className="space-y-4">
        {items.map((entry) => {
          const { icon: Icon, iconBg } = ACTION_ICON[entry.action] ?? ACTION_ICON.update;
          return (
            <li key={entry.id} className="flex items-start gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={14} />
              </span>
              <div>
                <p className="text-sm text-gray-900">
                  {entry.user?.name ?? "Someone"} {entry.action}d a {entry.entityType.replace("-", " ")}
                </p>
                <p className="text-xs text-gray-500">{timeAgo(entry.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
