import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface Plan {
  name: string;
  audience: string;
  monthlyNgn: number;
  features: string[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    audience: "Solopreneurs & small businesses",
    monthlyNgn: 40_600,
    features: [
      "1 store / landing page",
      "Free yourbusiness.lurnics.com subdomain",
      "Drag-and-drop builder",
      "Lead capture inbox (CRM)",
      "Growth Blueprint tool access",
    ],
  },
  {
    name: "Growth",
    audience: "Growing businesses",
    monthlyNgn: 110_600,
    highlight: true,
    features: [
      "Everything in Starter, plus:",
      "Up to 5 pages/products",
      "1 custom domain",
      "Up to 3 team members (owner/admin/manager)",
      "Priority email support",
    ],
  },
  {
    name: "Scale",
    audience: "Agencies & multi-brand teams",
    monthlyNgn: 278_600,
    features: [
      "Everything in Growth, plus:",
      "Unlimited pages",
      "Up to 5 custom domains",
      "Unlimited team members & roles",
      "Dedicated account manager",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <Navbar />

      <section className="px-4 py-12 sm:px-8 md:px-20 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">Pricing</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Build and run your store on Lurnics.
          </h1>
          <p className="mt-4 text-gray-600">
            Pick a plan that fits where your business is today. Upgrade any time as you grow.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-7 ${
                plan.highlight ? "border-orange-500 bg-white shadow-md" : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Recommended
                </span>
              )}

              <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
              <p className="mt-1 text-xs text-gray-500">{plan.audience}</p>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                ₦{plan.monthlyNgn.toLocaleString()}
                <span className="text-sm font-medium text-gray-500">/mo</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-7 block rounded-md px-5 py-2.5 text-center text-sm font-medium transition ${
                  plan.highlight
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                Create Your Store
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">Just need a single landing page?</p>
          <p className="mt-1.5 text-sm text-gray-600">
            Skip the store builder, get one professionally built landing page for a one-time fee,
            starting at ₦28,000.
          </p>
          <Link
            to="/landing-pages"
            className="mt-4 inline-block rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            See the Landing Page plan →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
