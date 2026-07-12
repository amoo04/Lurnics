import { useState, type FormEvent } from "react";
import { Send, Lock, CheckCircle2 } from "lucide-react";
import { submitLead } from "../hooks/useContent";
import { ApiError } from "../../../lib/api";

const BUDGET_RANGES = ["Under $5,000", "$5,000 – $20,000", "$20,000 – $50,000", "$50,000+"];

export default function ContactForm() {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitLead({
        companyName,
        contactPerson,
        email,
        phone: phone || undefined,
        budgetRange,
        source: "website",
      });
      setStatus("success");
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setBudgetRange("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <CheckCircle2 size={32} className="text-indigo-400" />
        <p className="mt-3 font-semibold">Thanks for reaching out!</p>
        <p className="mt-1 text-sm text-gray-400">We've received your message and will get back to you shortly.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-indigo-400"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Send Us a Message
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Company Name</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company"
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Budget Range</label>
            <select
              required
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-4 py-2.5 text-sm text-gray-300 outline-none"
            >
              <option value="" disabled hidden className="bg-[#0b0f1a] text-gray-500">
                Select a range
              </option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range} className="bg-[#0b0f1a] text-gray-200">
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        {status === "error" && errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
          {status !== "submitting" && <Send size={16} />}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <Lock size={12} />
          Your information is secure and will never be shared.
        </p>
      </form>
    </div>
  );
}
