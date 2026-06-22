import { Link2, AtSign, Code2, Globe, ArrowRight } from "lucide-react";
import logo from "../../../assets/logo/logo2.jpg";

const columns = [
  {
    title: "Services",
    links: [
      "Software Engineering",
      "Digital Infrastructure",
      "Business Automation",
      "Digital Marketing",
      "Brand & Identity",
      "Consulting",
    ],
  },
  {
    title: "Industries",
    links: [
      "Healthcare",
      "Education",
      "Retail",
      "Logistics",
      "Finance",
      "Professional Services",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Our Process", "Careers", "Blog", "Contact Us"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-20 py-12 text-sm text-gray-400">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <div className="h-9 w-[160px] overflow-hidden">
            <img
              src={logo}
              alt="Lurnics"
              className="h-[160px] w-[160px] object-cover"
              style={{ objectPosition: "50% 48%" }}
            />
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
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-medium text-white">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-medium text-white">Newsletter</p>
          <p className="mt-3 text-xs">
            Insights, strategies, and ideas to help your business grow.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 px-3 py-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-500"
            />
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 md:flex-row">
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
