import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import NewsletterBanner from "../components/NewsletterBanner";
import Footer from "../components/Footer";
import { useArticleBySlug } from "../hooks/useContent";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Insight() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, loading, error } = useArticleBySlug(slug);

  return (
    <>
      <Navbar />
      <section className="px-4 sm:px-8 md:px-20 py-16">
        <Link to="/insights" className="flex items-center gap-1 text-sm text-indigo-400">
          <ArrowLeft size={14} />
          Back to insights
        </Link>

        {loading && <p className="mt-8 text-sm text-gray-500">Loading article…</p>}
        {error && <p className="mt-8 text-sm text-red-400">{error}</p>}

        {article && (
          <div className="mt-8 max-w-3xl">
            <h1 className="mt-3 text-4xl font-bold leading-tight">{article.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
                L
              </span>
              <span className="text-gray-300">Lurnics Team</span>
              {article.publishedAt && (
                <>
                  <span>·</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </>
              )}
            </div>

            <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-relaxed text-gray-300">
              {article.content}
            </div>
          </div>
        )}
      </section>
      <NewsletterBanner />
      <Footer />
    </>
  );
}
