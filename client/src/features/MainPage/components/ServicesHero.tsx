import { Cloud, Database, BarChart3, Brain, Lock, Cog, Code2, Layers } from "lucide-react";
import OrbitVisual from "./OrbitVisual";

const nodes = [
  { icon: Cloud, title: "Cloud Infrastructure", subtitle: "Scalable • Secure" },
  { icon: Database, title: "Databases", subtitle: "Reliable • Scalable" },
  { icon: BarChart3, title: "Analytics", subtitle: "Real-time Insights" },
  { icon: Brain, title: "AI Integration", subtitle: "Intelligent • Automated" },
  { icon: Lock, title: "Secure Backend", subtitle: "APIs • Auth" },
  { icon: Cog, title: "DevOps & Automation", subtitle: "Deploys • Monitoring" },
];

export default function ServicesHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Services
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
          Digital infrastructure that powers real business growth.
        </h1>
        <p className="mt-6 max-w-md text-gray-600">
          Scalable systems that automate operations and unlock growth.
        </p>
      </div>

      <div className="mx-auto">
        <OrbitVisual centerIcon={Layers} nodes={nodes} size={380} />
      </div>
    </section>
  );
}
