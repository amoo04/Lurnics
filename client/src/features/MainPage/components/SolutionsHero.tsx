import { Cloud, Database, BarChart3, Brain, Lock, CreditCard, Cog, Code2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "./OrbitVisual";

const nodes = [
  { icon: Cloud, title: "Cloud Infrastructure", subtitle: "Scalable • Secure" },
  { icon: Database, title: "Databases", subtitle: "PostgreSQL • D1" },
  { icon: BarChart3, title: "Analytics", subtitle: "Real-time Insights" },
  { icon: Brain, title: "AI Integration", subtitle: "Intelligent • Automated" },
  { icon: Lock, title: "Secure Backend", subtitle: "APIs • Auth" },
  { icon: CreditCard, title: "Payments", subtitle: "Stripe • Paystack" },
  { icon: Cog, title: "DevOps & Automation", subtitle: "CI/CD • Monitoring" },
  { icon: Code2, title: "Web Applications", subtitle: "Fast • Modern" },
];

export default function SolutionsHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Solutions
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Intelligent solutions.
          <br />
          Built for real business.
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We build end-to-end digital solutions that solve complex business
          challenges, automate operations, and deliver measurable results.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
          >
            Book a Strategy Session
            <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="flex items-center gap-2 text-sm text-gray-300">
            Talk to our experts
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>

      <div className="md:-ml-6">
        <OrbitVisual centerIcon={Sparkles} nodes={nodes} size={480} />
      </div>
    </section>
  );
}
