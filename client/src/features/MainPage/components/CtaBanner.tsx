import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CtaBannerProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryLayout?: "stacked" | "inline" | "buttons";
}

export default function CtaBanner({
  heading = "Ready to build something bigger than a website?",
  subtext = "Let's engineer the systems your business needs to grow, scale, and lead.",
  primaryLabel = "Schedule Consultation",
  secondaryLabel,
  secondaryLayout = "stacked",
}: CtaBannerProps) {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-10">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />

        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold">{heading}</h2>
            <p className="mt-2 text-sm text-gray-300">{subtext}</p>
          </div>

          {secondaryLayout === "buttons" ? (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <Link
                  to="/contact"
                  className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white"
                >
                  {secondaryLabel}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : secondaryLayout === "inline" ? (
            <div className="flex shrink-0 items-center gap-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <>
                  <span className="text-sm text-gray-400">or</span>
                  <Link to="/contact" className="flex items-center gap-1 text-sm text-indigo-300">
                    {secondaryLabel}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/40">
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex shrink-0 flex-col items-center gap-3">
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <Link to="/contact" className="flex items-center gap-1 text-sm text-indigo-300">
                  {secondaryLabel}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
