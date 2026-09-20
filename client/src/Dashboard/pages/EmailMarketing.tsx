import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, X, Mail, Send } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import {
  createCampaign,
  fetchCampaigns,
  fetchEmailStats,
  sendCampaign,
} from "../hooks/useEmailCampaigns";
import { fetchEmailTemplates } from "../hooks/useEmailTemplates";
import { ApiError } from "../../lib/api";
import type { CampaignAudience, CreateCampaignInput, EmailCampaign, EmailStats } from "../api/email-campaigns.types";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function ComposeModal({ templateId, onClose, onSaved }: { templateId: string | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [audience, setAudience] = useState<CampaignAudience>("all_customers");
  const [loadingTemplate, setLoadingTemplate] = useState(!!templateId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!templateId) return;
    fetchEmailTemplates()
      .then((templates) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
          setName(template.name);
          setSubject(template.subject);
          setHtml(template.html);
          setText(template.text);
        }
      })
      .finally(() => setLoadingTemplate(false));
  }, [templateId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateCampaignInput = { name, subject, html, text, ctaUrl: ctaUrl || undefined, audience };

    try {
      await createCampaign(input);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Create Email</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {loadingTemplate ? (
          <div className="py-10 text-center text-sm text-gray-400">Loading template…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Campaign Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Subject Line</label>
              <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value as CampaignAudience)} className={inputClass}>
                <option value="all_customers">All Customers</option>
                <option value="active_customers">Active Customers</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Call-to-Action Link (Optional, wrapped for click tracking)
              </label>
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://yourstore.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                HTML Body ({"{{CTA_LINK}}"} and {"{{UNSUBSCRIBE_LINK}}"} are replaced per recipient)
              </label>
              <textarea required value={html} onChange={(e) => setHtml(e.target.value)} rows={6} className={`${inputClass} font-mono text-xs`} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Plain Text Body</label>
              <textarea required value={text} onChange={(e) => setText(e.target.value)} rows={3} className={inputClass} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save as Draft"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function EmailMarketing() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";
  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(!!templateId);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<{ id: string; message: string } | null>(null);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const result = await fetchCampaigns({});
      setCampaigns(result.items);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setStats(await fetchEmailStats());
  }

  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  async function handleSend(campaign: EmailCampaign) {
    setSendingId(campaign.id);
    setSendError(null);
    try {
      const updated = await sendCampaign(campaign.id);
      setCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? updated : c)));
      loadStats();
    } catch (err) {
      setSendError({ id: campaign.id, message: err instanceof ApiError ? err.message : "Failed to send" });
    } finally {
      setSendingId(null);
    }
  }

  function closeCompose() {
    setShowCompose(false);
    searchParams.delete("templateId");
    setSearchParams(searchParams);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-sm text-gray-500">Create, manage and analyze your email campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/portal/email-templates"
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Templates
          </Link>
          <button
            type="button"
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            <Plus size={16} />
            Create Email
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Emails Sent</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.sent ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Open Rate</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{((stats?.openRate ?? 0) * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Click Rate</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{((stats?.clickRate ?? 0) * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Conversions</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.conversions ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Revenue</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatMoney(stats?.revenue ?? 0, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Unsubscribes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.unsubscribes ?? 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Mail size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No campaigns yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Create an email and send it to your customers to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-2.5 font-medium">Campaign</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Sent</th>
                  <th className="px-4 py-2.5 font-medium">Open Rate</th>
                  <th className="px-4 py-2.5 font-medium">Click Rate</th>
                  <th className="px-4 py-2.5 font-medium">Conversions</th>
                  <th className="px-4 py-2.5 font-medium">Revenue</th>
                  <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-xs text-gray-400">{campaign.subject}</p>
                      {sendError?.id === campaign.id && (
                        <p className="mt-1 text-xs text-red-500">{sendError.message}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          campaign.status === "sent" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {campaign.status === "sent" ? "Sent" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{campaign.sent}</td>
                    <td className="px-4 py-3 text-gray-600">{(campaign.openRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-gray-600">{(campaign.clickRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-gray-600">{campaign.conversions}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatMoney(campaign.revenue, currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {campaign.status === "draft" && (
                        <button
                          type="button"
                          disabled={sendingId === campaign.id}
                          onClick={() => handleSend(campaign)}
                          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-50"
                        >
                          <Send size={12} />
                          {sendingId === campaign.id ? "Sending…" : "Send Now"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCompose && (
        <ComposeModal
          templateId={templateId}
          onClose={closeCompose}
          onSaved={() => {
            closeCompose();
            loadCampaigns();
          }}
        />
      )}
    </DashboardLayout>
  );
}
