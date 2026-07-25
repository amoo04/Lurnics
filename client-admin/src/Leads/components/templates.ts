import type { Lead } from "../api/leads.types";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface ProposalSection {
  id: string;
  label: string;
  body: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  sections: ProposalSection[];
}

export const senderName = "Amoo Oluwasegun";

export const emailTemplates: EmailTemplate[] = [
  {
    id: "cold-intro",
    name: "Cold Introduction",
    subject: "Quick idea for {{company}}",
    body: `Hi {{name}},

I'm {{senderName}} from Lurnics — we build digital infrastructure (software, automation, and systems) for businesses like {{company}}.

I came across {{company}} via {{source}} and thought there might be a fit. We've helped similar businesses streamline operations and build systems that scale.

Would you be open to a short call this week to discuss what you're working on?

Best,
{{senderName}}
Lurnics`,
  },
  {
    id: "discovery-followup",
    name: "Discovery Follow-up",
    subject: "Following up — {{company}} + Lurnics",
    body: `Hi {{name}},

Thanks for taking the time to speak with me about {{company}}'s needs. Based on our conversation, I think we can put together a solid plan to help.

I'll follow up shortly with a proposal outlining scope, timeline, and investment. In the meantime, let me know if anything comes to mind that we should factor in.

Best,
{{senderName}}
Lurnics`,
  },
  {
    id: "proposal-nudge",
    name: "Proposal Sent Follow-up",
    subject: "Checking in on the proposal for {{company}}",
    body: `Hi {{name}},

Just following up on the proposal I sent over for {{company}} (estimated investment: {{value}}). Happy to answer any questions or adjust scope if needed.

Let me know if you'd like to hop on a call to walk through it.

Best,
{{senderName}}
Lurnics`,
  },
];

export const proposalTemplate: ProposalTemplate = {
  id: "standard-proposal",
  name: "Standard Proposal",
  sections: [
    { id: "overview", label: "Overview", body: `This proposal outlines how Lurnics will partner with {{company}} to deliver a digital solution tailored to your needs, based on our discussions.` },
    { id: "scope", label: "Scope of Work", body: `- Discovery & requirements gathering\n- System design and architecture\n- Development and implementation\n- Testing and deployment\n- Post-launch support` },
    { id: "investment", label: "Investment", body: `Estimated investment: {{value}}\n\nPayment structure: 50% deposit, 50% on delivery.` },
    { id: "timeline", label: "Timeline", body: `Estimated delivery: 6-8 weeks from project kickoff, subject to scope confirmation.` },
    { id: "next-steps", label: "Next Steps", body: `To move forward, please confirm acceptance of this proposal and we'll schedule a kickoff call to begin discovery.` },
  ],
};

export function fillTemplate(text: string, lead: Lead): string {
  const fields: Record<string, string> = {
    name: lead.contactPerson,
    company: lead.companyName,
    email: lead.email,
    phone: lead.phone ?? "",
    source: lead.source ?? "",
    value: lead.budgetRange ?? "an amount to be discussed",
    senderName,
  };
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => fields[key] ?? match);
}
