import {
  ArrowRight,
  Code2,
  Cloud,
  Shield,
  BarChart3,
  Cog,
  Database,
  Wrench,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "../../components/shared/OrbitVisual";
import HeroBackground from "../../components/shared/HeroBackground";

const nodes = [
  { icon: Cloud, title: "Cloud Infra", subtitle: "Reliable • Secure" },
  { icon: Database, title: "Databases", subtitle: "Scalable Storage" },
  { icon: BarChart3, title: "Analytics", subtitle: "Real-time Insights" },
  { icon: Shield, title: "Secure Backend", subtitle: "APIs • Auth • Data" },
  { icon: Cog, title: "Automation", subtitle: "Workflows • Ops" },
  { icon: Code2, title: "Web Apps", subtitle: "Fast • Scalable" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroBackground />

      <div className="relative grid items-center gap-12 px-4 py-12 sm:px-8 md:grid-cols-2 md:px-20 md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
            <Sparkles size={13} />
            Custom Software & Automation Studio
          </div>

          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
            Beyond Websites.
            <br />
            We Build Digital
            <br />
            <span className="text-orange-500">Infrastructure.</span>
          </h1>
          <p className="mt-6 max-w-md text-gray-600">
            We design, build, and deploy software systems that automate
            operations, streamline workflows, and help businesses scale.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/contact"
              className="rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-medium text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
            >
              Book Strategy Session
            </Link>
            <Link
              to="/case-studies"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:-translate-y-0.5 hover:bg-gray-50"
            >
              View Success Stories
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-orange-500" />
            Free strategy session, no obligation.
          </div>
        </div>

        <div className="-ml-6">
          <OrbitVisual centerIcon={Wrench} nodes={nodes} />
        </div>
      </div>
    </section>
  );
}
