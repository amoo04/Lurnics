import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import { useCaseStudyBySlug } from "../hooks/useContent";

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: caseStudy, loading, error } = useCaseStudyBySlug(slug);

  return (
    <>
      <Navbar />
      <section className="px-4 sm:px-8 md:px-20 py-16">
        <Link to="/case-studies" className="flex items-center gap-1 text-sm text-indigo-400">
          <ArrowLeft size={14} />
          Back to case studies
        </Link>

        {loading && <p className="mt-8 text-sm text-gray-500">Loading case study…</p>}
        {error && <p className="mt-8 text-sm text-red-400">{error}</p>}

        {caseStudy && (
          <div className="mt-8 max-w-3xl">
            {caseStudy.industry && (
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {caseStudy.industry.name}
              </p>
            )}
            <h1 className="mt-3 text-4xl font-bold leading-tight">{caseStudy.title}</h1>
            {caseStudy.summary && <p className="mt-4 text-lg text-gray-400">{caseStudy.summary}</p>}

            <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-relaxed text-gray-300">
              {caseStudy.content}
            </div>
          </div>
        )}
      </section>
      <CtaBanner
        heading="Your success story could be next."
        subtext="Let's build a digital infrastructure that drives real impact for your business."
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Tell us about your project"
        secondaryLayout="inline"
      />
      <Footer />
    </>
  );
}
