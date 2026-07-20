import { useState } from "react";
import { SquarePen, Search, SlidersHorizontal } from "lucide-react";
import { avatarColorFor, getInitial } from "../../../lib/uiHelpers";
import type { ClientConversation } from "../api/messages.types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const tabs = ["All", "Unread"] as const;

export default function ConversationsList({
  conversations,
  loading,
  error,
  selectedId,
  onSelect,
}: {
  conversations: ClientConversation[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (clientId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");

  const unreadCount = conversations.filter((c) => c.unread > 0).length;
  const visible = conversations.filter((c) => {
    if (activeTab === "Unread" && c.unread === 0) return false;
    if (!query) return true;
    return c.client.companyName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex w-full flex-col lg:w-80 lg:shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5">
        <p className="font-semibold text-gray-900">Conversations</p>
        <button type="button" className="text-gray-400 hover:text-gray-900">
          <SquarePen size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200 px-3 pt-2 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ${
              activeTab === tab ? "bg-orange-50 text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
            {tab === "All" && <span className="text-xs text-gray-500">{conversations.length}</span>}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="rounded-full bg-gray-900 px-1.5 text-[10px] text-white">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500">
          <Search size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        <button type="button" className="text-gray-400 hover:text-gray-900">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Loading conversations…</p>}
        {error && <p className="px-4 py-6 text-center text-sm text-red-500">{error}</p>}
        {!loading && !error && visible.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-500">No conversations yet.</p>
        )}
        {!loading &&
          !error &&
          visible.map((c) => (
            <button
              key={c.clientId}
              type="button"
              onClick={() => onSelect(c.clientId)}
              className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left ${
                c.clientId === selectedId ? "bg-orange-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative shrink-0">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${avatarColorFor(
                    c.client.companyName,
                  )}`}
                >
                  {getInitial(c.client.companyName)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-gray-900">{c.client.companyName}</p>
                  <span className="shrink-0 text-xs text-gray-500">{timeAgo(c.lastMessage.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs text-gray-500">{c.lastMessage.message}</p>
                  {c.unread > 0 && (
                    <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
