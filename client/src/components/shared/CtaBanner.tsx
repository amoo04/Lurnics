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
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-10">
        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{heading}</h2>
            <p className="mt-2 text-sm text-gray-600">{subtext}</p>
          </div>

          {secondaryLayout === "buttons" ? (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <Link
                  to="/contact"
                  className="flex items-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
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
                className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <>
                  <span className="text-sm text-gray-500">or</span>
                  <Link to="/contact" className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600">
                    {secondaryLabel}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-200">
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
                className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              {secondaryLabel && (
                <Link to="/contact" className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600">
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
