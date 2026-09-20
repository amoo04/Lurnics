import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import StorefrontLayout from "../components/StorefrontLayout";
import { fetchStorefront, subscribeToNewsletter } from "../hooks/useStorefront";
import { getTheme, type ThemeStyle } from "../lib/themes";
import type { StorefrontData, StoreSectionData } from "../api/storefront.types";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function HeroSection({ content, base, theme }: { content: Record<string, unknown>; base: string; theme: ThemeStyle }) {
  const headline = (content.headline as string) || "";
  if (!headline) return null;

  return (
    <section className={`px-4 py-16 sm:px-8 sm:py-24 ${theme.heroSection}`}>
      {!!content.eyebrow && <p className={theme.heroEyebrow}>{content.eyebrow as string}</p>}
      <h1 className={`mt-3 text-3xl font-bold sm:text-4xl ${theme.heroHeadline}`}>{headline}</h1>
      {!!content.subtext && <p className={`mt-4 ${theme.heroSubtext}`}>{content.subtext as string}</p>}
      {!!content.buttonText && (
        <Link
          to={`${base}${(content.buttonLink as string)?.startsWith("/") ? content.buttonLink : `/${content.buttonLink ?? "shop"}`}`}
          className={`mt-6 inline-block rounded-md px-6 py-3 text-sm font-medium transition ${theme.heroButton}`}
        >
          {content.buttonText as string}
        </Link>
      )}
    </section>
  );
}

function FeaturedCollectionsSection({ data, base, theme }: { data: StorefrontData; base: string; theme: ThemeStyle }) {
  const heading = (data.sections.find((s) => s.type === "featured_collections")?.content.heading as string) ?? "Shop by Collection";
  if (data.collections.length === 0) return null;

  return (
    <section className="px-4 py-12 sm:px-8">
      <h2 className={`mb-6 text-xl font-bold ${theme.sectionHeading}`}>{heading}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.collections.map((collection) => (
          <Link key={collection.id} to={`${base}/collections/${collection.slug}`} className={`group rounded-lg p-3 text-center ${theme.cardBorder}`}>
            <div className={`mb-2 flex h-24 items-center justify-center overflow-hidden rounded-md ${theme.cardImageBg}`}>
              {collection.imageUrl ? (
                <img src={collection.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-400">{collection.name.charAt(0)}</span>
              )}
            </div>
            <p className={`text-sm font-medium ${theme.productName}`}>{collection.name}</p>
            <p className={`text-xs ${theme.productPrice}`}>{collection.productCount} products</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProductsSection({
  data,
  currency,
  base,
  theme,
}: {
  data: StorefrontData;
  currency: string;
  base: string;
  theme: ThemeStyle;
}) {
  const heading = (data.sections.find((s) => s.type === "featured_products")?.content.heading as string) ?? "Featured Products";
  if (data.featuredProducts.length === 0) return null;

  return (
    <section className="px-4 py-12 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`text-xl font-bold ${theme.sectionHeading}`}>{heading}</h2>
        <Link to={`${base}/shop`} className={`text-sm font-medium hover:underline ${theme.sectionHeading}`}>
          View all products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.featuredProducts.map((product) => (
          <div key={product.id} className={`rounded-lg p-3 ${theme.cardBorder}`}>
            <div className={`mb-2 flex h-32 items-center justify-center overflow-hidden rounded-md ${theme.cardImageBg}`}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-400">{product.name.charAt(0)}</span>
              )}
            </div>
            <p className={`text-sm font-medium ${theme.productName}`}>{product.name}</p>
            <p className={`text-sm ${theme.productPrice}`}>{formatMoney(product.price, currency)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection({ content, theme }: { content: Record<string, unknown>; theme: ThemeStyle }) {
  const items = (content.items as Array<{ name: string; quote: string }>) ?? [];
  if (items.length === 0) return null;

  return (
    <section className={`px-4 py-12 sm:px-8 ${theme.cardImageBg}`}>
      <h2 className={`mb-6 text-center text-xl font-bold ${theme.sectionHeading}`}>
        {(content.heading as string) ?? "What Our Customers Say"}
      </h2>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={i} className={`rounded-lg p-4 text-sm shadow-sm ${theme.page} ${theme.productPrice}`}>
            <p>"{item.quote}"</p>
            <p className={`mt-2 font-medium ${theme.productName}`}>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection({ content, slug, theme }: { content: Record<string, unknown>; slug: string; theme: ThemeStyle }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await subscribeToNewsletter(slug, email);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-4 py-12 text-center sm:px-8">
      <h2 className={`text-xl font-bold ${theme.sectionHeading}`}>{(content.heading as string) ?? "Subscribe to our newsletter"}</h2>
      {!!content.subtext && <p className={`mt-2 text-sm ${theme.productPrice}`}>{content.subtext as string}</p>}

      {status === "success" ? (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-emerald-500">
          <CheckCircle2 size={16} />
          Subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-sm gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${theme.heroButton}`}
          >
            {status === "submitting" ? "…" : "Subscribe"}
          </button>
        </form>
      )}
    </section>
  );
}

function renderSection(section: StoreSectionData, data: StorefrontData, currency: string, base: string, theme: ThemeStyle) {
  switch (section.type) {
    case "hero":
      return <HeroSection key={section.id} content={section.content} base={base} theme={theme} />;
    case "featured_collections":
      return <FeaturedCollectionsSection key={section.id} data={data} base={base} theme={theme} />;
    case "featured_products":
      return <FeaturedProductsSection key={section.id} data={data} currency={currency} base={base} theme={theme} />;
    case "testimonials":
      return <TestimonialsSection key={section.id} content={section.content} theme={theme} />;
    case "newsletter":
      return <NewsletterSection key={section.id} content={section.content} slug={data.business.slug} theme={theme} />;
    default:
      return null;
  }
}

export default function Store() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<StorefrontData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStorefront(slug)
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

  const announcement = data.sections.find((s) => s.type === "announcement")?.content.message as string | undefined;
  const footerContent = data.sections.find((s) => s.type === "footer")?.content as { links?: Array<{ label: string; url: string }> };
  const base = `/store/${data.business.slug}`;
  const theme = getTheme(data.business.theme);

  return (
    <StorefrontLayout business={data.business} navigation={data.navigation} announcement={announcement} footerContent={footerContent}>
      {data.sections.map((section) => renderSection(section, data, data.business.currency, base, theme))}
    </StorefrontLayout>
  );
}
