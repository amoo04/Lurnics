import { useState, type FormEvent } from "react";
import { Globe, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { ApiError } from "../../lib/api";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

export default function Domains() {
  const { session, updateBusinessSettings } = useDashboardAuth();
  const [domain, setDomain] = useState(session?.business.customDomain ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setSaved(false);
    try {
      await updateBusinessSettings({ customDomain: domain.trim() || null });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save domain");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Domains</h1>
        <p className="text-sm text-gray-500">Connect a custom domain you already own to your store.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-gray-900">Custom Domain</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Domain</label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="shop.yourbrand.com"
                className={inputClass}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {saved && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 size={14} />
                Saved
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save Domain"}
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2 rounded-md border border-dashed border-gray-300 p-3 text-xs text-gray-500">
            <Globe size={14} className="mt-0.5 shrink-0" />
            <p>
              This saves your domain preference only. Actually routing traffic from it to your store requires
              custom-domain hosting that isn't wired up yet — for now, your store is reachable at{" "}
              <span className="font-medium text-gray-700">lurnics.com/store/{session?.business.slug}</span>.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-gray-900">DNS Setup (once connected)</p>
          <p className="mb-3 text-sm text-gray-500">
            When custom-domain routing is available, you'll point your domain at Lurnics with a CNAME record:
          </p>
          <div className="rounded-md bg-gray-50 p-3 font-mono text-xs text-gray-700">
            <p>Type: CNAME</p>
            <p>Name: {domain ? domain.split(".")[0] : "shop"}</p>
            <p>Value: {session?.business.slug}.lurnics.com</p>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            We don't sell or register domains — buy one from any registrar (Namecheap, GoDaddy, etc.) and connect it here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
