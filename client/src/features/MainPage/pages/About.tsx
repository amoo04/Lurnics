import Navbar from "../components/Navbar";
import AboutHero from "../components/AboutHero";
import MissionVision from "../components/MissionVision";
import ValuesGrid from "../components/ValuesGrid";
import FounderProfile from "../components/FounderProfile";
import TeamGrid from "../components/TeamGrid";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <MissionVision />
      <ValuesGrid />
      <FounderProfile />
      <TeamGrid />
      <CtaBanner
        heading="Let's build something exceptional together."
        subtext="Ready to transform your business with the right technology?"
        primaryLabel="Book a Strategy Session"
        secondaryLabel="Contact Us"
        secondaryLayout="buttons"
      />
      <Footer />
    </>
  );
}
