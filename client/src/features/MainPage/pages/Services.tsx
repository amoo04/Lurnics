import { Search, Pencil, Code2, Rocket, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import ServicesHero from "../components/ServicesHero";
import CoreServices from "../components/CoreServices";
import Process from "../components/Process";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

const processSteps = [
  { icon: Search, number: "01", title: "Discover", description: "We understand your business, challenges, and goals." },
  { icon: Pencil, number: "02", title: "Strategy", description: "We define the right strategy, roadmap, and solutions." },
  { icon: Code2, number: "03", title: "Engineer", description: "We build scalable, secure, and high-performance systems." },
  { icon: Rocket, number: "04", title: "Deploy", description: "We launch with precision and ensure a smooth transition." },
  { icon: TrendingUp, number: "05", title: "Scale", description: "We monitor, support, and optimize for continuous growth." },
];

export default function Services() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <CoreServices />
      <Process eyebrow="Our Approach" steps={processSteps} />
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
