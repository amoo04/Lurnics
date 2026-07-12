import { ChevronUp, Ticket, Plus, Calendar, FileText, Receipt, Lock } from "lucide-react";
import type { Conversation } from "./ConversationsList";

const tickets = [
  { id: "#1045", priority: "High", priorityColor: "text-red-400", title: "Deployment issue on live server", status: "Open", statusColor: "bg-blue-500/20 text-blue-300", meta: "Created: May 20, 2025" },
  { id: "#1038", priority: "Medium", priorityColor: "text-orange-400", title: "Banner not displaying correctly", status: "Resolved", statusColor: "bg-green-500/20 text-green-300", meta: "Resolved: May 18, 2025" },
];

const quickActions = [
  { icon: Ticket, label: "Create Ticket" },
  { icon: Calendar, label: "Schedule Call" },
  { icon: FileText, label: "Send File" },
  { icon: Receipt, label: "Create Invoice" },
];

export default function ConversationDetailsPanel({ conversation }: { conversation: Conversation }) {
  return (
    <div className="w-full lg:w-80 lg:shrink-0 space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Conversation Details</p>
          <ChevronUp size={16} className="text-gray-500" />
        </div>

        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${conversation.avatarBg}`}>
            {conversation.initial}
          </span>
          <div>
            <p className="font-semibold">{conversation.name}</p>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-300">Active Client</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Project</span><span className="text-indigo-300">E-commerce Platform</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Primary Contact</span><span>Tosin Daniel</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-300">info@{conversation.name.toLowerCase().replace(/\s+/g, "")}.com</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>+234 810 123 4567</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Client Since</span><span>Jan 15, 2025</span></div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Support Tickets</p>
          <button type="button" className="text-xs text-indigo-400">View All</button>
        </div>
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  {t.id}
                  <span className={t.priorityColor}>{t.priority}</span>
                </p>
                <p className="text-sm text-gray-200">{t.title}</p>
                <p className="text-xs text-gray-500">{t.meta}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${t.statusColor}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-3 text-sm font-semibold">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
            >
              <Icon size={14} className="text-indigo-300" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Lock size={13} className="text-gray-500" />
            Internal Notes
          </p>
          <button type="button" className="flex items-center gap-1 text-xs text-indigo-400">
            <Plus size={12} />
            Add Note
          </button>
        </div>
        <div className="rounded-md bg-white/[0.04] p-3">
          <p className="text-xs text-gray-300">Client is awaiting Paystack integration keys. Follow up next week.</p>
          <p className="mt-2 text-xs text-gray-500">Added by you · May 19, 2025</p>
        </div>
      </div>
    </div>
  );
}
