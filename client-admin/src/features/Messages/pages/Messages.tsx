import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import MessagesStats from "../components/MessagesStats";
import ConversationsList, { conversations } from "../components/ConversationsList";
import ChatWindow from "../components/ChatWindow";
import ConversationDetailsPanel from "../components/ConversationDetailsPanel";

export default function Messages() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

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
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={16} />
              New Message
              <ChevronDown size={14} />
            </button>
          }
        />
        <MessagesStats />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <ConversationsList selectedId={selectedId} onSelect={setSelectedId} />
          <ChatWindow conversation={selected} />
          <ConversationDetailsPanel conversation={selected} />
        </div>
      </div>
    </div>
  );
}
