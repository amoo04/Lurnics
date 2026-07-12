import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Building2, Tag, FileText, Send, Trash2 } from "lucide-react";
import { LEAD_STAGES, type Lead, type LeadStatus } from "../api/leads.types";
import { deleteLead, updateLeadStatus } from "../hooks/useLeads";
import { ApiError } from "../../../lib/api";

interface LeadDetailPanelProps {
  lead: Lead;
  onChanged: () => void;
  onDeleted: () => void;
}

export default function LeadDetailPanel({ lead, onChanged, onDeleted }: LeadDetailPanelProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStageChange(status: LeadStatus) {
    setSaving(true);
    setError(null);
    try {
      await updateLeadStatus(lead.id, status);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update stage");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete lead ${lead.contactPerson}? This can't be undone.`)) return;
    try {
      await deleteLead(lead.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete lead");
    }
  }

  return (
    <div className="w-full lg:w-80 lg:shrink-0 space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold">{lead.contactPerson}</p>
        <p className="text-sm text-gray-400">{lead.companyName}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-300">
          <p className="flex items-center gap-2">
            <Mail size={14} className="text-indigo-300" />
            {lead.email}
          </p>
          {lead.phone && (
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-indigo-300" />
              {lead.phone}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Building2 size={14} className="text-indigo-300" />
            {lead.companyName}
          </p>
          <p className="flex items-center gap-2">
            <Tag size={14} className="text-indigo-300" />
            Source: {lead.source ?? "Unknown"}
          </p>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-gray-500">Stage</label>
          <select
            value={lead.status}
            disabled={saving}
            onChange={(e) => handleStageChange(e.target.value as LeadStatus)}
            className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
          >
            {LEAD_STAGES.map(({ value, label }) => (
              <option key={value} value={value} className="bg-[#0b0f1a]">
                {label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        </div>

        {lead.budgetRange && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">Potential Value</p>
            <p className="text-lg font-bold">{lead.budgetRange}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-3 text-sm font-semibold">Outreach</p>
        <div className="space-y-2">
          <Link
            to={`/leads/${lead.id}/email`}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-sm font-medium text-white"
          >
            <Mail size={14} />
            Draft Pitch Email
          </Link>
          <Link
            to={`/leads/${lead.id}/proposal`}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300"
          >
            <FileText size={14} />
            Draft Proposal
          </Link>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Send size={12} />
          Drafts are generated for your review — nothing is sent automatically.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
      >
        <Trash2 size={14} />
        Delete Lead
      </button>
    </div>
  );
}
