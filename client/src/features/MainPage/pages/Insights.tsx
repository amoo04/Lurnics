import Navbar from "../components/Navbar";
import InsightsHero from "../components/InsightsHero";
import InsightFilters from "../components/InsightFilters";
import InsightArticles from "../components/InsightArticles";
import NewsletterBanner from "../components/NewsletterBanner";
import Footer from "../components/Footer";

export default function Insights() {
  return (
    <>
      <Navbar />
      <InsightsHero />
      <InsightFilters />
      <InsightArticles />
      <NewsletterBanner />
      <Footer />
    </>
  );
}
