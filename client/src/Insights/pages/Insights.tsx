import Navbar from "../../components/layout/Navbar";
import InsightsHero from "../components/InsightsHero";
import InsightArticles from "../components/InsightArticles";
import NewsletterBanner from "../components/NewsletterBanner";
import Footer from "../../components/layout/Footer";

export default function Insights() {
  return (
    <>
      <Navbar />
      <InsightsHero />
      <InsightArticles />
      <NewsletterBanner />
      <Footer />
    </>
  );
}
