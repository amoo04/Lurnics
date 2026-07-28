import ServiceApplicationTemplate from "../components/ServiceApplicationTemplate";

export default function BusinessSoftware() {
  return (
    <ServiceApplicationTemplate
      eyebrow="Business Software"
      headline="Custom software built around how your business actually runs."
      subtext="Internal tools, dashboards, and applications designed for your specific workflows, not a generic off-the-shelf tool you have to work around."
      whatsIncluded={[
        "Built around your actual processes",
        "Secure user accounts & permissions",
        "Integrates with your existing tools",
        "Scales as your team grows",
        "Ongoing support after launch",
      ]}
      serviceLabel="Business Software"
      sourceSlug="business-software-page"
    />
  );
}
