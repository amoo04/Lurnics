import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { createMaintenance } from "../hooks/useMaintenance";
import { MAINTENANCE_PLANS, type MaintenanceStatus } from "../api/maintenance.types";
import { useApiGet } from "../../../lib/useApi";
import { ApiError } from "../../../lib/api";

interface ClientOption {
  id: string;
  companyName: string;
}

export default function MaintenanceCreateForm({
  initialPlan,
  onCreated,
  onClose,
}: {
  initialPlan?: string;
  onCreated: () => void;
  onClose: () => void;
}) {
  const { data: clientsData } = useApiGet<{ items: ClientOption[] }>("/api/clients?limit=100");
  const [clientId, setClientId] = useState("");
  const [planType, setPlanType] = useState(initialPlan ?? MAINTENANCE_PLANS[0].name);
  const [amount, setAmount] = useState(
    String(MAINTENANCE_PLANS.find((p) => p.name === (initialPlan ?? MAINTENANCE_PLANS[0].name))?.price ?? 0),
  );
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<MaintenanceStatus>("active");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createMaintenance({
        clientId,
        planType,
        amount: Number(amount),
        startDate,
        expiryDate,
        status,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create contract");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6 px-4 sm:px-8">
      <form onSubmit={handleSubmit} className="max-w-lg rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add Maintenance Contract</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <select
          required
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="">Select client…</option>
          {(clientsData?.items ?? []).map((c) => (
            <option key={c.id} value={c.id} className="bg-[#0b0f1a]">
              {c.companyName}
            </option>
          ))}
        </select>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={planType}
            onChange={(e) => {
              setPlanType(e.target.value);
              const plan = MAINTENANCE_PLANS.find((p) => p.name === e.target.value);
              if (plan) setAmount(String(plan.price));
            }}
            className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
          >
            {MAINTENANCE_PLANS.map((p) => (
              <option key={p.name} value={p.name} className="bg-[#0b0f1a]">
                {p.name}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="Amount / year"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
          />
          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-gray-300 outline-none"
          />
          <input
            required
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-gray-300 outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
          className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="active" className="bg-[#0b0f1a]">Active</option>
          <option value="expiring_soon" className="bg-[#0b0f1a]">Expiring Soon</option>
          <option value="overdue" className="bg-[#0b0f1a]">Overdue</option>
          <option value="cancelled" className="bg-[#0b0f1a]">Cancelled</option>
        </select>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Contract"}
        </button>
      </form>
    </div>
  );
}
