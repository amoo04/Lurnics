import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";
import { useCaseStudyBySlug } from "../hooks/useSuccessStories";

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: caseStudy, loading, error } = useCaseStudyBySlug(slug);

  return (
    <>
      <Navbar />
      <section className="px-4 sm:px-8 md:px-20 py-16">
        <Link to="/case-studies" className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600">
          <ArrowLeft size={14} />
          Back to success stories
        </Link>

        {loading && <p className="mt-8 text-sm text-gray-500">Loading success story…</p>}
        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {caseStudy && (
          <div className="mt-8 max-w-3xl">
            {caseStudy.featuredImage && (
              <img
                src={caseStudy.featuredImage}
                alt={caseStudy.title}
                className="mb-8 h-72 w-full rounded-xl border border-gray-200 object-cover"
              />
            )}
            {caseStudy.industry && (
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                {caseStudy.industry.name}
              </p>
            )}
            <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900">{caseStudy.title}</h1>
            {caseStudy.summary && <p className="mt-4 text-lg text-gray-600">{caseStudy.summary}</p>}

            {caseStudy.liveUrl && (
              <a
                href={caseStudy.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
              >
                Visit Live Site
                <ExternalLink size={14} />
              </a>
            )}

            <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
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
