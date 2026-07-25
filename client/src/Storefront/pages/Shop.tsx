import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchShopProducts, fetchStorefront } from "../hooks/useStorefront";
import { getTheme } from "../lib/themes";
import type { PublicProduct, StorefrontData } from "../api/storefront.types";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function Shop() {
  const { slug = "" } = useParams();
  const [storefront, setStorefront] = useState<StorefrontData | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorefront(slug).then(setStorefront);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    fetchShopProducts(slug)
      .then((result) => setProducts(result.items))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!storefront) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  const footerContent = storefront.sections.find((s) => s.type === "footer")?.content as {
    links?: Array<{ label: string; url: string }>;
  };
  const theme = getTheme(storefront.business.theme);

  return (
    <StorefrontLayout business={storefront.business} navigation={storefront.navigation} footerContent={footerContent}>
      <div className="px-4 py-12 sm:px-8">
        <h1 className={`mb-8 text-2xl font-bold ${theme.sectionHeading}`}>Shop</h1>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageSearch size={32} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className={`rounded-lg p-3 ${theme.cardBorder}`}>
                <div className={`mb-2 flex h-32 items-center justify-center overflow-hidden rounded-md ${theme.cardImageBg}`}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-400">{product.name.charAt(0)}</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${theme.productName}`}>{product.name}</p>
                <p className={`text-sm ${theme.productPrice}`}>{formatMoney(product.price, storefront.business.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
