import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { createClient } from "../hooks/useClients";
import { ApiError } from "../../../lib/api";

export default function ClientCreateForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createClient({
        companyName,
        contactPerson,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
        industry: industry || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create client");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full lg:w-80 lg:shrink-0">
      <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add Client</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <input
          required
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          required
          placeholder="Contact person"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          placeholder="Industry (optional)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Client"}
        </button>
      </form>
    </div>
  );
}
