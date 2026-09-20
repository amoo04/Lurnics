import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroBackground from "../../components/shared/HeroBackground";
import { submitCalculatorResult } from "../hooks/useCalculator";
import { ApiError } from "../../lib/api";
import type { CalculatorMode, Currency } from "../api/calculator.types";

const MODES: { value: CalculatorMode; label: string }[] = [
  { value: "products", label: "I sell products" },
  { value: "bookings", label: "I take bookings" },
  { value: "services", label: "I run projects/clients" },
];

const MODE_COPY: Record<CalculatorMode, { hours: string; inquiries: string; cold: string; order: string }> = {
  products: {
    hours: "Hours/week on manual admin, invoicing, chasing payments, follow-ups",
    inquiries: "New inquiries per week",
    cold: "% that go cold before you respond",
    order: "Average order value",
  },
  bookings: {
    hours: "Hours/week on manual admin, scheduling, reminders, chasing no-shows",
    inquiries: "New booking requests per week",
    cold: "% that never get booked in time",
    order: "Average booking value",
  },
  services: {
    hours: "Hours/week on manual admin, proposals, invoicing, client follow-ups",
    inquiries: "New inquiries per week",
    cold: "% that go cold before you respond",
    order: "Average project/client value",
  },
};

const CURRENCY_DEFAULTS = {
  NGN: { orderValue: 15000, hourlyValue: 3000 },
} as const;

const WEEKS_PER_MONTH = 4.33;
const COLD_LEAD_CLOSE_RATE = 0.25;

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function LeakCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("products");
  const currency: Currency = "NGN";
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [inquiriesPerWeek, setInquiriesPerWeek] = useState(20);
  const [coldPercent, setColdPercent] = useState(30);
  const [orderValue, setOrderValue] = useState<number>(CURRENCY_DEFAULTS.NGN.orderValue);
  const [hourlyValue, setHourlyValue] = useState<number>(CURRENCY_DEFAULTS.NGN.hourlyValue);
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copy = MODE_COPY[mode];

  const { monthlyHours, monthlyTimeCost, coldPerMonth, monthlyRevenueLost, total } = useMemo(() => {
    const monthlyHoursCalc = hoursPerWeek * WEEKS_PER_MONTH;
    const timeCost = monthlyHoursCalc * hourlyValue;
    const inquiriesPerMonth = inquiriesPerWeek * WEEKS_PER_MONTH;
    const coldPerMonthCalc = inquiriesPerMonth * (coldPercent / 100);
    const revenueLost = coldPerMonthCalc * COLD_LEAD_CLOSE_RATE * orderValue;
    return {
      monthlyHours: monthlyHoursCalc,
      monthlyTimeCost: timeCost,
      coldPerMonth: coldPerMonthCalc,
      monthlyRevenueLost: revenueLost,
      total: timeCost + revenueLost,
    };
  }, [hoursPerWeek, hourlyValue, inquiriesPerWeek, coldPercent, orderValue]);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitCalculatorResult({
        email,
        mode,
        currency,
        hoursPerWeek,
        inquiriesPerWeek,
        coldPercent,
        orderValue,
        hourlyValue,
      });
      setUnlocked(true);
      setStatus("idle");
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
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
            Quick Diagnostic
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            What's manual work <span className="text-orange-500">actually</span> costing you?
          </h1>
          <p className="mt-4 text-gray-600">
            Six numbers. One honest estimate of what manual follow-ups, invoicing, and slow
            replies are quietly costing your business every month.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {MODES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-md border px-3.5 py-2 text-sm font-medium transition ${
                  mode === value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm text-gray-600">
                <span>{copy.hours}</span>
                <span className="font-mono font-semibold text-orange-500">{hoursPerWeek} hrs</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm text-gray-600">
                <span>{copy.inquiries}</span>
                <span className="font-mono font-semibold text-orange-500">{inquiriesPerWeek}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={inquiriesPerWeek}
                onChange={(e) => setInquiriesPerWeek(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm text-gray-600">
                <span>{copy.cold}</span>
                <span className="font-mono font-semibold text-orange-500">{coldPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={coldPercent}
                onChange={(e) => setColdPercent(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-gray-600">{copy.order}</label>
                <input
                  type="number"
                  min={0}
                  value={orderValue}
                  onChange={(e) => setOrderValue(Number(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gray-600">What's an hour of your time worth</label>
                <input
                  type="number"
                  min={0}
                  value={hourlyValue}
                  onChange={(e) => setHourlyValue(Number(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Estimated monthly cost
            </p>
            <p className="mt-2 text-4xl font-bold text-orange-500 sm:text-5xl">
              {formatCurrency(total, currency)}
              <span className="text-lg text-gray-400">/mo</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">Based on the numbers above</p>

            <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${unlocked ? "" : "pointer-events-none blur-sm select-none"}`}>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Time lost to admin</p>
                <p className="mt-1 font-mono text-base text-gray-900">{formatCurrency(monthlyTimeCost, currency)}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Revenue lost to cold leads</p>
                <p className="mt-1 font-mono text-base text-gray-900">
                  {formatCurrency(monthlyRevenueLost, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Hours lost / month</p>
                <p className="mt-1 font-mono text-base text-gray-900">{Math.round(monthlyHours)} hrs</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Leads lost / month</p>
                <p className="mt-1 font-mono text-base text-gray-900">{Math.round(coldPerMonth)}</p>
              </div>
            </div>

            {!unlocked ? (
              <form onSubmit={handleUnlock} className="mt-6 border-t border-dashed border-gray-300 pt-6">
                <p className="mb-3 text-sm text-gray-600">
                  Enter your email to unlock the full breakdown and see what fixing this could look
                  like for your business.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {status === "submitting" ? "Unlocking…" : "Show me"}
                  </button>
                </div>
                {status === "error" && errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
                <p className="mt-3 text-xs text-gray-400">
                  Revenue-loss estimate assumes only 25% of cold leads would have converted, a
                  deliberately conservative number, not a worst case.
                </p>
              </form>
            ) : (
              <p className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-6 text-sm text-green-600">
                <CheckCircle2 size={16} />
                Unlocked. This is roughly where a lightweight system pays for itself in the first
                month or two.
              </p>
            )}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Lock size={12} />
            Your information is secure and will never be shared.
          </p>
        </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
