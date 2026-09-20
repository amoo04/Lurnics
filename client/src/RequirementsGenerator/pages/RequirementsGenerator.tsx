import { useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, Printer } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroBackground from "../../components/shared/HeroBackground";
import CheckboxGrid from "../../GrowthBlueprint/components/CheckboxGrid";
import { submitRequirementsGenerator } from "../hooks/useRequirementsGenerator";
import { ApiError } from "../../lib/api";
import type { RequirementsGeneratorInput } from "../api/requirements-generator.types";

const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "Mobile App",
  "Internal Business Tool",
  "E-commerce Platform",
  "Automation / Integration",
  "Other",
];

const FEATURE_OPTIONS = [
  "User Accounts & Login",
  "Payments",
  "Admin Dashboard",
  "Third-Party Integrations",
  "Real-Time Features (Chat/Notifications)",
  "Search & Filtering",
  "Reporting & Analytics",
  "Multi-Language Support",
];

const TIMELINES = ["ASAP / Rush", "1–3 months", "3–6 months", "Flexible"];

const BUDGET_RANGES = [
  "Under ₦1,400,000",
  "₦1,400,000 – ₦7,000,000",
  "₦7,000,000 – ₦21,000,000",
  "₦21,000,000+",
];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

export default function RequirementsGenerator() {
  const [form, setForm] = useState<RequirementsGeneratorInput>({
    companyName: "",
    contactName: "",
    email: "",
    projectType: "",
    goal: "",
    mustHaveFeatures: [],
    niceToHaveFeatures: [],
    targetUsers: "",
    timeline: "",
    budgetRange: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function update<K extends keyof RequirementsGeneratorInput>(key: K, value: RequirementsGeneratorInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggle(list: string[] | undefined, key: "mustHaveFeatures" | "niceToHaveFeatures", value: string) {
    const current = list ?? [];
    update(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitRequirementsGenerator({
        ...form,
        companyName: form.companyName || undefined,
        niceToHaveFeatures: form.niceToHaveFeatures?.length ? form.niceToHaveFeatures : undefined,
        targetUsers: form.targetUsers || undefined,
        budgetRange: form.budgetRange || undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden px-4 py-12 sm:px-8 md:px-20 md:py-16">
        <HeroBackground />
        <div className="relative">
        {status !== "success" && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
              Requirements Generator
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Turn your idea into a real requirements brief.
            </h1>
            <p className="mt-4 text-gray-600">
              Answer a few questions and we'll assemble a structured brief you can share with
              anyone, us or another team, to get accurate quotes.
            </p>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {status === "success" ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 print:border-0 print:shadow-none">
              <div className="mb-6 flex items-center gap-2 text-green-600 print:hidden">
                <CheckCircle2 size={20} />
                <p className="text-sm font-medium">
                  Sent to our team, we'll follow up at {form.email} within 1–2 business days.
                </p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">Requirements Brief</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {form.companyName || form.contactName}
                {form.companyName ? `, ${form.projectType}` : ` (${form.projectType})`}
              </h2>

              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Goal</p>
                  <p className="mt-1 text-gray-600">{form.goal}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Must-Have Features</p>
                  <ul className="mt-1 list-inside list-disc text-gray-600">
                    {form.mustHaveFeatures.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>

                {form.niceToHaveFeatures && form.niceToHaveFeatures.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900">Nice-to-Have Features</p>
                    <ul className="mt-1 list-inside list-disc text-gray-600">
                      {form.niceToHaveFeatures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {form.targetUsers && (
                  <div>
                    <p className="font-semibold text-gray-900">Target Users</p>
                    <p className="mt-1 text-gray-600">{form.targetUsers}</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-gray-900">Timeline</p>
                    <p className="mt-1 text-gray-600">{form.timeline}</p>
                  </div>
                  {form.budgetRange && (
                    <div>
                      <p className="font-semibold text-gray-900">Budget Range</p>
                      <p className="mt-1 text-gray-600">{form.budgetRange}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-8 flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 print:hidden"
              >
                <Printer size={14} />
                Print / Save as PDF
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Your Name</label>
                  <input required value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Work Email</label>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">Company / Project Name (Optional)</label>
                <input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Your company or project" className={inputClass} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">What are you building?</label>
                <div className="relative">
                  <select required value={form.projectType} onChange={(e) => update("projectType", e.target.value)} className={`${inputClass} appearance-none pr-9`}>
                    <option value="" disabled hidden>Select a project type</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">What problem are you trying to solve?</label>
                <textarea
                  required
                  rows={3}
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  placeholder="Describe the goal in a few sentences"
                  className={inputClass}
                />
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Must-have features</p>
                <CheckboxGrid options={FEATURE_OPTIONS} selected={form.mustHaveFeatures} onToggle={(v) => toggle(form.mustHaveFeatures, "mustHaveFeatures", v)} />
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Nice-to-have features (Optional)</p>
                <CheckboxGrid options={FEATURE_OPTIONS} selected={form.niceToHaveFeatures ?? []} onToggle={(v) => toggle(form.niceToHaveFeatures, "niceToHaveFeatures", v)} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">Who will use this? (Optional)</label>
                <textarea
                  rows={2}
                  value={form.targetUsers}
                  onChange={(e) => update("targetUsers", e.target.value)}
                  placeholder="e.g. Internal staff, customers, both"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Timeline</label>
                  <div className="relative">
                    <select required value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={`${inputClass} appearance-none pr-9`}>
                      <option value="" disabled hidden>Select a timeline</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Budget Range (Optional)</label>
                  <div className="relative">
                    <select value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} className={`${inputClass} appearance-none pr-9`}>
                      <option value="">Not sure yet</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {status === "error" && errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

              <button
                type="submit"
                disabled={status === "submitting" || form.mustHaveFeatures.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-40"
              >
                {status === "submitting" ? "Generating…" : "Generate My Requirements Brief"}
              </button>
            </form>
          )}
        </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
