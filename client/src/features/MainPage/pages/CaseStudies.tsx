import Navbar from "../components/Navbar";
import CaseStudiesHero from "../components/CaseStudiesHero";
import CaseStudyFilters from "../components/CaseStudyFilters";
import CaseStudyList from "../components/CaseStudyList";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function CaseStudies() {
  return (
    <>
      <Navbar />
      <CaseStudiesHero />
      <CaseStudyFilters />
      <CaseStudyList />
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
