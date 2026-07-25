import { Cloud, Database, BarChart3, Brain, Lock, Code2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "../../components/shared/OrbitVisual";

const nodes = [
  { icon: Cloud, title: "Cloud Infrastructure", subtitle: "Scalable • Secure" },
  { icon: Database, title: "Databases", subtitle: "Reliable • Scalable" },
  { icon: BarChart3, title: "Analytics", subtitle: "Real-time Insights" },
  { icon: Brain, title: "AI Integration", subtitle: "Intelligent • Automated" },
  { icon: Lock, title: "Secure Backend", subtitle: "APIs • Auth" },
  { icon: Code2, title: "Web Applications", subtitle: "Fast • Modern" },
];

export default function SolutionsHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Solutions
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
          Intelligent solutions.
          <br />
          Built for real business.
        </h1>
        <p className="mt-6 max-w-md text-gray-600">
          End-to-end digital solutions built to solve real business problems.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Book a Strategy Session
            <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="flex items-center gap-2 text-sm text-gray-600">
            Talk to our experts
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto">
        <OrbitVisual centerIcon={Sparkles} nodes={nodes} size={380} />
      </div>
    </section>
  );
}
