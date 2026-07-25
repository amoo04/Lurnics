import { Mail, Phone, MessageCircle, ArrowRight } from "lucide-react";

const methods = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "info@lurnics.com",
    note: "We typically reply within 24 hours",
    href: "mailto:info@lurnics.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+234 701 949 1689",
    note: "Mon – Fri, 9:00 AM – 8:00 PM WAT",
    href: "tel:+2347019491689",
  },
  // {
  //   icon: MapPin,
  //   title: "Visit Us",
  //   detail: "Lurnics HQ, Lagos, Nigeria",
  //   note: "By appointment only",
  //   href: "https://www.google.com/maps/search/?api=1&query=Lagos%2C+Nigeria",
  // },
  {
    icon: MessageCircle,
    title: "Live Chat",
    detail: "Chat with our team instantly",
    href: null,
  },
];

export default function ContactMethods() {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange-500">
        Ways to Reach Us
      </p>

      <div className="space-y-4">
        {methods.map(({ icon: Icon, title, detail, note, href }) => {
          const content = (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600">{detail}</p>
                  <p className="text-xs text-gray-500">{note}</p>
                </div>
              </div>
              {href && <ArrowRight size={16} className="text-gray-500" />}
            </>
          );

          const className =
            "flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm";

          return href ? (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className={className}
            >
              {content}
            </a>
          ) : (
            <div key={title} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
