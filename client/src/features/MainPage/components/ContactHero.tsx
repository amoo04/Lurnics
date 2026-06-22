import { Calendar, Headphones } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Get in Touch
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Let's build something{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            exceptional
          </span>{" "}
          together.
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          Have a project in mind or need expert guidance? We're here to help
          you turn ideas into scalable digital solutions that drive real
          growth.
        </p>

        <div className="mt-8 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">Book a Strategy Session</p>
              <p className="text-xs text-gray-500">Schedule a free consultation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
              <Headphones size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">Let's Talk</p>
              <p className="text-xs text-gray-500">We're ready to listen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-500 md:h-72">
        World map placeholder
      </div>
    </section>
  );
}
