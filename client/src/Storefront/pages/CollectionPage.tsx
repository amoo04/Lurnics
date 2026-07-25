import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchCollectionPage } from "../hooks/useStorefront";
import type { CollectionPageData } from "../api/storefront.types";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function CollectionPage() {
  const { slug = "", collectionSlug = "" } = useParams();
  const [data, setData] = useState<CollectionPageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCollectionPage(slug, collectionSlug)
      .then(setData)
      .catch(() => setError(true));
  }, [slug, collectionSlug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-gray-500">Collection not found.</p>
      </div>
    );
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <StorefrontLayout business={data.business} navigation={data.navigation}>
      <div className="px-4 py-12 sm:px-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{data.collection.name}</h1>
        {data.collection.description && <p className="mb-8 text-sm text-gray-500">{data.collection.description}</p>}

        {data.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageSearch size={32} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {data.products.map((product) => (
              <div key={product.id} className="rounded-lg border border-gray-100 p-3">
                <div className="mb-2 flex h-32 items-center justify-center overflow-hidden rounded-md bg-gray-50">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-300">{product.name.charAt(0)}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{formatMoney(product.price, data.business.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
