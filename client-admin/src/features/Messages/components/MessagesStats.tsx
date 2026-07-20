import { MessageSquare, Mail, Ticket, CheckCircle2 } from "lucide-react";
import { useTicketsCountByStatus } from "../hooks/useMessages";
import type { ClientConversation } from "../api/messages.types";

export default function MessagesStats({
  conversations,
  loading,
}: {
  conversations: ClientConversation[];
  loading: boolean;
}) {
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const { data: openTickets, loading: openLoading } = useTicketsCountByStatus("open");
  const { data: resolvedTickets, loading: resolvedLoading } = useTicketsCountByStatus("resolved");

  const stats = [
    {
      icon: MessageSquare,
      iconBg: "bg-orange-50 text-orange-500",
      value: loading ? "—" : String(conversations.length),
      label: "Total Conversations",
    },
    {
      icon: Mail,
      iconBg: "bg-red-50 text-red-500",
      value: loading ? "—" : String(totalUnread),
      label: "Unread Messages",
    },
    {
      icon: Ticket,
      iconBg: "bg-green-50 text-green-600",
      value: openLoading ? "—" : String(openTickets?.pagination.total ?? 0),
      label: "Open Tickets",
    },
    {
      icon: CheckCircle2,
      iconBg: "bg-blue-50 text-blue-500",
      value: resolvedLoading ? "—" : String(resolvedTickets?.pagination.total ?? 0),
      label: "Resolved Tickets",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:gap-6 sm:px-8 md:grid-cols-4">
      {stats.map(({ icon: Icon, iconBg, value, label }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
