import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo/logo.jpg";

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

  return (
    <nav className="flex items-center justify-between px-20 py-5">
      <Link to="/" className="block h-8 w-[140px] overflow-hidden">
        <img
          src={logo}
          alt="Lurnics"
          className="h-[140px] w-[140px] object-cover"
          style={{ objectPosition: "50% 48%" }}
        />
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

      <button
        type="button"
        className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white"
      >
        Book a Strategy Session
      </button>
    </nav>
  );
}
