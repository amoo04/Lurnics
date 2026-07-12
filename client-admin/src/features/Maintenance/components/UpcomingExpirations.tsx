import type { MaintenanceContract } from "../api/maintenance.types";
import { avatarColorFor, daysUntil, formatDate, getInitial } from "../../../lib/uiHelpers";

export default function UpcomingExpirations({ contracts }: { contracts: MaintenanceContract[] }) {
  const upcoming = [...contracts]
    .filter((c) => c.status !== "cancelled")
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Upcoming Expirations</h3>
      </div>

      {upcoming.length === 0 && <p className="text-sm text-gray-500">No contracts yet.</p>}

      <div className="space-y-3">
        {upcoming.map((c) => {
          const days = daysUntil(c.expiryDate);
          return (
            <div key={c.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${avatarColorFor(c.client?.companyName ?? "?")}`}
                >
                  {getInitial(c.client?.companyName ?? "?")}
                </span>
                <div>
                  <p className="text-sm text-gray-200">{c.client?.companyName ?? "—"}</p>
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">{c.planType}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{formatDate(c.expiryDate)}</p>
                <p className="text-xs text-gray-500">{days} days</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
