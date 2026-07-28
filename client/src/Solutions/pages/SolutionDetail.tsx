import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";
import { useSolutionBySlug } from "../hooks/useSolutions";
import { SOLUTION_CONTENT } from "../data/solutionContent";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, loading, error } = useSolutionBySlug(slug);
  const content = slug ? SOLUTION_CONTENT[slug] : undefined;
  const Icon = content?.icon;

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
            {Icon && (
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <Icon size={24} />
              </div>
            )}
            <h1 className="text-4xl font-bold leading-tight text-gray-900">{solution.name}</h1>
            {solution.description && (
              <p className="mt-4 text-lg text-gray-600">{solution.description}</p>
            )}
            {content?.tagline && (
              <p className="mt-2 text-sm font-medium text-orange-500">{content.tagline}</p>
            )}
          </div>
        )}

        {solution && content && (
          <div className="mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                What's included
              </h2>
              <ul className="mt-4 space-y-3">
                {content.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Who this is for
              </h2>
              <ul className="mt-4 space-y-3">
                {content.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {solution && content && (
          <div className="mt-14 max-w-5xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              How it works
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {content.process.map((step, i) => (
                <div key={step.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-orange-500">Step {i + 1}</p>
                  <p className="mt-2 font-semibold text-gray-900">{step.title}</p>
                  <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {solution && content && (
          <div className="mt-14 max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-5">
              {content.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-gray-200 pb-5">
                  <p className="font-semibold text-gray-900">{faq.question}</p>
                  <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
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
