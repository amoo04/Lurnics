import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ClipboardCopy, Check } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import { proposalTemplate, fillTemplate, senderName } from "../components/templates";
import { useLead } from "../hooks/useLeads";

export default function DraftProposal() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { data: lead } = useLead(leadId);
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState(() => proposalTemplate.sections.map((s) => ({ ...s })));

  useEffect(() => {
    if (!lead) return;
    setSections(proposalTemplate.sections.map((s) => ({ ...s, body: fillTemplate(s.body, lead) })));
  }, [lead]);

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

  const fullText = [
    `Proposal for ${lead.companyName}`,
    `Prepared by ${senderName} · Lurnics`,
    "",
    ...sections.flatMap((s) => [s.label, s.body, ""]),
  ].join("\n");

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Draft Proposal"
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
            <p className="text-lg font-semibold text-gray-900">Proposal for {lead.companyName}</p>
            <p className="mb-5 text-sm text-gray-500">Prepared by {senderName} · Lurnics</p>

            <div className="space-y-5">
              {sections.map((section, i) => (
                <div key={section.id}>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">{section.label}</label>
                  <textarea
                    value={section.body}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s, idx) => (idx === i ? { ...s, body: e.target.value } : s)),
                      )
                    }
                    rows={section.id === "scope" ? 6 : 3}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(fullText);
                  setCopied(true);
                }}
                className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
                {copied ? "Copied" : "Copy to Clipboard"}
              </button>
              <p className="text-xs text-gray-500">
                Copy into your proposal doc/PDF tool of choice — nothing is sent automatically.
              </p>
            </div>
          </div>

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
  );
}
