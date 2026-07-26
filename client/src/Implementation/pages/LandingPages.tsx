import { useState, type FormEvent } from "react";
import { CheckCircle2, Send, Lock, Check } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { submitLead } from "../../Contact/hooks/useLeads";
import { ApiError } from "../../lib/api";

interface Plan {
  id: string;
  label: string;
  durationLabel: string;
  priceNgn: number;
  highlight?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "3-month",
    label: "3-Month Plan",
    durationLabel: "Your page stays live for 3 months",
    priceNgn: 28_000,
    features: [
      "1 custom-designed landing page",
      "Mobile-optimized & fast-loading",
      "Lead capture form built in",
      "Basic analytics & tracking",
    ],
  },
  {
    id: "6-month",
    label: "6-Month Plan",
    durationLabel: "Your page stays live for 6 months",
    priceNgn: 50_000,
    highlight: true,
    features: [
      "Everything in the 3-Month plan, plus:",
      "Email support",
      "2 rounds of design revisions",
      "A/B-ready headline & copy variants",
      "Up to 2 content updates",
      "Priority email support",
    ],
  },
  {
    id: "12-month",
    label: "12-Month Plan",
    durationLabel: "Your page stays live for 12 months",
    priceNgn: 75_000,
    features: [
      "Everything in the 6-Month plan, plus:",
      "Unlimited minor content updates",
      "Quarterly performance check-in",
      "48-hour priority turnaround",
      "Dedicated point of contact",
    ],
  },
];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

export default function LandingPages() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]);
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
        budgetRange: `Landing Page, ${selectedPlan.label} (₦${selectedPlan.priceNgn.toLocaleString()}, one-time)`,
        service: "Landing Pages",
        source: "landing-pages-page",
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

      <section className="px-4 py-12 sm:px-8 md:px-20 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Landing Pages
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Just need a landing page? Here's a plan built for that.
          </h1>
          <p className="mt-4 text-gray-600">
            A focused, high-converting landing page for a single offer, pay
            once, no recurring charges, no big custom-software engagement.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const selected = plan.id === selectedPlan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`relative rounded-xl border p-6 text-left transition ${
                  selected
                    ? "border-orange-500 bg-orange-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-900">
                  {plan.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  ₦{plan.priceNgn.toLocaleString()}
                  <span className="text-sm font-medium text-gray-500">
                    {" "}
                    one-time
                  </span>
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  {plan.durationLabel}
                </p>

                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-gray-600"
                    >
                      <Check
                        size={13}
                        className="mt-0.5 shrink-0 text-orange-500"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-5 flex items-center gap-1.5 text-xs font-medium ${
                    selected ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selected && <Check size={11} />}
                  </span>
                  {selected ? "Selected" : "Select plan"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl items-start gap-10 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">
              What's included, {selectedPlan.label}
            </p>
            <ul className="mt-4 space-y-3">
              {selectedPlan.features.map((item) => (
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

          <div>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <CheckCircle2 size={40} className="text-orange-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Request received.
                </h2>
                <p className="mt-2 max-w-sm text-sm text-gray-600">
                  Thanks, our team will confirm your{" "}
                  {selectedPlan.label.toLowerCase()} and get back to you at{" "}
                  <span className="font-medium text-gray-900">{email}</span>{" "}
                  within 1–2 business days.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Get started, {selectedPlan.label} (₦
                  {selectedPlan.priceNgn.toLocaleString()}, one-time)
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
                        className={inputClass}
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
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-gray-600">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your business"
                      className={inputClass}
                    />
                  </div>

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
                      className={inputClass}
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                  >
                    {status === "submitting"
                      ? "Submitting…"
                      : `Get Started, ${selectedPlan.label}`}
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
        </div>
      </section>

      <Footer />
    </>
  );
}
