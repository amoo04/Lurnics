import { useState, type FormEvent } from "react";
import { Send, Lock, CheckCircle2, ChevronDown } from "lucide-react";
import { submitLead, useSolutions } from "../hooks/useContent";
import { ApiError } from "../../../lib/api";

const BUDGET_RANGES = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+"];

export default function ContactForm() {
  const { data: solutions } = useSolutions();
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [service, setService] = useState("");
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
        service: service || undefined,
        source: "website",
      });
      setStatus("success");
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setBudgetRange("");
      setService("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <CheckCircle2 size={32} className="text-orange-500" />
        <p className="mt-3 font-semibold text-gray-900">Thanks for reaching out!</p>
        <p className="mt-1 text-sm text-gray-600">We've received your message and will get back to you shortly.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-orange-500">
        Send Us a Message
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Company Name</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Budget Range</label>
            <div className="relative">
              <select
                required
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-9 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none"
              >
                <option value="" disabled hidden>
                  Select a range
                </option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Service Interested In (Optional)</label>
          <div className="relative">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-9 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none"
            >
              <option value="">
                Not sure yet
              </option>
              {solutions?.items.map((solution) => (
                <option key={solution.id} value={solution.name}>
                  {solution.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {status === "error" && errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
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
