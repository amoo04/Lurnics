import { Cloud, Code2, Share2, TrendingUp, Shield, Monitor, type LucideIcon } from "lucide-react";

interface Article {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
}

const featured: Article = {
  icon: Cloud,
  category: "Infrastructure",
  title: "Building Scalable Systems: The Foundation of Digital Growth",
  description:
    "How modern infrastructure, cloud architecture, and automation work together to help businesses scale efficiently and securely.",
  date: "May 12, 2025",
  readTime: "6 min read",
};

const articles: Article[] = [
  {
    icon: Code2,
    category: "Engineering",
    title: "Clean Code, Strong Systems: Why Code Quality Matters",
    description: "Practical ways to write maintainable, scalable, and high-performance code.",
    date: "Apr 28, 2025",
    readTime: "5 min read",
  },
  {
    icon: Share2,
    category: "Automation",
    title: "Automate to Elevate: Streamlining Operations for Efficiency",
    description: "Discover how automation reduces manual work, minimizes errors, and drives growth.",
    date: "Apr 20, 2025",
    readTime: "7 min read",
  },
  {
    icon: TrendingUp,
    category: "Business Strategy",
    title: "Digital Strategy in 2025: What Successful Businesses Do",
    description: "Key digital strategies that help businesses stay competitive in a fast-changing world.",
    date: "Apr 15, 2025",
    readTime: "6 min read",
  },
  {
    icon: Shield,
    category: "Infrastructure",
    title: "Security by Design: Building Secure Digital Products",
    description: "Why security should be built in, not bolted on — from day one.",
    date: "Apr 8, 2025",
    readTime: "6 min read",
  },
  {
    icon: TrendingUp,
    category: "Digital Transformation",
    title: "From Manual to Modern: Embracing Digital Transformation",
    description: "A practical guide to help businesses transition from manual processes to intelligent systems.",
    date: "Mar 30, 2025",
    readTime: "6 min read",
  },
  {
    icon: Monitor,
    category: "Productivity",
    title: "Developer Productivity: Tools, Habits, and Best Practices",
    description: "Boost productivity, write better code, and ship quality products faster.",
    date: "Mar 22, 2025",
    readTime: "5 min read",
  },
];

function AuthorRow({ date, readTime }: { date: string; readTime: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
        L
      </span>
      <span className="text-gray-300">Lurnics Team</span>
      <span>·</span>
      <span>{date}</span>
      <span>·</span>
      <span>{readTime}</span>
    </div>
  );
}

export default function InsightArticles() {
  const FeaturedIcon = featured.icon;

  return (
    <section className="px-20 pb-16">
      <div className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-2 md:grid-cols-2">
        <div className="relative flex h-56 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-900/50 to-blue-900/30 text-gray-400 md:h-full">
          <span className="absolute left-3 top-3 rounded-md bg-indigo-500 px-2 py-1 text-xs font-semibold text-white">
            Featured
          </span>
          <FeaturedIcon size={48} className="opacity-40" />
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {featured.category}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{featured.title}</h3>
          <p className="mt-3 text-sm text-gray-400">{featured.description}</p>
          <AuthorRow date={featured.date} readTime={featured.readTime} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {articles.map(({ icon: Icon, category, title, description, date, readTime }) => (
          <div key={title} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-900/40 to-blue-900/20 text-gray-400">
              <Icon size={32} className="opacity-40" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {category}
              </p>
              <h3 className="mt-2 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs text-gray-400">{description}</p>
              <AuthorRow date={date} readTime={readTime} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
