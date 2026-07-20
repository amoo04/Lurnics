import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ClipboardCopy, Check, Send, AlertCircle } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import { emailTemplates, fillTemplate } from "../components/templates";
import { apiPost, ApiError } from "../../../lib/api";
import { useLead } from "../hooks/useLeads";

export default function DraftEmail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { data: lead } = useLead(leadId);

  const [templateId, setTemplateId] = useState(emailTemplates[0].id);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (!lead) return;
    const template = emailTemplates.find((t) => t.id === templateId) ?? emailTemplates[0];
    setSubject(fillTemplate(template.subject, lead));
    setBody(fillTemplate(template.body, lead));
    setCopied(false);
    setSendState("idle");
  }, [templateId, lead]);

  async function handleSend() {
    if (!lead) return;
    if (!window.confirm(`Send this email to ${lead.email} now?`)) return;

    setSendState("sending");
    setSendError("");
    try {
      await apiPost("/api/leads/send-email", { to: lead.email, subject, body });
      setSendState("sent");
    } catch (err) {
      setSendState("error");
      setSendError(err instanceof ApiError ? err.message : "Failed to send email");
    }
  }

  if (!lead) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <p className="text-gray-500">Loading…</p>
          <Link to="/leads" className="text-orange-500">
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Draft Pitch Email"
          subtitle={`For ${lead.contactPerson} at ${lead.companyName}`}
          action={
            <button
              type="button"
              onClick={() => navigate("/leads")}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft size={14} />
              Back to Leads
            </button>
          }
        />

        <div className="grid gap-6 px-4 sm:px-8 pb-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-gray-600">Template</label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                {emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-gray-600">To</label>
              <input
                disabled
                value={`${lead.contactPerson} <${lead.email}>`}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-gray-600">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-600">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSend}
                disabled={sendState === "sending" || sendState === "sent"}
                className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
              >
                {sendState === "sent" ? <Check size={16} /> : <Send size={16} />}
                {sendState === "sending" ? "Sending..." : sendState === "sent" ? "Sent" : "Send Email"}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
                  setCopied(true);
                }}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
              >
                {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
                {copied ? "Copied" : "Copy to Clipboard"}
              </button>
            </div>
            {sendState === "error" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={12} />
                {sendError}
              </p>
            )}
            {sendState === "sent" && (
              <p className="mt-2 text-xs text-green-600">Email sent to {lead.email}.</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-gray-900">Lead Context</p>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>
                  <span className="text-gray-500">Company:</span> {lead.companyName}
                </p>
                <p>
                  <span className="text-gray-500">Source:</span> {lead.source ?? "Unknown"}
                </p>
                <p>
                  <span className="text-gray-500">Stage:</span> {lead.status}
                </p>
                {lead.budgetRange && (
                  <p>
                    <span className="text-gray-500">Potential Value:</span> {lead.budgetRange}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
