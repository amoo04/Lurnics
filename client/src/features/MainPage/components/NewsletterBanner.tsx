import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead } from "../hooks/useContent";
import { ApiError } from "../../../lib/api";

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
      <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-white/10 bg-gradient-to-r from-indigo-900/40 to-purple-900/30 p-8 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Stay Ahead
            </p>
            <h3 className="text-lg font-semibold">Get insights delivered to your inbox</h3>
            <p className="text-sm text-gray-400">
              Join our list of professionals who receive our latest insights and updates.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          {status === "success" ? (
            <p className="flex items-center gap-2 text-sm text-indigo-300">
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
                  className="w-64 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                  {status !== "submitting" && <ArrowRight size={14} />}
                </button>
              </form>
              {status === "error" && errorMessage && (
                <p className="text-xs text-red-400">{errorMessage}</p>
              )}
              <p className="text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
