import { Cloud, Database, BarChart3, Brain, Lock, Cog, Layers, Sparkles } from "lucide-react";
import OrbitVisual from "../../components/shared/OrbitVisual";
import HeroBackground from "../../components/shared/HeroBackground";

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
    <section className="relative overflow-hidden">
      <HeroBackground />
      <div className="relative grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
            <Sparkles size={13} />
            Services
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
            Software engineered to automate operations, improve efficiency, and support long-term growth.
          </h1>
          <p className="mt-6 max-w-md text-gray-600">
            Custom-built software designed around your business, not generic templates.
          </p>
        </div>

        <div className="mx-auto">
          <OrbitVisual centerIcon={Layers} nodes={nodes} size={380} />
        </div>
      </div>
    </section>
  );
}
