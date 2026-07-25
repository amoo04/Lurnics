import Navbar from "../../components/layout/Navbar";
import SolutionsHero from "../components/SolutionsHero";
import SolutionsCatalog from "../components/SolutionsCatalog";
import TransformationBar from "../components/TransformationBar";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";

export default function Solutions() {
  return (
    <>
      <Navbar />
      <SolutionsHero />
      <SolutionsCatalog />
      <TransformationBar />
      <CtaBanner
        heading="Have a unique challenge?"
        subtext="Let's build a custom solution that gives you a competitive advantage."
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Tell us about your project"
        secondaryLayout="inline"
      />
      <Footer />
    </>
  );
}
