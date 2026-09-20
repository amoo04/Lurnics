import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchStorePage } from "../hooks/useStorefront";
import type { StorePageData } from "../api/storefront.types";

export default function StorePage() {
  const { slug = "", pageSlug = "" } = useParams();
  const [data, setData] = useState<StorePageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStorePage(slug, pageSlug)
      .then(setData)
      .catch(() => setError(true));
  }, [slug, pageSlug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-gray-500">Page not found.</p>
      </div>
    );
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <StorefrontLayout business={data.business} navigation={data.navigation}>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{data.page.title}</h1>
        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: data.page.content }} />
      </div>
    </StorefrontLayout>
  );
}
