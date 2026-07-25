import Navbar from "../../components/layout/Navbar";
import IndustriesHero from "../components/IndustriesHero";
import IndustryGrid from "../components/IndustryGrid";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";

export default function Industries() {
  return (
    <>
      <Navbar />
      <IndustriesHero />
      <IndustryGrid />
      <CtaBanner
        heading="Don't see your industry?"
        subtext="We build custom solutions for any industry. Let's discuss how we can help your business grow."
        primaryLabel="Talk to Our Experts"
      />
      <Footer />
    </>
  );
}
