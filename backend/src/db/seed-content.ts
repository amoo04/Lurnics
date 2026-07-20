import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { caseStudies, industries, solutions } from "./schema.js";

const INDUSTRIES = [
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

const SOLUTIONS = [
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

const CASE_STUDIES = [
  {
    title: "Sheashine",
    slug: "sheashine",
    industrySlug: "ecommerce-retail",
    summary:
      "A fully custom e-commerce platform with integrated payments, marketing pixel tracking, and SEO-optimized architecture.",
    content: `**The Challenge**
A skincare brand needed a custom online store with reliable payments and a way to track marketing performance — not just a template site.

**What We Built**
A fully custom e-commerce platform with integrated payment handling, marketing pixel tracking, and SEO-optimized architecture built to convert visitors into buyers.

**The Result**
A live storefront actively driving sales, backed by a content and ads strategy across Instagram and TikTok.`,
  },
  {
    title: "Vektar Perfumes",
    slug: "vektar-perfumes",
    industrySlug: "luxury-brand-led",
    summary:
      "A custom-designed luxury retail platform built entirely around the brand's exclusivity, not a stock e-commerce theme.",
    content: `**The Challenge**
A luxury fragrance brand needed a digital presence that matched the exclusivity of the product — generic e-commerce templates wouldn't cut it.

**What We Built**
A custom-designed platform with a bespoke gold-and-cream visual identity, built entirely around the brand's luxury positioning rather than a stock theme.

**The Result**
A storefront that feels handcrafted, not templated — reinforcing premium pricing rather than undercutting it.`,
  },
  {
    title: "MendingLives",
    slug: "mendinglives",
    industrySlug: "health-wellness",
    summary:
      "A full client intake and care platform with authentication, six structured assessment tools, and secure booking.",
    content: `**The Challenge**
A licensed therapist needed more than a booking page — a secure system for client accounts, structured mental health assessments, and confidential session scheduling.

**What We Built**
A full platform with user authentication, six structured assessment tools (personality, trauma, compatibility, and more), and an end-to-end booking flow — handling sensitive data responsibly.

**The Result**
A functioning client intake and care system, not just a marketing site.`,
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
    const existing = await db.query.caseStudies.findFirst({ where: eq(caseStudies.slug, caseStudy.slug) });
    if (existing) {
      console.log(`Case study already exists: ${caseStudy.title}`);
      continue;
    }
    const industryId = industryIdBySlug.get(industrySlug);
    await db.insert(caseStudies).values({
      ...caseStudy,
      industryId,
      publishedAt: new Date().toISOString(),
    });
    console.log(`Created case study: ${caseStudy.title}`);
  }

  console.log("\nContent seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
