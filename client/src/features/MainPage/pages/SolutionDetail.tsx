import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import { useSolutionBySlug } from "../hooks/useContent";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, loading, error } = useSolutionBySlug(slug);

  return (
    <>
      <Navbar />
      <section className="px-4 sm:px-8 md:px-20 py-16">
        <Link to="/solutions" className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600">
          <ArrowLeft size={14} />
          Back to solutions
        </Link>

        {loading && <p className="mt-8 text-sm text-gray-500">Loading solution…</p>}
        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {solution && (
          <div className="mt-8 max-w-3xl">
            <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900">{solution.name}</h1>
            {solution.description && (
              <p className="mt-4 text-lg text-gray-600">{solution.description}</p>
            )}
          </div>
        )}
      </section>
      <CtaBanner
        heading="Have a unique challenge?"
        subtext="Let's build a custom solution that gives you a competitive advantage."
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Tell us about your project"
        secondaryLayout="inline"
      />
      <Footer />
    </>
  );
}
