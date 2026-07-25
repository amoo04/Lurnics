import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchBlogList } from "../hooks/useStorefront";
import { getTheme } from "../lib/themes";
import type { BlogListData } from "../api/storefront.types";

export default function Blog() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<BlogListData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlogList(slug)
      .then(setData)
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-gray-500">Store not found.</p>
      </div>
    );
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  const theme = getTheme(data.business.theme);
  const base = `/store/${data.business.slug}`;

  return (
    <StorefrontLayout business={data.business} navigation={data.navigation}>
      <div className="px-4 py-12 sm:px-8">
        <h1 className={`mb-8 text-2xl font-bold ${theme.sectionHeading}`}>Blog</h1>

        {data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Newspaper size={32} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No posts yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <Link key={post.id} to={`${base}/blog/${post.slug}`} className={`rounded-lg p-4 ${theme.cardBorder}`}>
                <div className={`mb-3 flex h-36 items-center justify-center overflow-hidden rounded-md ${theme.cardImageBg}`}>
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Newspaper size={24} className="text-gray-300" />
                  )}
                </div>
                <p className={`text-sm font-semibold ${theme.productName}`}>{post.title}</p>
                {post.excerpt && <p className={`mt-1 text-xs ${theme.productPrice}`}>{post.excerpt}</p>}
                {post.publishedAt && (
                  <p className="mt-2 text-xs text-gray-400">{new Date(post.publishedAt).toLocaleDateString()}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
