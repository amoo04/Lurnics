import {
  Building2,
  Rocket,
  Users,
  Globe,
  ArrowRight,
  ShoppingCart,
  Landmark,
  GraduationCap,
  Building,
  Factory,
  Megaphone,
  HeartPulse,
} from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "./OrbitVisual";

const stats = [
  { icon: Building2, value: "15+", label: "Industries Served", description: "Across diverse sectors and business sizes" },
  { icon: Rocket, value: "250+", label: "Systems Delivered", description: "Scalable solutions built for real-world impact" },
  { icon: Users, value: "98%", label: "Client Satisfaction", description: "Long-term partnerships built on trust" },
  { icon: Globe, value: "Global", label: "Impact", description: "Serving clients locally and internationally" },
];

const nodes = [
  { icon: ShoppingCart, title: "E-Commerce", subtitle: "Scalable stores" },
  { icon: Landmark, title: "Fintech", subtitle: "Secure • Compliant" },
  { icon: GraduationCap, title: "Education", subtitle: "E-learning platforms" },
  { icon: Building, title: "Hospitality", subtitle: "Booking systems" },
  { icon: Factory, title: "Manufacturing", subtitle: "Streamlined operations" },
  { icon: Users, title: "Non-Profits", subtitle: "Mission-driven tools" },
  { icon: Megaphone, title: "Marketing & Agencies", subtitle: "Tools that scale" },
  { icon: HeartPulse, title: "Healthcare", subtitle: "Digital health solutions" },
];

export default function IndustriesHero() {
  return (
    <>
      <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Industries
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">
            Technology solutions for every industry.
          </h1>
          <p className="mt-6 max-w-md text-gray-400">
            Every industry has unique challenges. We combine deep domain
            understanding with engineering excellence to build solutions
            that drive efficiency, innovation, and growth.
          </p>
          <Link
            to="/contact"
            className="mt-8 flex items-center gap-2 text-sm font-medium text-indigo-300"
          >
            <span className="border-b border-indigo-400 pb-0.5">
              Book a Strategy Session
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-400/50">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="md:-ml-6">
          <OrbitVisual centerIcon={Globe} nodes={nodes} size={480} />
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-20 pb-10">
        <div className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 sm:grid-cols-2 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
