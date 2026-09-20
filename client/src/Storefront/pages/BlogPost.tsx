import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchBlogPost } from "../hooks/useStorefront";
import { getTheme } from "../lib/themes";
import type { BlogPostPageData } from "../api/storefront.types";

export default function BlogPost() {
  const { slug = "", postSlug = "" } = useParams();
  const [data, setData] = useState<BlogPostPageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlogPost(slug, postSlug)
      .then(setData)
      .catch(() => setError(true));
  }, [slug, postSlug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    );
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  const theme = getTheme(data.business.theme);

  return (
    <StorefrontLayout business={data.business} navigation={data.navigation}>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
        {data.post.coverImageUrl && (
          <img src={data.post.coverImageUrl} alt="" className="mb-6 h-64 w-full rounded-lg object-cover" />
        )}
        <h1 className={`mb-2 text-2xl font-bold ${theme.sectionHeading}`}>{data.post.title}</h1>
        {data.post.publishedAt && (
          <p className="mb-6 text-sm text-gray-400">{new Date(data.post.publishedAt).toLocaleDateString()}</p>
        )}
        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: data.post.content }} />
      </div>
    </StorefrontLayout>
  );
}
