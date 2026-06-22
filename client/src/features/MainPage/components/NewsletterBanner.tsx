import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterBanner() {
  return (
    <section className="px-20 pb-16">
      <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-white/10 bg-gradient-to-r from-indigo-900/40 to-purple-900/30 p-8 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Stay Ahead
            </p>
            <h3 className="text-lg font-semibold">Get insights delivered to your inbox</h3>
            <p className="text-sm text-gray-400">
              Join 1,000+ professionals who receive our latest insights and updates.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-64 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
            <button
              type="button"
              className="flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white"
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
