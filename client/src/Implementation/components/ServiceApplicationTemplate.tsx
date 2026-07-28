import { useState, type FormEvent } from "react";
import { CheckCircle2, Send, Lock, ChevronDown } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { submitLead } from "../../Contact/hooks/useLeads";
import { ApiError } from "../../lib/api";

const BUDGET_RANGES = [
  "Under ₦1,400,000",
  "₦1,400,000 – ₦7,000,000",
  "₦7,000,000 – ₦21,000,000",
  "₦21,000,000+",
];

interface ServiceApplicationTemplateProps {
  eyebrow: string;
  headline: string;
  subtext: string;
  whatsIncluded: string[];
  serviceLabel: string;
  sourceSlug: string;
}

export default function ServiceApplicationTemplate({
  eyebrow,
  headline,
  subtext,
  whatsIncluded,
  serviceLabel,
  sourceSlug,
}: ServiceApplicationTemplateProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
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
        phone,
        budgetRange,
        service: serviceLabel,
        source: sourceSlug,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <>
      <Navbar />
      <section className="grid items-start gap-12 px-4 py-12 sm:px-8 md:grid-cols-2 md:px-20 md:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-md text-gray-600">{subtext}</p>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">
              What's included
            </p>
            <ul className="mt-4 space-y-3">
              {whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-gray-600"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <CheckCircle2 size={40} className="text-orange-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Application received.
              </h2>
              <p className="mt-2 max-w-sm text-sm text-gray-600">
                Thanks, our team will review your details and get back to you
                at <span className="font-medium text-gray-900">{email}</span>{" "}
                within 1–2 business days.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-orange-500">
                Apply for {serviceLabel}
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-600">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company"
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-600">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-600">
                      Budget Range
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-9 text-sm text-gray-900 outline-none focus:border-gray-900"
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

                {status === "error" && errorMessage && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting…" : "Apply Now"}
                  {status !== "submitting" && <Send size={16} />}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Lock size={12} />
                  Your information is secure and will never be shared.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
