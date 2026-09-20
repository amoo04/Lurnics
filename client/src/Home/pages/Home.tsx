import Navbar from "../../components/layout/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import SolutionsCatalog from "../../Solutions/components/SolutionsCatalog";
import IndustryGrid from "../../Industries/components/IndustryGrid";
import Process from "../../Services/components/Process";
import FeaturedSuccessStories from "../../SuccessStories/components/FeaturedSuccessStories";
import WhyLurnics from "../components/WhyLurnics";
import CtaBanner from "../../components/shared/CtaBanner";
import Footer from "../../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <SolutionsCatalog />
      <IndustryGrid />
      <Process />
      <FeaturedSuccessStories />
      <WhyLurnics />
      <CtaBanner />
      <Footer />
    </>
  );
}
