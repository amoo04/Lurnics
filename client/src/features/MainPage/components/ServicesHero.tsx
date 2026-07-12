import { Cloud, Database, BarChart3, Brain, Lock, CreditCard, Cog, Code2, Layers } from "lucide-react";
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

export default function ServicesHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Services
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Digital infrastructure that powers real business growth.
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We design, build, and manage scalable systems that help
          organizations automate operations, improve efficiency, and unlock
          new opportunities.
        </p>
      </div>

      <div className="md:ml-8 lg:ml-16">
        <OrbitVisual centerIcon={Layers} nodes={nodes} size={480} />
      </div>
    </section>
  );
}
