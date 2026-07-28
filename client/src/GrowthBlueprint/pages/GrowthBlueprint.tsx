import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckboxGrid from "../components/CheckboxGrid";
import { submitGrowthBlueprint } from "../hooks/useGrowthBlueprint";
import { ApiError } from "../../lib/api";
import type { BusinessModel, GrowthBlueprintInput } from "../api/growth-blueprint.types";

const GOALS = [
  "Increase Sales",
  "Generate Leads",
  "Launch Product",
  "Get Bookings",
  "Grow Brand",
  "Reduce Costs",
  "Improve Customer Retention",
];

const CHANNELS = ["Google", "Meta", "TikTok", "LinkedIn", "Email", "SEO"];

const CHALLENGES = [
  "Lead generation",
  "Low conversion",
  "No automation",
  "Poor website",
  "Poor SEO",
  "High acquisition cost",
  "No reporting",
  "Manual operations",
];

const BUSINESS_MODELS: BusinessModel[] = ["B2B", "B2C", "Marketplace", "Subscription", "Other"];

const STEP_LABELS = ["Business Profile", "Goals", "Marketing", "Challenges"];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

interface FormState {
  companyName: string;
  contactName: string;
  email: string;
  website: string;
  industry: string;
  country: string;
  employees: string;
  revenueRange: string;
  yearsInBusiness: string;
  businessModel: BusinessModel;
  goals: string[];
  currentChannels: string[];
  monthlyBudget: string;
  hasWebsite: boolean;
  hasLandingPages: boolean;
  hasCrm: boolean;
  hasEmailAutomation: boolean;
  hasAnalytics: boolean;
  challenges: string[];
}

const initialState: FormState = {
  companyName: "",
  contactName: "",
  email: "",
  website: "",
  industry: "",
  country: "",
  employees: "",
  revenueRange: "",
  yearsInBusiness: "",
  businessModel: "B2C",
  goals: [],
  currentChannels: [],
  monthlyBudget: "",
  hasWebsite: false,
  hasLandingPages: false,
  hasCrm: false,
  hasEmailAutomation: false,
  hasAnalytics: false,
  challenges: [],
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function GrowthBlueprint() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canAdvance =
    step === 0
      ? form.companyName && form.contactName && form.email && form.industry && form.country && form.employees
      : step === 1
        ? form.goals.length > 0
        : step === 2
          ? true
          : form.challenges.length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.challenges.length === 0) return;

    setStatus("submitting");
    setErrorMessage(null);

    const input: GrowthBlueprintInput = {
      companyName: form.companyName,
      contactName: form.contactName,
      email: form.email,
      website: form.website || undefined,
      industry: form.industry,
      country: form.country,
      employees: form.employees,
      revenueRange: form.revenueRange || undefined,
      yearsInBusiness: form.yearsInBusiness || undefined,
      businessModel: form.businessModel,
      goals: form.goals,
      currentChannels: form.currentChannels,
      monthlyBudget: form.monthlyBudget || undefined,
      hasWebsite: form.hasWebsite,
      hasLandingPages: form.hasLandingPages,
      hasCrm: form.hasCrm,
      hasEmailAutomation: form.hasEmailAutomation,
      hasAnalytics: form.hasAnalytics,
      challenges: form.challenges,
    };

    try {
      await submitGrowthBlueprint(input);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <section className="px-4 py-12 sm:px-8 md:px-20 md:py-16">
        {status !== "success" && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Growth Blueprint
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Get your free growth blueprint.
            </h1>
            <p className="mt-4 text-gray-600">
              Answer a few questions about your business and our team will put together a
              personalized growth plan, channels, messaging, and what to build first.
            </p>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <CheckCircle2 size={40} className="text-orange-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Thanks, your blueprint is on its way.
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                We've received your answers and our team is putting together your growth
                blueprint. We'll reach out at <span className="font-medium text-gray-900">{form.email}</span>{" "}
                within 1–2 business days.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-center gap-2">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= step ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-orange-500">
                Step {step + 1} of {STEP_LABELS.length}, {STEP_LABELS[step]}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Your Name</label>
                        <input
                          required
                          value={form.contactName}
                          onChange={(e) => update("contactName", e.target.value)}
                          placeholder="Your name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Work Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@company.com"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Business Name</label>
                        <input
                          required
                          value={form.companyName}
                          onChange={(e) => update("companyName", e.target.value)}
                          placeholder="Your business"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Website (Optional)</label>
                        <input
                          value={form.website}
                          onChange={(e) => update("website", e.target.value)}
                          placeholder="https://"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Industry</label>
                        <input
                          required
                          value={form.industry}
                          onChange={(e) => update("industry", e.target.value)}
                          placeholder="e.g. E-commerce, Health & Wellness"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Country</label>
                        <input
                          required
                          value={form.country}
                          onChange={(e) => update("country", e.target.value)}
                          placeholder="Where is your business based?"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Employees</label>
                        <input
                          required
                          value={form.employees}
                          onChange={(e) => update("employees", e.target.value)}
                          placeholder="e.g. 1-10"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Revenue Range (Optional)</label>
                        <input
                          value={form.revenueRange}
                          onChange={(e) => update("revenueRange", e.target.value)}
                          placeholder="e.g. ₦14M-₦70M/mo"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Years in Business (Optional)</label>
                        <input
                          value={form.yearsInBusiness}
                          onChange={(e) => update("yearsInBusiness", e.target.value)}
                          placeholder="e.g. 2 years"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-gray-600">Business Model</label>
                        <div className="relative">
                          <select
                            value={form.businessModel}
                            onChange={(e) => update("businessModel", e.target.value as BusinessModel)}
                            className={`${inputClass} appearance-none pr-9`}
                          >
                            {BUSINESS_MODELS.map((model) => (
                              <option key={model} value={model}>
                                {model}
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
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <p className="mb-4 text-sm text-gray-600">What are you trying to achieve? Select all that apply.</p>
                    <CheckboxGrid options={GOALS} selected={form.goals} onToggle={(v) => update("goals", toggle(form.goals, v))} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm text-gray-600">Which channels are you currently using?</p>
                      <CheckboxGrid
                        options={CHANNELS}
                        selected={form.currentChannels}
                        onToggle={(v) => update("currentChannels", toggle(form.currentChannels, v))}
                        columns={3}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm text-gray-600">Monthly Marketing Budget (Optional)</label>
                      <input
                        value={form.monthlyBudget}
                        onChange={(e) => update("monthlyBudget", e.target.value)}
                        placeholder="e.g. Under ₦700,000, ₦700,000-₦2,800,000"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <p className="mb-3 text-sm text-gray-600">What do you already have in place?</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(
                          [
                            ["hasWebsite", "Website"],
                            ["hasLandingPages", "Landing Pages"],
                            ["hasCrm", "CRM"],
                            ["hasEmailAutomation", "Email Automation"],
                            ["hasAnalytics", "Analytics"],
                          ] as const
                        ).map(([key, label]) => (
                          <label
                            key={key}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm transition ${
                              form[key]
                                ? "border-orange-500 bg-orange-50 text-gray-900"
                                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={form[key]}
                              onChange={() => update(key, !form[key])}
                              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="mb-4 text-sm text-gray-600">What's stopping growth right now? Select all that apply.</p>
                    <CheckboxGrid
                      options={CHALLENGES}
                      selected={form.challenges}
                      onToggle={(v) => update("challenges", toggle(form.challenges, v))}
                    />
                  </div>
                )}

                {status === "error" && errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                <div className="flex items-center justify-between pt-2">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < STEP_LABELS.length - 1 ? (
                    <button
                      type="button"
                      disabled={!canAdvance}
                      onClick={() => setStep((s) => s + 1)}
                      className="flex items-center gap-1.5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-40"
                    >
                      Continue
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!canAdvance || status === "submitting"}
                      className="flex items-center gap-1.5 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-40"
                    >
                      {status === "submitting" ? "Submitting…" : "Get My Growth Blueprint"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
