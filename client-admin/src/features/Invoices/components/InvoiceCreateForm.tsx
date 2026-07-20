import { useState, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { createInvoice } from "../hooks/useInvoices";
import type { InvoiceStatus, LineItemInput } from "../api/invoices.types";
import { useApiGet } from "../../../lib/useApi";
import { ApiError } from "../../../lib/api";

interface ClientOption {
  id: string;
  companyName: string;
}

export default function InvoiceCreateForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const { data: clientsData } = useApiGet<{ items: ClientOption[] }>("/api/clients?limit=100");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("draft");
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItemInput[]>([{ description: "", amount: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLineItem(i: number, patch: Partial<LineItemInput>) {
    setLineItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createInvoice({
        invoiceNumber,
        clientId,
        dueDate,
        status,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        notes: notes || undefined,
        lineItems: lineItems.filter((item) => item.description && item.amount > 0),
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6 px-4 sm:px-8">
      <form onSubmit={handleSubmit} className="max-w-2xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">Create Invoice</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="">Select client…</option>
            {(clientsData?.items ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            {(["draft", "pending", "paid", "overdue"] as InvoiceStatus[]).map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1.5 text-sm text-gray-600">Line Items</p>
          <div className="space-y-2">
            {lineItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(i, { description: e.target.value })}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={item.amount || ""}
                  onChange={(e) => updateLineItem(i, { amount: Number(e.target.value) })}
                  className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLineItems((prev) => [...prev, { description: "", amount: 0 }])}
            className="mt-2 flex items-center gap-1 text-xs text-orange-500"
          >
            <Plus size={12} />
            Add line item
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
          <input
            type="number"
            placeholder="Tax"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Invoice"}
        </button>
      </form>
    </div>
  );
}
