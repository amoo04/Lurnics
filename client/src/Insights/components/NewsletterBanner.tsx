import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead } from "../../Contact/hooks/useLeads";
import { ApiError } from "../../lib/api";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitLead({
        companyName: "Newsletter Subscriber",
        contactPerson: "Newsletter Subscriber",
        email,
        source: "newsletter",
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="px-4 sm:px-8 md:px-20 pb-16">
      <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-gray-200 bg-gray-50 p-8 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Stay Ahead
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Get insights delivered to your inbox</h3>
            <p className="text-sm text-gray-600">
              Join our list of professionals who receive our latest insights and updates.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          {status === "success" ? (
            <p className="flex items-center gap-2 text-sm text-orange-600">
              <CheckCircle2 size={16} />
              You're subscribed!
            </p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-64 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex items-center gap-1 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                  {status !== "submitting" && <ArrowRight size={14} />}
                </button>
              </form>
              {status === "error" && errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
              <p className="text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
