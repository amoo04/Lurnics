import { useState } from "react";
import { Phone, Video, Info, MoreVertical, Paperclip, Smile, Send, Check, CheckCheck } from "lucide-react";
import type { Conversation } from "./ConversationsList";

interface Message {
  id: string;
  from: "them" | "me";
  text: string;
  time: string;
  date: string;
  read?: boolean;
}

const thread: Record<string, Message[]> = {
  vektar: [
    { id: "1", from: "them", date: "May 20, 2025", text: "Hello Amoo, please update the product catalog with the latest items we sent.", time: "10:24 AM" },
    { id: "2", from: "me", date: "May 20, 2025", text: "Hello! Sure, I'll update the catalog today and notify you once it's live.", time: "10:26 AM", read: true },
    { id: "3", from: "them", date: "May 20, 2025", text: "Great, also the banner on the homepage needs to be changed.", time: "10:27 AM" },
    { id: "4", from: "me", date: "May 20, 2025", text: "Noted! I'll handle that as well.", time: "10:28 AM", read: true },
    { id: "5", from: "them", date: "May 21, 2025", text: "Thank you, looking forward to it.", time: "9:15 AM" },
    { id: "6", from: "me", date: "May 21, 2025", text: "You're welcome! I'll keep you updated.", time: "9:16 AM", read: true },
  ],
};

const tabs = ["Messages", "Files", "Tickets (2)", "Invoices", "Notes", "Activity"];

export default function ChatWindow({ conversation }: { conversation: Conversation }) {
  const [activeTab, setActiveTab] = useState("Messages");
  const [draft, setDraft] = useState("");
  const messages = thread[conversation.id] ?? [];

  let lastDate = "";

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${conversation.avatarBg}`}>
            {conversation.initial}
          </span>
          <div>
            <p className="text-sm font-semibold">{conversation.name}</p>
            <p className="flex items-center gap-1 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {conversation.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button type="button" className="hover:text-white"><Phone size={18} /></button>
          <button type="button" className="hover:text-white"><Video size={18} /></button>
          <button type="button" className="hover:text-white"><Info size={18} /></button>
          <button type="button" className="hover:text-white"><MoreVertical size={18} /></button>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-white/10 px-5 text-sm text-gray-500">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 py-3 ${
              activeTab === tab ? "border-indigo-400 text-indigo-300" : "border-transparent hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m) => {
          const showDate = m.date !== lastDate;
          lastDate = m.date;
          return (
            <div key={m.id}>
              {showDate && (
                <p className="my-3 text-center text-xs text-gray-500">{m.date}</p>
              )}
              <div className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-md">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm ${
                      m.from === "me"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-white/10 text-gray-200"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className={`mt-1 flex items-center gap-1 text-xs text-gray-500 ${m.from === "me" ? "justify-end" : ""}`}>
                    {m.time}
                    {m.from === "me" && (m.read ? <CheckCheck size={12} className="text-indigo-300" /> : <Check size={12} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">No messages yet in this conversation.</p>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 px-5 py-3.5">
        <button type="button" className="text-gray-400 hover:text-white"><Paperclip size={18} /></button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
        />
        <button type="button" className="text-gray-400 hover:text-white"><Smile size={18} /></button>
        <button
          type="button"
          onClick={() => setDraft("")}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
