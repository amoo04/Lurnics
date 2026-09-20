import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getTheme } from "../lib/themes";
import { resolveNavItemUrl, type PublicNavItem } from "../api/navigation.types";
import type { PublicBusiness } from "../api/storefront.types";

interface FooterContent {
  links?: Array<{ label: string; url: string }>;
}

export default function StorefrontLayout({
  business,
  navigation = [],
  announcement,
  footerContent,
  children,
}: {
  business: PublicBusiness;
  navigation?: PublicNavItem[];
  announcement?: string;
  footerContent?: FooterContent;
  children: ReactNode;
}) {
  const base = `/store/${business.slug}`;
  const theme = getTheme(business.theme);

  return (
    <div className={`min-h-screen ${theme.page}`}>
      {announcement && <div className={`px-4 py-2 text-center text-xs font-medium ${theme.announcement}`}>{announcement}</div>}

      <header className={`flex items-center justify-between px-4 py-4 sm:px-8 ${theme.header}`}>
        <Link to={base} className={`text-lg font-bold uppercase tracking-wide ${theme.heroHeadline}`}>
          {business.name}
        </Link>
        <nav className={`flex items-center gap-6 text-sm ${theme.headerLink}`}>
          {navigation.map((item) => (
            <Link key={item.id} to={resolveNavItemUrl(item, base)} className={theme.headerLink}>
              {item.label}
            </Link>
          ))}
          <ShoppingBag size={18} />
        </nav>
      </header>

      <main>{children}</main>

      <footer className={`mt-16 px-4 py-10 text-center text-sm sm:px-8 ${theme.footer}`}>
        {footerContent?.links && footerContent.links.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
            {footerContent.links.map((link) => (
              <Link
                key={link.url}
                to={link.url.startsWith("/") ? `${base}${link.url}` : link.url}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
        <p>
          © {new Date().getFullYear()} {business.name}. Powered by Lurnics.
        </p>
      </footer>
    </div>
  );
}
