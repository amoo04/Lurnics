import { useState } from "react";
import { SquarePen, Search, SlidersHorizontal } from "lucide-react";

export interface Conversation {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  online: boolean;
  lastMessage: string;
  time: string;
  unread: number;
}

export const conversations: Conversation[] = [
  { id: "vektar", name: "Vektar Luxury", initial: "VL", avatarBg: "bg-purple-500", online: true, lastMessage: "Please update the product catalog...", time: "2m ago", unread: 3 },
  { id: "sheashine", name: "SheaShine Co.", initial: "S", avatarBg: "bg-green-500", online: false, lastMessage: "Payment has been made for the...", time: "1h ago", unread: 1 },
  { id: "therapy", name: "Therapy Platform", initial: "T", avatarBg: "bg-blue-500", online: false, lastMessage: "Can we schedule a meeting for...", time: "Yesterday", unread: 0 },
  { id: "buildcore", name: "BuildCore Ltd.", initial: "B", avatarBg: "bg-orange-500", online: false, lastMessage: "We need to make some changes...", time: "Yesterday", unread: 0 },
  { id: "greenleaf", name: "GreenLeaf Ltd.", initial: "G", avatarBg: "bg-emerald-500", online: false, lastMessage: "Issue with login on staging site", time: "2d ago", unread: 2 },
  { id: "finex", name: "Finex Global", initial: "F", avatarBg: "bg-indigo-500", online: false, lastMessage: "Deployment completed successfully", time: "2d ago", unread: 0 },
  { id: "logix", name: "Logix Inc.", initial: "L", avatarBg: "bg-red-500", online: false, lastMessage: "Thanks for the quick response", time: "3d ago", unread: 0 },
  { id: "tosin", name: "Tosin D.", initial: "T", avatarBg: "bg-gray-500", online: false, lastMessage: "Please send the Figma file", time: "3d ago", unread: 0 },
];

const tabs = ["All", "Unread", "Mentions", "Archived"] as const;

export default function ConversationsList({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");

  const unreadCount = conversations.filter((c) => c.unread > 0).length;
  const visible = conversations.filter((c) => {
    if (activeTab === "Unread" && c.unread === 0) return false;
    if (!query) return true;
    return c.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex w-full flex-col lg:w-80 lg:shrink-0 rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
        <p className="font-semibold">Conversations</p>
        <button type="button" className="text-gray-400 hover:text-white">
          <SquarePen size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-white/10 px-3 pt-2 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ${
              activeTab === tab ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
            {tab === "All" && <span className="text-xs text-gray-500">{conversations.length}</span>}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="rounded-full bg-indigo-500 px-1.5 text-[10px] text-white">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-gray-400">
          <Search size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-gray-500"
          />
        </div>
        <button type="button" className="text-gray-400 hover:text-white">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {visible.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left ${
              c.id === selectedId ? "bg-indigo-500/10" : "hover:bg-white/5"
            }`}
          >
            <div className="relative shrink-0">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${c.avatarBg}`}>
                {c.initial}
              </span>
              {c.online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0d1f] bg-green-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-gray-100">{c.name}</p>
                <span className="shrink-0 text-xs text-gray-500">{c.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-xs text-gray-500">{c.lastMessage}</p>
                {c.unread > 0 && (
                  <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-medium text-white">
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
