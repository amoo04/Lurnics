import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { articles, caseStudies, industries, solutions, users } from "./schema.js";
import { initBindings } from "../lib/env.js";

initBindings({
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./data/lurnics.db",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "info@lurnics.com",
  LEADS_EMAIL_FROM: process.env.LEADS_EMAIL_FROM ?? "info@lurnics.com",
});

export const INDUSTRIES = [
  {
    name: "E-Commerce & Retail",
    slug: "ecommerce-retail",
    description: "Custom storefronts, payments, and growth infrastructure.",
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Booking systems, assessment logic, and secure client data handling.",
  },
  {
    name: "Luxury & Brand-Led Businesses",
    slug: "luxury-brand-led",
    description: "Design-system-driven platforms built to match a premium identity.",
  },
];

export const SOLUTIONS = [
  {
    name: "Custom Web Platforms & Dashboards",
    slug: "custom-web-platforms-dashboards",
    description: "Bespoke web applications and internal dashboards built around how your business actually runs.",
  },
  {
    name: "Secure User Authentication & Data Handling",
    slug: "secure-auth-data-handling",
    description: "Account systems and data storage built with security and privacy as first-class requirements.",
  },
  {
    name: "Payment Integration",
    slug: "payment-integration",
    description: "Local and international payment flows wired directly into your product, not bolted on.",
  },
  {
    name: "Booking, Scheduling & Workflow Systems",
    slug: "booking-scheduling-workflow-systems",
    description: "End-to-end scheduling and operational workflows that replace manual coordination.",
  },
  {
    name: "Brand-Integrated Design Systems",
    slug: "brand-integrated-design-systems",
    description: "Interfaces designed around your brand's identity, not a generic template.",
  },
];

// liveUrl is intentionally left unset until the real production URLs are
// provided — never fabricate a link to a site visitors could actually click.
export const CASE_STUDIES = [
  {
    title: "Sheashine",
    slug: "sheashine",
    industrySlug: "ecommerce-retail",
    summary:
      "A fully custom e-commerce platform with integrated payments, marketing pixel tracking, and SEO-optimized architecture.",
    content: `**Problem**
A skincare brand needed a custom online store with reliable payments and a way to track marketing performance — not just a template site.

**Solution**
We designed and built a fully custom e-commerce platform from the ground up, structured around the brand's actual catalog and checkout flow rather than a generic theme.

**Technology**
Custom storefront and checkout, integrated payment processing, marketing pixel tracking (Meta/TikTok), and SEO-optimized page architecture.

**Outcome**
A live storefront actively driving sales, backed by a content and ads strategy across Instagram and TikTok.`,
  },
  {
    title: "Vektar Perfumes",
    slug: "vektar-perfumes",
    industrySlug: "luxury-brand-led",
    summary:
      "A custom-designed luxury retail platform built entirely around the brand's exclusivity, not a stock e-commerce theme.",
    content: `**Problem**
A luxury fragrance brand needed a digital presence that matched the exclusivity of the product — generic e-commerce templates wouldn't cut it.

**Solution**
We built a custom-designed platform with a bespoke visual identity, structured entirely around the brand's luxury positioning instead of a stock theme.

**Technology**
Custom storefront with a bespoke gold-and-cream design system, tailored product presentation, and brand-integrated checkout experience.

**Outcome**
A storefront that feels handcrafted, not templated — reinforcing premium pricing rather than undercutting it.`,
  },
  {
    title: "MendingLives",
    slug: "mendinglives",
    industrySlug: "health-wellness",
    summary:
      "A full client intake and care platform with authentication, six structured assessment tools, and secure booking.",
    content: `**Problem**
A licensed therapist needed more than a booking page — a secure system for client accounts, structured mental health assessments, and confidential session scheduling.

**Solution**
We built a full client intake and care platform: user authentication, six structured assessment tools, and an end-to-end booking flow, handling sensitive data responsibly throughout.

**Technology**
Secure authentication, six structured assessment modules (personality, trauma, compatibility, and more), and an integrated scheduling system.

**Outcome**
A functioning client intake and care system, not just a marketing site.`,
  },
];

export const ARTICLES = [
  {
    title: "Why Custom Software Beats Excel",
    slug: "why-custom-software-beats-excel",
    excerpt:
      "Spreadsheets are free until the business outgrows them. Here's how to tell when that's already happened.",
    content: `Most businesses don't choose Excel — they inherit it. A spreadsheet starts as a quick way to track orders or leads, and years later it's the system the whole team depends on, held together with manual entry and tribal knowledge.

**Where spreadsheets break down**

Excel has no concept of concurrent users working safely on the same data, no audit trail of who changed what, and no way to enforce that a field is filled in correctly before it's saved. As the volume of data grows, formulas slow down, files get corrupted, and "who has the latest version" becomes a real question with real consequences.

**What custom software actually fixes**

A purpose-built system replaces manual re-entry with structured data: one source of truth, validated at the point of entry, accessible to the right people with the right permissions. Reports that took an afternoon to assemble by hand become instant. Errors caused by copy-paste or formula drift disappear because the logic lives in code, not in a cell someone might delete.

**When it's time to move on**

If your team spends more time maintaining the spreadsheet than using the data in it — reconciling versions, fixing broken formulas, chasing down who edited what — that's the signal. Custom software isn't about replacing a tool for its own sake; it's about removing a ceiling your business has already hit.`,
  },
  {
    title: "How Automation Saves Businesses Hours Every Week",
    slug: "how-automation-saves-businesses-hours-every-week",
    excerpt:
      "Manual, repetitive work doesn't just cost time — it costs accuracy. Automation fixes both.",
    content: `Every business has a version of the same problem: someone manually copying data between systems, manually sending the same follow-up email, manually checking whether an order needs attention. None of it requires judgment. All of it requires time.

**The real cost isn't just hours**

Manual processes don't just consume time, they introduce errors. A missed step in a manual workflow — a form that didn't get forwarded, a status that didn't get updated — can cost a business a client relationship or a missed deadline. Automation removes that risk by making the process happen the same way, every time.

**Where automation has the most impact**

The best candidates for automation are workflows that are repetitive, rule-based, and currently done by hand: lead routing, notification triggers, status updates between systems, report generation, data syncing between tools that don't talk to each other natively.

**Automation isn't about replacing people**

It's about freeing the team from work a computer should be doing so they can spend time on the things that actually need a human — talking to clients, solving problems, making decisions. The businesses that automate early aren't cutting corners; they're compounding their team's time instead of spending it on repetition.`,
  },
  {
    title: "Cloud Software vs Traditional Software",
    slug: "cloud-software-vs-traditional-software",
    excerpt:
      "The difference isn't just where the software runs — it's how fast your business can move.",
    content: `Traditional software is installed on a specific machine, tied to that machine's hardware, and updated manually when someone remembers to. Cloud software runs on infrastructure built to scale, accessible from anywhere, and updated continuously without anyone needing to think about it.

**Why this distinction matters for a growing business**

A traditional system tied to one office or one server becomes a bottleneck the moment the business needs to operate from more than one location, support remote staff, or scale beyond what that hardware can handle. Cloud-native software is built to grow with demand instead of being constrained by it.

**Reliability and security look different too**

Cloud infrastructure providers invest in redundancy, backups, and security at a scale most individual businesses never could on their own hardware. That means less risk of losing data to a single point of failure, and infrastructure that's patched and monitored continuously rather than whenever someone gets around to it.

**The practical takeaway**

If a system needs to be accessed by more than one person, in more than one place, and needs to keep working as the business grows, it belongs in the cloud. That's not a trend — it's simply what modern software infrastructure is built to do.`,
  },
  {
    title: "Choosing the Right Tech Stack",
    slug: "choosing-the-right-tech-stack",
    excerpt:
      "The best tech stack isn't the newest one. It's the one that matches what your business actually needs.",
    content: `Every technology choice is a trade-off, and the right stack depends less on what's trending and more on what the system actually needs to do — today and in two years.

**Start with the requirements, not the tools**

How many users will this system realistically support? Does it need real-time updates, or is periodic syncing enough? Will it handle sensitive data that requires specific compliance standards? Answering these questions first prevents choosing technology that's either overbuilt for the problem or unable to grow with it.

**Weigh long-term maintainability**

A stack that's fast to build with but hard to hire for, or poorly documented, becomes a liability the moment the original team moves on. Mature, well-supported technology with a strong ecosystem is usually a safer long-term bet than the newest framework, even if it's slightly less exciting to build with.

**Plan for scale from day one, not after it hurts**

That doesn't mean over-engineering an early-stage product. It means choosing an architecture — database design, API structure, hosting model — that won't need to be rebuilt from scratch the moment the business succeeds. The right stack is the one that lets a system grow without a rewrite.`,
  },
  {
    title: "How We Build Scalable Systems",
    slug: "how-we-build-scalable-systems",
    excerpt:
      "Scalability isn't a feature you add later. It's a set of decisions made from the first line of code.",
    content: `A system that works well for ten users and falls over at ten thousand wasn't unlucky — it was built without scale in mind. Building for scale means making specific architectural decisions early, not bolting performance on after something breaks.

**Architecture before features**

We start by designing how data flows through the system: what gets stored where, how services communicate, and where the system needs to handle load independently of other parts. A well-separated architecture means one part of the system under heavy load doesn't take down the rest.

**Database design matters more than most teams realize**

Poor database design is one of the most common causes of systems that slow down as they grow. We design schemas and indexes around how the data will actually be queried at scale, not just how it looks in the early stages when there isn't much of it yet.

**Infrastructure that grows with demand**

We build on cloud infrastructure that scales automatically rather than fixed servers that need to be manually upgraded. Combined with monitoring and testing at every stage, that means the system is verified to hold up under real load before it ever needs to — not after something breaks in production.`,
  },
];

async function main() {
  const industryIdBySlug = new Map<string, string>();

  for (const industry of INDUSTRIES) {
    const existing = await db.query.industries.findFirst({ where: eq(industries.slug, industry.slug) });
    if (existing) {
      industryIdBySlug.set(industry.slug, existing.id);
      console.log(`Industry already exists: ${industry.name}`);
      continue;
    }
    const [row] = await db.insert(industries).values(industry).returning();
    industryIdBySlug.set(industry.slug, row.id);
    console.log(`Created industry: ${industry.name}`);
  }

  for (const solution of SOLUTIONS) {
    const existing = await db.query.solutions.findFirst({ where: eq(solutions.slug, solution.slug) });
    if (existing) {
      console.log(`Solution already exists: ${solution.name}`);
      continue;
    }
    await db.insert(solutions).values(solution);
    console.log(`Created solution: ${solution.name}`);
  }

  for (const { industrySlug, ...caseStudy } of CASE_STUDIES) {
    const industryId = industryIdBySlug.get(industrySlug);
    const existing = await db.query.caseStudies.findFirst({ where: eq(caseStudies.slug, caseStudy.slug) });
    if (existing) {
      await db.update(caseStudies).set({ ...caseStudy, industryId }).where(eq(caseStudies.slug, caseStudy.slug));
      console.log(`Updated case study: ${caseStudy.title}`);
      continue;
    }
    await db.insert(caseStudies).values({
      ...caseStudy,
      industryId,
      publishedAt: new Date().toISOString(),
    });
    console.log(`Created case study: ${caseStudy.title}`);
  }

  const author = await db.query.users.findFirst({ where: eq(users.isActive, true) });

  for (const article of ARTICLES) {
    const existing = await db.query.articles.findFirst({ where: eq(articles.slug, article.slug) });
    if (existing) {
      console.log(`Article already exists: ${article.title}`);
      continue;
    }
    await db.insert(articles).values({
      ...article,
      authorId: author?.id,
      status: "published",
      publishedAt: new Date().toISOString(),
    });
    console.log(`Created article: ${article.title}`);
  }

  console.log("\nContent seed complete.");
  process.exit(0);
}

const isMain = import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`;
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
