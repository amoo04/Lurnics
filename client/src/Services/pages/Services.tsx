import Navbar from "../../components/layout/Navbar";
import ServicesHero from "../components/ServicesHero";
import CoreServices from "../components/CoreServices";
import Process from "../components/Process";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";

export default function Services() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <CoreServices />
      <Process eyebrow="Our Approach" />
      <CtaBanner
        heading="Ready to build the systems your business needs to scale?"
        subtext="Let's turn your ideas into digital infrastructure that drives measurable growth."
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Or talk to our team"
      />
      <Footer />
    </>
  );
}
