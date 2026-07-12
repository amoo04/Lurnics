import { DollarSign, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { useApiGet } from "../../../lib/useApi";

interface ActivityLogEntry {
  id: string;
  action: string;
  entityId: string;
  createdAt: string;
  user: { name: string } | null;
}

const ACTION_ICON: Record<string, { icon: LucideIcon; iconBg: string }> = {
  create: { icon: DollarSign, iconBg: "bg-green-500/20 text-green-300" },
  update: { icon: Pencil, iconBg: "bg-orange-500/20 text-orange-300" },
  delete: { icon: Trash2, iconBg: "bg-red-500/20 text-red-300" },
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PaymentsActivity() {
  const { data, loading, error } = useApiGet<{ items: ActivityLogEntry[] }>(
    "/api/activity-logs?entityType=payment&limit=6",
  );
  const items = data?.items ?? [];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-sm text-gray-500">No payment activity yet.</p>}

      <ul className="space-y-4">
        {items.map((entry) => {
          const { icon: Icon, iconBg } = ACTION_ICON[entry.action] ?? ACTION_ICON.update;
          return (
            <li key={entry.id} className="flex items-start gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={14} />
              </span>
              <div>
                <p className="text-sm text-gray-200">
                  {entry.user?.name ?? "Someone"} {entry.action}d a payment
                </p>
                <p className="text-xs text-gray-500">{formatWhen(entry.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
