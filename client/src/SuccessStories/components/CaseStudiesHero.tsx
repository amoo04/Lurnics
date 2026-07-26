import { ArrowRight, ShoppingCart, HeartPulse, Gem, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import OrbitVisual from "../../components/shared/OrbitVisual";
import HeroBackground from "../../components/shared/HeroBackground";

const nodes = [
  { icon: ShoppingCart, title: "Sheashine", subtitle: "E-Commerce & Retail" },
  { icon: Gem, title: "Vektar Perfumes", subtitle: "Luxury & Brand-Led" },
  { icon: HeartPulse, title: "MendingLives", subtitle: "Health & Wellness" },
];

export default function CaseStudiesHero() {
  return (
    <section className="relative overflow-hidden">
      <HeroBackground />
      <div className="relative grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
            <Sparkles size={13} />
            Success Stories
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
            Real results.
            <br />
            Real <span className="text-orange-500">impact.</span>
          </h1>
          <p className="mt-6 max-w-lg text-gray-600 sm:text-lg">
            How we partner with businesses to solve real problems.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/case-studies"
              className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
            >
              View All Success Stories
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="flex items-center gap-1 text-sm text-gray-600 sm:text-base">
              Have a project in mind?
              <span className="text-orange-500">Let's Talk</span>
              <ArrowRight size={16} className="text-orange-500" />
            </Link>
          </div>
        </div>

        <div className="mx-auto">
          <OrbitVisual centerIcon={Sparkles} nodes={nodes} size={380} />
        </div>
      </div>
    </section>
  );
}
