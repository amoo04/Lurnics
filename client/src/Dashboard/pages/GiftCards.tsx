import { useEffect, useState, type FormEvent } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight, Gift, Copy, Minus } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { createGiftCard, fetchGiftCardStats, fetchGiftCards, redeemGiftCard } from "../hooks/useGiftCards";
import { ApiError } from "../../lib/api";
import type { CreateGiftCardInput, GiftCard, GiftCardKind, GiftCardStatus } from "../api/gift-cards.types";

const STATUS_FILTERS: Array<{ id: GiftCardStatus | "all"; label: string }> = [
  { id: "all", label: "All Gift Cards" },
  { id: "active", label: "Active" },
  { id: "redeemed", label: "Redeemed" },
  { id: "expired", label: "Expired" },
  { id: "scheduled", label: "Scheduled" },
];

const STATUS_STYLES: Record<GiftCardStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  redeemed: "bg-gray-100 text-gray-500",
  expired: "bg-red-50 text-red-600",
  scheduled: "bg-blue-50 text-blue-600",
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function IssueGiftCardModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [type, setType] = useState<GiftCardKind>("digital");
  const [initialValue, setInitialValue] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: CreateGiftCardInput = {
      type,
      initialValue: Number(initialValue) || 0,
      recipientName: recipientName || undefined,
      recipientEmail: recipientEmail || undefined,
      message: message || undefined,
      expiresAt: expiresAt || undefined,
    };

    try {
      await createGiftCard(input);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create gift card");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Create Gift Card</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as GiftCardKind)} className={inputClass}>
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Amount</label>
            <input
              type="number"
              min={0.01}
              step="0.01"
              required
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Recipient Name (Optional)</label>
            <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Recipient Email (Optional)</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Message (Optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Expiry Date (Optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create Gift Card"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RedeemModal({
  card,
  currency,
  onClose,
  onRedeemed,
}: {
  card: GiftCard;
  currency: string;
  onClose: () => void;
  onRedeemed: (card: GiftCard) => void;
}) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await redeemGiftCard(card.id, Number(amount) || 0);
      onRedeemed(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to redeem");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Redeem Gift Card</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          {card.code} · Balance: <span className="font-medium text-gray-900">{formatMoney(card.balance, currency)}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Amount to Redeem</label>
            <input
              type="number"
              min={0.01}
              max={card.balance}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Redeeming…" : "Redeem"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GiftCards() {
  const { session } = useDashboardAuth();
  const currency = session?.business.currency ?? "USD";

  const [cards, setCards] = useState<GiftCard[]>([]);
  const [stats, setStats] = useState<{ totalSales: number; totalSold: number; totalRedeemed: number; outstandingBalance: number } | null>(null);
  const [status, setStatus] = useState<GiftCardStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [redeeming, setRedeeming] = useState<GiftCard | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadCards() {
    setLoading(true);
    try {
      const result = await fetchGiftCards({
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page,
      });
      setCards(result.items);
      setPagination({
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
        total: result.pagination.total,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setStats(await fetchGiftCardStats());
  }

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    loadStats();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    loadCards();
  }

  function copyCode(card: GiftCard) {
    navigator.clipboard.writeText(card.code);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-sm text-gray-500">Create, manage and track gift cards.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Create Gift Card
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Gift Card Sales</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.totalSales ?? 0, currency)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Gift Cards Sold</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats?.totalSold ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Total Redeemed</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.totalRedeemed ?? 0, currency)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Outstanding Balance</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatMoney(stats?.outstandingBalance ?? 0, currency)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-4 py-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setStatus(f.id);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                status === f.id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, recipient or email…"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Gift size={32} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No gift cards yet</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Create a gift card to sell or send to a customer.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2.5 font-medium">Gift Card</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Amount</th>
                    <th className="px-4 py-2.5 font-medium">Balance</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Sold To</th>
                    <th className="px-4 py-2.5 font-medium">Sold Date</th>
                    <th className="px-4 py-2.5 font-medium">Expiry Date</th>
                    <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const percentLeft = card.initialValue > 0 ? Math.round((card.balance / card.initialValue) * 100) : 0;
                    return (
                      <tr key={card.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs font-medium text-gray-900">{card.code}</p>
                            <button
                              type="button"
                              onClick={() => copyCode(card)}
                              className="text-gray-300 hover:text-gray-600"
                              title="Copy code"
                            >
                              <Copy size={12} />
                            </button>
                            {copiedId === card.id && <span className="text-[10px] text-emerald-600">Copied</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium capitalize text-purple-600">
                            {card.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatMoney(card.initialValue, currency)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{formatMoney(card.balance, currency)}</p>
                          <p className="text-xs text-gray-400">
                            {card.balance <= 0 ? "Fully redeemed" : `${percentLeft}% left`}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[card.status]}`}>
                            {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {card.recipientName ?? "—"}
                          {card.recipientEmail && <p className="text-xs text-gray-400">{card.recipientEmail}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(card.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-500">{card.expiresAt ?? "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            disabled={card.status !== "active"}
                            onClick={() => setRedeeming(card)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                            title="Redeem"
                          >
                            <Minus size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <p>
                Showing {cards.length} of {pagination.total} gift cards
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <IssueGiftCardModal
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            setShowCreate(false);
            setPage(1);
            loadCards();
            loadStats();
          }}
        />
      )}

      {redeeming && (
        <RedeemModal
          card={redeeming}
          currency={currency}
          onClose={() => setRedeeming(null)}
          onRedeemed={(updated) => {
            setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setRedeeming(null);
            loadStats();
          }}
        />
      )}
    </DashboardLayout>
  );
}
