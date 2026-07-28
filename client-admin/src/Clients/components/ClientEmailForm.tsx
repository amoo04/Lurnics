import { useState, type FormEvent } from "react";
import { X, CheckCircle2, Send } from "lucide-react";
import { sendClientEmail } from "../hooks/useClients";
import { ApiError } from "../../lib/api";
import type { Client, ClientEmailType } from "../api/clients.types";

const TYPES: { value: ClientEmailType; label: string }[] = [
  { value: "newsletter", label: "Newsletter" },
  { value: "pitch", label: "Pitch" },
  { value: "update", label: "Project Update" },
  { value: "custom", label: "Custom" },
];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

export default function ClientEmailForm({ client, onClose }: { client: Client; onClose: () => void }) {
  const [type, setType] = useState<ClientEmailType>("update");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sendClientEmail(client.id, {
        type,
        subject,
        body,
        ctaLabel: ctaLabel || undefined,
        ctaUrl: ctaUrl || undefined,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send email");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full lg:w-80 lg:shrink-0">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">Email {client.companyName}</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>

        {!client.email ? (
          <p className="mt-4 text-xs text-red-500">This client has no email address on file.</p>
        ) : sent ? (
          <div className="mt-6 flex flex-col items-center text-center">
            <CheckCircle2 size={32} className="text-orange-500" />
            <p className="mt-3 text-sm font-medium text-gray-900">Email sent.</p>
            <p className="mt-1 text-xs text-gray-500">Delivered to {client.email}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    type === value
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              required
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
            />
            <textarea
              required
              rows={6}
              placeholder="Write your message. Separate paragraphs with a blank line."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${inputClass} resize-none`}
            />
            <input
              placeholder="Button label (optional)"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className={inputClass}
            />
            <input
              type="url"
              placeholder="Button link (optional)"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className={inputClass}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Email"}
              {!submitting && <Send size={14} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
