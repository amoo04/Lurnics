import { ArrowRight, TrendingUp, Server, Users, Database, Cloud } from "lucide-react";
import { Link } from "react-router-dom";

const GROWTH_PERCENT = 68;

export default function CaseStudiesHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
          Case Studies
        </p>
        <h1 className="mt-4 text-7xl font-bold leading-[1.05] md:text-8xl">
          Real results.
          <br />
          Real{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            impact.
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-xl text-gray-400">
          Explore how we partner with businesses to solve complex problems,
          build digital infrastructure, and deliver measurable results.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/case-studies"
            className="flex items-center gap-2 rounded-md border border-indigo-400/40 bg-indigo-500/10 px-7 py-3.5 text-base font-medium text-white"
          >
            View All Case Studies
            <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="flex items-center gap-1 text-base text-gray-300">
            Have a project in mind?
            <span className="text-indigo-400">Let's Talk</span>
            <ArrowRight size={16} className="text-indigo-400" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto hidden h-[380px] w-full max-w-lg md:block">
        <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,_rgba(129,90,247,0.3),_transparent_65%)] blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/15" />

        <div
          style={{ animationDelay: "0s" }}
          className="animate-float absolute left-0 top-4 w-36 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur"
        >
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={12} className="text-indigo-300" />
            User Growth
          </p>
          <p className="mt-1 text-lg font-bold">24.6K</p>
          <p className="text-xs text-green-400">+18.2%</p>
        </div>

        <div
          style={{ animationDelay: "1.2s" }}
          className="animate-float absolute right-0 top-2 w-32 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur"
        >
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <Server size={12} className="text-indigo-300" />
            Uptime
          </p>
          <p className="mt-1 text-lg font-bold">99.99%</p>
        </div>

        <div
          style={{ animationDelay: "2.4s" }}
          className="animate-float absolute bottom-6 right-2 w-36 rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur"
        >
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} className="text-indigo-300" />
            Active Users
          </p>
          <p className="mt-1 text-lg font-bold">18.4K</p>
          <p className="text-xs text-green-400">+16.7%</p>
        </div>

        <div className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <Database size={18} />
        </div>
        <div className="absolute bottom-8 right-0 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <Cloud size={18} />
        </div>

        <div className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1224] to-[#161c38] p-4 shadow-[0_0_60px_rgba(79,70,229,0.25)]">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
            <span className="ml-2 text-xs text-gray-400">Dashboard</span>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500">Performance</p>
            <svg viewBox="0 0 200 50" className="mt-1 h-12 w-full">
              <defs>
                <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(129,140,248,0.35)" />
                  <stop offset="100%" stopColor="rgba(129,140,248,0)" />
                </linearGradient>
              </defs>
              <polyline
                points="0,35 25,28 50,32 75,18 100,24 125,12 150,20 175,8 200,14"
                fill="none"
                stroke="#818cf8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points="0,35 25,28 50,32 75,18 100,24 125,12 150,20 175,8 200,14 200,50 0,50"
                fill="url(#chartFill)"
              />
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#818cf8 ${GROWTH_PERCENT * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#10152b]">
                <span className="text-sm font-bold">{GROWTH_PERCENT}%</span>
                <span className="text-[9px] text-gray-500">Growth</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-lg font-bold">$24.8M</p>
              <p className="text-xs text-green-400">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
