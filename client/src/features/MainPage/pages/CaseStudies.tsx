import { useState } from "react";
import Navbar from "../components/Navbar";
import CaseStudiesHero from "../components/CaseStudiesHero";
import CaseStudyFilters from "../components/CaseStudyFilters";
import CaseStudyList from "../components/CaseStudyList";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import { useCaseStudies, useIndustries } from "../hooks/useContent";

export default function CaseStudies() {
  const [activeIndustryId, setActiveIndustryId] = useState<string | undefined>(undefined);
  const { data: industriesData } = useIndustries();
  const { data, loading, error } = useCaseStudies(activeIndustryId);

  return (
    <>
      <Navbar />
      <CaseStudiesHero />
      <CaseStudyFilters
        industries={industriesData?.items ?? []}
        activeIndustryId={activeIndustryId}
        onSelect={setActiveIndustryId}
      />
      <CaseStudyList caseStudies={data?.items ?? []} loading={loading} error={error} />
      <CtaBanner
        heading="Your success story could be next."
        subtext="Let's build a digital infrastructure that drives real impact for your business."
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Tell us about your project"
        secondaryLayout="inline"
      />
      <Footer />
    </>
  );
}
