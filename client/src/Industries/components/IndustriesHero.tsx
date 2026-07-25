import { Box, Code2, Globe, ArrowRight, ShoppingCart, HeartPulse, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "../../components/shared/OrbitVisual";

const stats = [
  { icon: Box, value: "3", label: "Platforms Shipped", description: "Live systems handling real customers and revenue" },
  { icon: Globe, value: "3", label: "Industries", description: "E-commerce, mental health, and luxury retail" },
  { icon: Code2, value: "Engineering-Led", label: "Built the Right Way", description: "Every solution is architected with software engineering best practices" },
];

const nodes = [
  { icon: ShoppingCart, title: "E-Commerce & Retail", subtitle: "Custom storefronts" },
  { icon: HeartPulse, title: "Health & Wellness", subtitle: "Booking • Secure data" },
  { icon: Gem, title: "Luxury & Brand-Led", subtitle: "Design-system-driven" },
];

export default function IndustriesHero() {
  return (
    <>
      <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Industries
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
            Software designed for the way your industry works.
          </h1>
          <p className="mt-6 max-w-md text-gray-600">
            Every industry has different workflows. We build software around yours.
          </p>
          <Link
            to="/contact"
            className="mt-8 flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            <span className="border-b border-orange-400 pb-0.5">
              Book a Strategy Session
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-300">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="mx-auto">
          <OrbitVisual centerIcon={Globe} nodes={nodes} size={380} />
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-20 pb-10">
        <div className="grid gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
