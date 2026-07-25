import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications, markNotificationRead, markAllNotificationsRead } from "../hooks/useNotifications";

function timeAgo(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsBell() {
  const { data, loading, refetch } = useNotifications();
  const [open, setOpen] = useState(false);

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    refetch();
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    refetch();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative text-gray-500 hover:text-gray-900"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-medium text-gray-900">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Loading…</p>}
              {!loading && notifications.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet.</p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.readStatus && handleMarkRead(n.id)}
                  className={`block w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50 ${
                    n.readStatus ? "" : "bg-orange-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    {!n.readStatus && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">{n.message}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{timeAgo(n.createdAt)}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
