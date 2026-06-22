import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const methods = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@lurnics.com",
    note: "We typically reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+234 816 024 0451",
    note: "Mon – Fri, 9:00 AM – 6:00 PM WAT",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Lurnics HQ, Lagos, Nigeria",
    note: "By appointment only",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    detail: "Chat with our team instantly",
    note: "Available on our website",
  },
];

export default function ContactMethods() {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Ways to Reach Us
      </p>

      <div className="space-y-4">
        {methods.map(({ icon: Icon, title, detail, note }) => (
          <div
            key={title}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-gray-300">{detail}</p>
                <p className="text-xs text-gray-500">{note}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
