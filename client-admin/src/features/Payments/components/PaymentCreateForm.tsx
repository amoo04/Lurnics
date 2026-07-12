import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { recordPayment } from "../hooks/usePayments";
import type { PaymentStatus } from "../api/payments.types";
import { useApiGet } from "../../../lib/useApi";
import { ApiError } from "../../../lib/api";

interface InvoiceOption {
  id: string;
  invoiceNumber: string;
}

export default function PaymentCreateForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const { data: invoicesData } = useApiGet<{ items: InvoiceOption[] }>("/api/invoices?limit=100");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<PaymentStatus>("completed");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await recordPayment({
        invoiceId,
        amount: Number(amount),
        paymentMethod,
        paymentDate,
        status,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6 px-4 sm:px-8">
      <form onSubmit={handleSubmit} className="max-w-lg rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Record Payment</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <select
          required
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="">Select invoice…</option>
          {(invoicesData?.items ?? []).map((inv) => (
            <option key={inv.id} value={inv.id} className="bg-[#0b0f1a]">
              {inv.invoiceNumber}
            </option>
          ))}
        </select>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
          />
          <input
            required
            placeholder="Payment method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
          />
          <input
            required
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-gray-300 outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
          >
            <option value="completed" className="bg-[#0b0f1a]">Completed</option>
            <option value="pending" className="bg-[#0b0f1a]">Pending</option>
            <option value="failed" className="bg-[#0b0f1a]">Failed</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Recording…" : "Record Payment"}
        </button>
      </form>
    </div>
  );
}
