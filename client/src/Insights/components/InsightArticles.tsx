import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useInsights";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AuthorRow({ date }: { date: string | null }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
        L
      </span>
      <span className="text-gray-600">Lurnics Team</span>
      {date && (
        <>
          <span>·</span>
          <span>{formatDate(date)}</span>
        </>
      )}
    </div>
  );
}

export default function InsightArticles() {
  const { data, loading, error } = useArticles();
  const articles = data?.items ?? [];
  const [featured, ...rest] = articles;

  return (
    <section className="px-4 sm:px-8 md:px-20 pb-16">
      {loading && (
        <p className="text-center text-sm text-gray-500">Loading articles…</p>
      )}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {featured && (
        <Link
          to={`/insights/${featured.slug}`}
          className="grid gap-6 rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
        >
          <div className="relative mx-auto flex h-48 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-gray-50 text-gray-400">
            <span className="absolute left-3 top-3 rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold text-white">
              Featured
            </span>
            {featured.featuredImage ? (
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileText size={48} className="opacity-40" />
            )}
          </div>
          <div className="p-6">
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p className="mt-3 text-sm text-gray-600">{featured.excerpt}</p>
            )}
            <AuthorRow date={featured.publishedAt} />
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {rest.map(
            ({ id, slug, title, excerpt, publishedAt, featuredImage }) => (
              <Link
                key={id}
                to={`/insights/${slug}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex h-32 items-center justify-center bg-gray-50 text-gray-400">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileText size={32} className="opacity-40" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    {title}
                  </h3>
                  {excerpt && (
                    <p className="mt-2 text-xs text-gray-600">{excerpt}</p>
                  )}
                  <AuthorRow date={publishedAt} />
                </div>
              </Link>
            ),
          )}
        </div>
      )}
    </section>
  );
}
