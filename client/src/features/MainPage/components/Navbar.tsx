import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/logo/logo3.png";

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
      <Link to="/" onClick={() => setOpen(false)} className="block h-8 w-[140px] overflow-hidden">
        <img src={logo} alt="Lurnics" className="h-8 w-[140px] object-cover" />
      </Link>

      <ul className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
        {links.map(({ label, path }) => (
          <li key={label}>
            <Link
              to={path}
              className={
                path === pathname
                  ? "border-b-2 border-indigo-400 pb-1 text-white"
                  : "transition hover:text-white"
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className="hidden rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white md:block"
      >
        Book a Strategy Session
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-300 hover:text-white md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-white/10 bg-[#050816] px-4 py-4 md:hidden">
          <ul className="space-y-1 text-sm text-gray-300">
            {links.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 ${
                    path === pathname ? "bg-indigo-500/15 text-white" : "hover:bg-white/5 hover:text-white"
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
            className="mt-3 block w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            Book a Strategy Session
          </Link>
        </div>
      )}
    </nav>
  );
}
