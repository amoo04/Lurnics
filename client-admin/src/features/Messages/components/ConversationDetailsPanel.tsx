import { ChevronUp, Ticket, Calendar, FileText, Receipt } from "lucide-react";
import { avatarColorFor, formatDate, getInitial } from "../../../lib/uiHelpers";
import { useClientTickets } from "../hooks/useMessages";
import type { ClientConversation } from "../api/messages.types";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-50 text-blue-600",
  in_progress: "bg-orange-50 text-orange-500",
  resolved: "bg-green-50 text-green-600",
  closed: "bg-gray-100 text-gray-500",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-orange-500",
  high: "text-red-500",
  urgent: "text-red-500",
};

const quickActions = [
  { icon: Ticket, label: "Create Ticket" },
  { icon: Calendar, label: "Schedule Call" },
  { icon: FileText, label: "Send File" },
  { icon: Receipt, label: "Create Invoice" },
];

export default function ConversationDetailsPanel({ conversation }: { conversation: ClientConversation }) {
  const { client } = conversation;
  const { data, loading, error } = useClientTickets(client.id);
  const tickets = data?.items ?? [];

  return (
    <div className="w-full lg:w-80 lg:shrink-0 space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Conversation Details</p>
          <ChevronUp size={16} className="text-gray-500" />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${avatarColorFor(
              client.companyName,
            )}`}
          >
            {getInitial(client.companyName)}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{client.companyName}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                client.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              {client.status === "active" ? "Active Client" : "Inactive Client"}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-900">
          {client.industry && (
            <div className="flex justify-between"><span className="text-gray-500">Industry</span><span className="text-orange-500">{client.industry}</span></div>
          )}
          <div className="flex justify-between"><span className="text-gray-500">Primary Contact</span><span>{client.contactPerson}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-600">{client.email ?? "—"}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{client.phone ?? "—"}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Client Since</span><span>{formatDate(client.createdAt)}</span></div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Support Tickets</p>
          <button type="button" className="text-xs text-orange-500">View All</button>
        </div>
        <div className="space-y-3">
          {loading && <p className="text-xs text-gray-500">Loading tickets…</p>}
          {error && <p className="text-xs text-red-500">{error}</p>}
          {!loading && !error && tickets.length === 0 && (
            <p className="text-xs text-gray-500">No support tickets for this client.</p>
          )}
          {!loading &&
            !error &&
            tickets.map((t) => (
              <div key={t.id} className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    #{t.id.slice(0, 6)}
                    <span className={PRIORITY_STYLES[t.priority] ?? "text-gray-500"}>{t.priority}</span>
                  </p>
                  <p className="text-sm text-gray-900">{t.subject}</p>
                  <p className="text-xs text-gray-500">Created: {formatDate(t.createdAt)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50"
            >
              <Icon size={14} className="text-orange-500" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
