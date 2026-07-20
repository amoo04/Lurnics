import { Calendar, Headphones, Mail, Phone, MessageSquare, Globe, Send } from "lucide-react";
import OrbitVisual from "./OrbitVisual";

const nodes = [
  { icon: Mail, title: "Email Us", subtitle: "Reply within 24hrs" },
  { icon: Phone, title: "Call Us", subtitle: "Mon – Fri, 9–6" },
  { icon: Calendar, title: "Book a Session", subtitle: "Free consultation" },
  { icon: MessageSquare, title: "Live Chat", subtitle: "Talk to our team" },
  { icon: Globe, title: "Global Support", subtitle: "Anywhere, anytime" },
  { icon: Headphones, title: "Dedicated Support", subtitle: "We're here to help" },
];

export default function ContactHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Get in Touch
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
          Let's build something{" "}
          <span className="text-orange-500">
            exceptional
          </span>{" "}
          together.
        </h1>
        <p className="mt-6 max-w-md text-gray-600">
          Have a project in mind? Let's turn it into a scalable solution.
        </p>

        <div className="mt-8 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Book a Strategy Session</p>
              <p className="text-xs text-gray-500">
                Schedule a free consultation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Headphones size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Schedule a Call</p>
              <p className="text-xs text-gray-500">We're ready to listen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <OrbitVisual centerIcon={Send} nodes={nodes} size={380} />
      </div>
    </section>
  );
}
