import ServiceApplicationTemplate from "../components/ServiceApplicationTemplate";

export default function EnterpriseSystems() {
  return (
    <ServiceApplicationTemplate
      eyebrow="Enterprise Systems"
      headline="Internal systems built for reliability at scale."
      subtext="For growing businesses that have outgrown spreadsheets and disconnected tools — a properly architected internal system built for your team's real workload."
      whatsIncluded={[
        "Built for scale from day one",
        "Role-based access & permissions",
        "Reporting & business intelligence",
        "Secure data architecture",
        "Long-term support & maintenance",
      ]}
      serviceLabel="Enterprise Systems"
      sourceSlug="enterprise-systems-page"
    />
  );
}
