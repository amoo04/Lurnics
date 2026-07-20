import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import MessagesStats from "../components/MessagesStats";
import ConversationsList from "../components/ConversationsList";
import ChatWindow from "../components/ChatWindow";
import ConversationDetailsPanel from "../components/ConversationDetailsPanel";
import { useConversations } from "../hooks/useMessages";

export default function Messages() {
  const { data, loading, error } = useConversations();
  const conversations = data ?? [];
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const selected = conversations.find((c) => c.clientId === selectedClientId) ?? conversations[0] ?? null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Messages"
          subtitle="Communicate with clients and manage all support conversations."
          breadcrumb={["Home", "Messages", "Inbox"]}
          action={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus size={16} />
              New Message
              <ChevronDown size={14} />
            </button>
          }
        />
        <MessagesStats conversations={conversations} loading={loading} />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <ConversationsList
            conversations={conversations}
            loading={loading}
            error={error}
            selectedId={selected?.clientId ?? null}
            onSelect={setSelectedClientId}
          />
          {selected ? (
            <>
              <ChatWindow conversation={selected} />
              <ConversationDetailsPanel conversation={selected} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500 shadow-sm">
              {loading ? "Loading conversations…" : error ? error : "No conversations yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
