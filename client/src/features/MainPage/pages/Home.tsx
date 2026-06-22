// pages/Home.tsx

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Solutions from "../components/Solutions";
import Industries from "../components/Industries";
import Process from "../components/Process";
import CaseStudies from "../components/CaseStudies";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Solutions />
      <Industries />
      <Process />
      <CaseStudies />
      <CtaBanner />
      <Footer />
    </>
  );
}
