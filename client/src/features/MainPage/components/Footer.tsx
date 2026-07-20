import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Link2, AtSign, Code2, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead } from "../hooks/useContent";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Software Engineering", to: "/services" },
      { label: "Digital Infrastructure", to: "/services" },
      { label: "Business Automation", to: "/services" },
      { label: "Digital Marketing", to: "/services" },
      { label: "Brand & Identity", to: "/services" },
      { label: "Consulting", to: "/services" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Healthcare", to: "/industries" },
      { label: "Education", to: "/industries" },
      { label: "Retail", to: "/industries" },
      { label: "Logistics", to: "/industries" },
      { label: "Finance", to: "/industries" },
      { label: "Professional Services", to: "/industries" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Process", to: "/services" },
      { label: "Careers", to: null },
      { label: "Blog", to: "/insights" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitLead({
        companyName: "Newsletter Subscriber",
        contactPerson: "Newsletter Subscriber",
        email,
        source: "newsletter",
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-12 text-sm text-gray-500 sm:px-8 lg:px-20">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex flex-col">
            <span className="text-lg font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
            <span className="h-0.5 w-6 bg-orange-500" />
          </div>
          <p className="mt-3 max-w-xs">
            Beyond Websites.
            <br />
            We Build Digital Infrastructure.
          </p>
          <div className="mt-4 flex gap-2">
            {[Link2, AtSign, Code2, Globe].map((Icon, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-medium text-gray-900">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="hover:text-gray-900">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-medium text-gray-900">Newsletter</p>
          <p className="mt-3 text-xs">
            Insights, strategies, and ideas to help your business grow.
          </p>
          {status === "success" ? (
            <p className="mt-4 flex items-center gap-2 text-xs text-orange-500">
              <CheckCircle2 size={14} />
              You're subscribed!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-500"
              />
              <button type="submit" disabled={status === "submitting"} aria-label="Subscribe" className="text-gray-900">
                <ArrowRight size={14} />
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-1 text-xs text-red-500">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-6 md:flex-row">
        <p>© 2025 Lurnics. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookies Policy</span>
        </div>
      </div>
    </footer>
  );
}
