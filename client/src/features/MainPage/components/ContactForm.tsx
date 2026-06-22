import { Send, Lock } from "lucide-react";

export default function ContactForm() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Send Us a Message
      </p>

      <form className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Work Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Company Name (Optional)</label>
          <input
            type="text"
            placeholder="Your company"
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Subject</label>
          <input
            type="text"
            placeholder="How can we help you?"
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Tell us about your project</label>
          <textarea
            placeholder="Describe your project, goals, and how we can help..."
            rows={4}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
        >
          Send Message
          <Send size={16} />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <Lock size={12} />
          Your information is secure and will never be shared.
        </p>
      </form>
    </div>
  );
}
