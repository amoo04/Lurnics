import ServiceApplicationTemplate from "../components/ServiceApplicationTemplate";

export default function MarketingWebsites() {
  return (
    <ServiceApplicationTemplate
      eyebrow="Marketing Websites"
      headline="A website built to represent your business and generate leads."
      subtext="Not a template. A marketing website designed around how your business actually sells — clear messaging, real content, and a path for visitors to contact you."
      whatsIncluded={[
        "Custom design & copywriting support",
        "SEO-friendly structure",
        "Contact & lead capture forms",
        "Content management for your team",
        "Hosted on fast, reliable infrastructure",
      ]}
      serviceLabel="Marketing Websites"
      sourceSlug="marketing-websites-page"
    />
  );
}
