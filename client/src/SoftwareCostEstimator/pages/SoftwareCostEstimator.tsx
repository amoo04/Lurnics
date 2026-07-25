import { useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckboxGrid from "../../GrowthBlueprint/components/CheckboxGrid";
import { submitSoftwareCostEstimator } from "../hooks/useSoftwareCostEstimator";
import { ApiError } from "../../lib/api";

const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "Mobile App",
  "Internal Business Tool",
  "E-commerce Platform",
  "Automation / Integration",
  "Other",
];

const PLATFORMS = ["Web", "iOS", "Android"];

const FEATURES = [
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

const BUDGET_RANGES = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+"];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

export default function SoftwareCostEstimator() {
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [needsDesign, setNeedsDesign] = useState(false);
  const [timeline, setTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitSoftwareCostEstimator({
        contactName,
        email,
        companyName: companyName || undefined,
        projectType,
        platforms,
        features,
        needsDesign,
        timeline,
        budgetRange: budgetRange || undefined,
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
      <section className="px-4 py-12 sm:px-8 md:px-20 md:py-16">
        {status !== "success" && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Software Cost Estimator
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              What would your project actually cost?
            </h1>
            <p className="mt-4 text-gray-600">
              Tell us what you're building and we'll send you a real, detailed cost estimate —
              not a generic guess.
            </p>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <CheckCircle2 size={40} className="text-orange-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Got it — estimate on its way.</h2>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                We've received your project details. Our team is putting together a detailed cost
                estimate and will send it to <span className="font-medium text-gray-900">{email}</span>{" "}
                within 1–2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Your Name</label>
                  <input required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Work Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">Company (Optional)</label>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company" className={inputClass} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-600">What are you building?</label>
                <div className="relative">
                  <select required value={projectType} onChange={(e) => setProjectType(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
                    <option value="" disabled hidden>Select a project type</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Platform(s)</p>
                <CheckboxGrid options={PLATFORMS} selected={platforms} onToggle={(v) => toggle(platforms, setPlatforms, v)} columns={3} />
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Features you need</p>
                <CheckboxGrid options={FEATURES} selected={features} onToggle={(v) => toggle(features, setFeatures, v)} />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-600">
                <input type="checkbox" checked={needsDesign} onChange={(e) => setNeedsDesign(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                I also need new branding/UI design, not just development
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-600">Timeline</label>
                  <div className="relative">
                    <select required value={timeline} onChange={(e) => setTimeline(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
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
                    <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
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
                disabled={status === "submitting" || platforms.length === 0 || features.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-40"
              >
                {status === "submitting" ? "Submitting…" : "Get My Cost Estimate"}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
