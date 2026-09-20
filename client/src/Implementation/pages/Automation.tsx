import ServiceApplicationTemplate from "../components/ServiceApplicationTemplate";

export default function Automation() {
  return (
    <ServiceApplicationTemplate
      eyebrow="Automation"
      headline="Automate the manual work that's quietly costing you hours every week."
      subtext="We identify the repetitive, error-prone parts of your operations and build automation that handles them, so your team can focus on work that actually needs a person."
      whatsIncluded={[
        "Workflow & process automation",
        "Integration between your existing tools",
        "Automated notifications & reporting",
        "Reduced manual data entry",
        "Measurable time savings",
      ]}
      serviceLabel="Automation"
      sourceSlug="automation-page"
    />
  );
}
