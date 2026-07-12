import { Send, Users, BarChart3, LayoutGrid, Shield, MessageSquare, HeartHandshake } from "lucide-react";

const steps = [
  { icon: Send, title: "We'll Get Back to You", description: "Our team will review your message and respond within 24 hours." },
  { icon: Users, title: "Discovery Call", description: "We'll schedule a short call to understand your goals and challenges." },
  { icon: BarChart3, title: "Tailored Solution", description: "You'll receive a customized proposal designed to deliver real impact." },
];

const reasons = [
  { icon: LayoutGrid, title: "Business-Focused Approach", description: "We align technology with your business goals to deliver measurable results." },
  { icon: Shield, title: "Scalable & Secure Solutions", description: "We build robust, secure, and future-ready systems that grow with your business." },
  { icon: MessageSquare, title: "Clear Communication", description: "We keep you informed at every step with transparency and clarity." },
  { icon: HeartHandshake, title: "Long-term Partnership", description: "We're not just a vendor—we're your technology partner for the long run." },
];

export default function ContactInfoGrid() {
  return (
    <section className="grid gap-6 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          What Happens Next?
        </p>
        <div className="relative space-y-8">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="relative flex gap-4">
              {i < steps.length - 1 && (
                <span className="absolute left-5 top-10 h-8 w-px bg-white/10" />
              )}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Why Work With Lurnics?
        </p>
        <div className="space-y-5">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
