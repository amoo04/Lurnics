import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Industries", path: "/industries" },
  { label: "Solutions", path: "/solutions" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "About", path: "/about" },
  { label: "Insights", path: "/insights" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-4 py-5 sm:px-8 lg:px-20">
      <Link to="/" onClick={() => setOpen(false)} className="flex flex-col">
        <span className="text-lg font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
        <span className="h-0.5 w-6 bg-orange-500" />
      </Link>

      <ul className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
        {links.map(({ label, path }) => (
          <li key={label}>
            <Link
              to={path}
              className={
                path === pathname
                  ? "border-b-2 border-orange-500 pb-1 text-gray-900"
                  : "transition hover:text-gray-900"
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className="hidden rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black md:block"
      >
        Book a Strategy Session
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-600 hover:text-gray-900 md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <ul className="space-y-1 text-sm text-gray-600">
            {links.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 ${
                    path === pathname ? "bg-orange-50 text-gray-900" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block w-full rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-black"
          >
            Book a Strategy Session
          </Link>
        </div>
      )}
    </nav>
  );
}
