import { ArrowRight, Code2, Cloud, Shield, BarChart3, Cog, Database, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "./OrbitVisual";

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
    <section className="grid items-center gap-12 px-4 py-12 sm:px-8 md:grid-cols-2 md:px-20 md:py-16">
      <div>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
          Beyond Websites.
          <br />
          We Build Digital
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Infrastructure.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We help businesses engineer scalable systems, automate operations,
          and accelerate growth through software engineering, digital
          transformation, and intelligent business solutions.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/contact"
            className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-center text-sm font-medium text-white"
          >
            Book Strategy Session
          </Link>
          <Link
            to="/case-studies"
            className="flex items-center justify-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-medium text-white"
          >
            View Case Studies
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="-ml-6">
        <OrbitVisual centerIcon={Wrench} nodes={nodes} />
      </div>
    </section>
  );
}
