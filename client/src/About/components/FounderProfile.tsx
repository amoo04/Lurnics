import { Code2, Cloud, Cog, TrendingUp, Layers, Smartphone } from "lucide-react";
// import { Link2, AtSign } from "lucide-react"; // used by the founder social-links row, hidden for now
import founderPhoto from "../../assets/founder/amoo.png";

const expertise = [
  { icon: Code2, label: "Software Engineering" },
  { icon: Cloud, label: "Cloud Infrastructure" },
  { icon: Cog, label: "Business Automation" },
  { icon: TrendingUp, label: "Digital Transformation" },
  { icon: Layers, label: "System Architecture" },
  { icon: Smartphone, label: "Product Development" },
];

export default function FounderProfile() {
  return (
    <section id="story" className="px-4 sm:px-8 md:px-20 py-10">
      <div className="grid gap-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-[200px_1fr_240px]">
        <div className="h-56 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img src={founderPhoto} alt="Amoo Oluwasegun, Founder & Lead Engineer" className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Founder
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">Amoo Oluwasegun</h3>
          <p className="text-sm text-orange-500">Founder &amp; Lead Engineer</p>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              I started Lurnics with a simple belief, businesses don't just
              need websites; they need systems that work, scale, and create
              real value.
            </p>
            <p>
              With a strong background in software engineering and a passion
              for solving real problems, I help organizations transform the
              way they operate through technology and automation.
            </p>
            <p>
              Lurnics is built on clarity, engineering excellence, and a
              commitment to helping businesses build infrastructure for the
              future.
            </p>
          </div>

          {/* Social links, hidden for now
          <div className="mt-5 flex items-center gap-3">
            {[Link2, Code2, AtSign].map((Icon, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
          */}
        </div>

        <div>
          <p className="text-sm font-semibold text-orange-500">
            Areas of Expertise
          </p>
          <ul className="mt-3 space-y-3 text-sm text-gray-600">
            {expertise.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-500">
                  <Icon size={14} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
