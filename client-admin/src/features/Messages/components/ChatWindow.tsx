import { useState } from "react";
import { Phone, Video, Info, MoreVertical, Paperclip, Smile, Send, Check, CheckCheck } from "lucide-react";
import { avatarColorFor, getInitial } from "../../../lib/uiHelpers";
import { useAuth } from "../../../context/AuthContext";
import { sendClientMessage, useConversationThread } from "../hooks/useMessages";
import type { ClientConversation } from "../api/messages.types";

const tabs = ["Messages", "Files", "Tickets", "Invoices", "Notes", "Activity"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ChatWindow({ conversation }: { conversation: ClientConversation }) {
  const [activeTab, setActiveTab] = useState("Messages");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { data, loading, error, refetch } = useConversationThread(conversation.clientId);
  const messages = data ?? [];
  const { client } = conversation;

  let lastDate = "";

  async function handleSend() {
    const message = draft.trim();
    if (!message || sending) return;
    setSending(true);
    try {
      await sendClientMessage(conversation.clientId, message);
      setDraft("");
      refetch();
    } catch {
      // leave draft intact so the user can retry
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${avatarColorFor(
              client.companyName,
            )}`}
          >
            {getInitial(client.companyName)}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{client.companyName}</p>
            <p className="text-xs text-gray-500">{client.contactPerson}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button type="button" className="hover:text-gray-900"><Phone size={18} /></button>
          <button type="button" className="hover:text-gray-900"><Video size={18} /></button>
          <button type="button" className="hover:text-gray-900"><Info size={18} /></button>
          <button type="button" className="hover:text-gray-900"><MoreVertical size={18} /></button>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-gray-200 px-5 text-sm text-gray-500">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 py-3 ${
              activeTab === tab ? "border-gray-900 text-gray-900" : "border-transparent hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {loading && <p className="py-12 text-center text-sm text-gray-500">Loading messages…</p>}
        {error && <p className="py-12 text-center text-sm text-red-500">{error}</p>}
        {!loading &&
          !error &&
          messages.map((m) => {
            const date = formatDate(m.createdAt);
            const showDate = date !== lastDate;
            lastDate = date;
            const isMe = m.senderId === user?.id;
            return (
              <div key={m.id}>
                {showDate && <p className="my-3 text-center text-xs text-gray-500">{date}</p>}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-md">
                    {!isMe && m.sender?.name && (
                      <p className="mb-1 text-xs text-gray-500">{m.sender.name}</p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {m.message}
                    </div>
                    <div className={`mt-1 flex items-center gap-1 text-xs text-gray-500 ${isMe ? "justify-end" : ""}`}>
                      {formatTime(m.createdAt)}
                      {isMe && (m.readStatus ? <CheckCheck size={12} className="text-orange-500" /> : <Check size={12} />)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {!loading && !error && messages.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">No messages yet in this conversation.</p>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-gray-200 px-5 py-3.5">
        <button type="button" className="text-gray-400 hover:text-gray-900"><Paperclip size={18} /></button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <button type="button" className="text-gray-400 hover:text-gray-900"><Smile size={18} /></button>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-black disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
