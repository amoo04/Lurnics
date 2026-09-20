import {
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  CalendarClock,
  Palette,
  type LucideIcon,
} from "lucide-react";

export interface SolutionContent {
  icon: LucideIcon;
  tagline: string;
  features: string[];
  process: { title: string; description: string }[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
}

export const SOLUTION_CONTENT: Record<string, SolutionContent> = {
  "custom-web-platforms-dashboards": {
    icon: LayoutDashboard,
    tagline: "Built around how your business actually runs, not a generic admin template.",
    features: [
      "Internal dashboards tailored to your actual workflow, not a generic admin template",
      "Role-based access so each team member sees only what they need",
      "Real-time data views pulled directly from your operations",
      "Custom reporting built around the metrics you actually track",
      "Built to integrate with the tools you already use",
    ],
    process: [
      { title: "Discovery", description: "We map how your team actually works today, before writing a line of code." },
      { title: "Architecture", description: "We design the data model and permission structure around your real workflow." },
      { title: "Build", description: "Iterative development with regular check-ins, not a single reveal at the end." },
      { title: "Launch & handover", description: "Deployed, documented, and handed over with room to grow." },
    ],
    useCases: [
      "Operations teams replacing spreadsheets with a real system of record",
      "Founders who need a single dashboard across sales, inventory, and support",
      "Businesses managing multiple locations or teams from one place",
    ],
    faqs: [
      { question: "How long does a custom dashboard take to build?", answer: "Typically 4-10 weeks depending on scope, complexity of permissions, and integrations required." },
      { question: "Can it replace our existing spreadsheets?", answer: "Yes, we design the system so your team can migrate off spreadsheets without losing existing data." },
      { question: "Do you build the admin panel too?", answer: "Yes, an admin panel with role-based access is standard, so you control who sees and edits what." },
    ],
  },
  "secure-auth-data-handling": {
    icon: ShieldCheck,
    tagline: "Security and privacy built in from the start, not bolted on after launch.",
    features: [
      "Secure login systems, email/password, social login, or both",
      "Encrypted storage for sensitive data, built to industry best practices",
      "Role-based permissions so access is limited to what each user needs",
      "Session management and account recovery flows that don't compromise security",
      "Audit-ready data handling for businesses in regulated industries",
    ],
    process: [
      { title: "Risk assessment", description: "We identify what data is sensitive and what protection it needs." },
      { title: "Architecture", description: "Authentication and encryption designed in from the start, not bolted on later." },
      { title: "Implementation", description: "Secure by default, tested against common vulnerabilities." },
      { title: "Ongoing hardening", description: "Monitoring and updates as security standards evolve." },
    ],
    useCases: [
      "Healthcare and wellness platforms handling confidential client records",
      "Financial or fintech products needing bank-level data protection",
      "Any product storing personal information, passwords, or payment details",
    ],
    faqs: [
      { question: "Is this GDPR/compliance-ready?", answer: "We build with recognized security standards in mind and can align with specific compliance requirements you need to meet." },
      { question: "Do you handle password resets and account recovery?", answer: "Yes, secure recovery flows are included as standard." },
      { question: "What happens to our data if we ever leave?", answer: "Your data belongs to you, we provide a clean export path." },
    ],
  },
  "payment-integration": {
    icon: CreditCard,
    tagline: "Local and international payment flows wired directly into your product.",
    features: [
      "Local payment rails (Paystack, Flutterwave) alongside global options (Stripe)",
      "Secure checkout flows that don't leak sensitive card data to your servers",
      "Subscription and one-time billing support",
      "Automatic reconciliation so payments match your records",
      "Webhook-driven order and status updates, no manual checking required",
    ],
    process: [
      { title: "Scope", description: "We confirm which payment providers and currencies you need." },
      { title: "Integration", description: "Payment flows wired directly into your product's checkout and billing logic." },
      { title: "Testing", description: "Sandbox testing across every payment path before going live." },
      { title: "Go-live", description: "Real transactions monitored closely during the first live cycle." },
    ],
    useCases: [
      "E-commerce stores needing reliable local and international checkout",
      "SaaS products billing customers on a recurring basis",
      "Service businesses collecting deposits or one-time payments online",
    ],
    faqs: [
      { question: "Which payment providers do you support?", answer: "Paystack and Flutterwave for Nigeria/Africa, Stripe for global cards, others on request." },
      { question: "Can customers pay in installments?", answer: "Yes, if your product needs installment or subscription billing, we build that logic in." },
      { question: "What if a payment fails or is disputed?", answer: "We build in retry logic, failure handling, and clear status tracking for every transaction." },
    ],
  },
  "booking-scheduling-workflow-systems": {
    icon: CalendarClock,
    tagline: "End-to-end scheduling and operational workflows that replace manual coordination.",
    features: [
      "Real-time availability and booking, no back-and-forth messages",
      "Automated reminders and confirmations by email or SMS",
      "Staff and resource scheduling for multi-person or multi-location teams",
      "Custom intake forms collected at the point of booking",
      "Workflow automation for what happens after a booking is made",
    ],
    process: [
      { title: "Map the workflow", description: "We document every step from booking to completion." },
      { title: "Design the system", description: "Availability rules, forms, and notifications built around your process." },
      { title: "Build & test", description: "Real bookings tested end-to-end before launch." },
      { title: "Launch", description: "Your team stops coordinating manually and starts running on the system." },
    ],
    useCases: [
      "Clinics and wellness practices managing appointments and client intake",
      "Service businesses coordinating staff schedules across locations",
      "Any business currently relying on phone calls or DMs to book time",
    ],
    faqs: [
      { question: "Can clients reschedule or cancel themselves?", answer: "Yes, self-service rescheduling within rules you define is standard." },
      { question: "Does it send reminders automatically?", answer: "Yes, automated email or SMS reminders reduce no-shows without manual follow-up." },
      { question: "Can it handle multiple staff or locations?", answer: "Yes, the system is built around your actual team structure, not a single generic calendar." },
    ],
  },
  "brand-integrated-design-systems": {
    icon: Palette,
    tagline: "Interfaces designed around your brand's identity, not a generic template.",
    features: [
      "Visual design system built entirely around your brand, not a template",
      "Consistent components across every page and screen",
      "Typography, color, and spacing decisions that reflect your brand's positioning",
      "Design that scales as you add new pages and features",
      "A system your team can extend without hiring a designer for every new page",
    ],
    process: [
      { title: "Brand audit", description: "We study your identity, tone, and market position." },
      { title: "Design system", description: "A component library built specifically around that identity." },
      { title: "Application", description: "Every page and flow built to the same system, no inconsistency." },
      { title: "Documentation", description: "A living reference so future work stays on-brand." },
    ],
    useCases: [
      "Luxury or premium brands where a generic template undercuts perceived value",
      "Businesses scaling past their original single-page site",
      "Teams that need design consistency across multiple products or pages",
    ],
    faqs: [
      { question: "Do you design from scratch or use a template?", answer: "From scratch, built around your brand rather than adapted from a template." },
      { question: "Can our team update pages later without breaking the design?", answer: "Yes, the system is built with reusable components specifically so it stays consistent as your team extends it." },
      { question: "Does this include a full brand identity (logo, etc.)?", answer: "We can work within an existing identity or build one from scratch, depending on what you need." },
    ],
  },
};
