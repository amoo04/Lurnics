import { Routes, Route } from "react-router-dom";
import Home from "./Home/pages/Home";
import Services from "./Services/pages/Services";
import Industries from "./Industries/pages/Industries";
import Solutions from "./Solutions/pages/Solutions";
import SolutionDetail from "./Solutions/pages/SolutionDetail";
import CaseStudies from "./SuccessStories/pages/CaseStudies";
import CaseStudyDetail from "./SuccessStories/pages/CaseStudyDetail";
import About from "./About/pages/About";
import Insights from "./Insights/pages/Insights";
import Insight from "./Insights/pages/Insight";
import Contact from "./Contact/pages/Contact";
import Pricing from "./Pricing/pages/Pricing";
import GrowthBlueprint from "./GrowthBlueprint/pages/GrowthBlueprint";
import LeakCalculator from "./LeakCalculator/pages/LeakCalculator";
import SoftwareCostEstimator from "./SoftwareCostEstimator/pages/SoftwareCostEstimator";
import RequirementsGenerator from "./RequirementsGenerator/pages/RequirementsGenerator";
import LandingPages from "./Implementation/pages/LandingPages";
import MarketingWebsites from "./Implementation/pages/MarketingWebsites";
import BusinessSoftware from "./Implementation/pages/BusinessSoftware";
import Automation from "./Implementation/pages/Automation";
import EnterpriseSystems from "./Implementation/pages/EnterpriseSystems";
import SignUp from "./Dashboard/pages/SignUp";
import SignIn from "./Dashboard/pages/SignIn";
import Dashboard from "./Dashboard/pages/Dashboard";
import DashboardSettings from "./Dashboard/pages/Settings";
import Orders from "./Dashboard/pages/Orders";
import Products from "./Dashboard/pages/Products";
import Collections from "./Dashboard/pages/Collections";
import Inventory from "./Dashboard/pages/Inventory";
import Customers from "./Dashboard/pages/Customers";
import Discounts from "./Dashboard/pages/Discounts";
import GiftCards from "./Dashboard/pages/GiftCards";
import AbandonedCart from "./Dashboard/pages/AbandonedCart";
import EmailMarketing from "./Dashboard/pages/EmailMarketing";
import EmailTemplates from "./Dashboard/pages/EmailTemplates";
import ComingSoon from "./Dashboard/pages/ComingSoon";
import Pages from "./Dashboard/pages/Pages";
import StoreBuilder from "./Dashboard/pages/StoreBuilder";
import Themes from "./Dashboard/pages/Themes";
import SEO from "./Dashboard/pages/SEO";
import Domains from "./Dashboard/pages/Domains";
import Navigation from "./Dashboard/pages/Navigation";
import DashboardBlog from "./Dashboard/pages/Blog";
import ProtectedRoute from "./Dashboard/components/ProtectedRoute";
import Store from "./Storefront/pages/Store";
import Shop from "./Storefront/pages/Shop";
import CollectionPage from "./Storefront/pages/CollectionPage";
import StorePage from "./Storefront/pages/StorePage";
import StorefrontBlog from "./Storefront/pages/Blog";
import BlogPost from "./Storefront/pages/BlogPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:slug" element={<Insight />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/growth-blueprint" element={<GrowthBlueprint />} />
      <Route path="/leak-calculator" element={<LeakCalculator />} />
      <Route path="/software-cost-estimator" element={<SoftwareCostEstimator />} />
      <Route path="/requirements-generator" element={<RequirementsGenerator />} />
      <Route path="/landing-pages" element={<LandingPages />} />
      <Route path="/marketing-websites" element={<MarketingWebsites />} />
      <Route path="/business-software" element={<BusinessSoftware />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/enterprise-systems" element={<EnterpriseSystems />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/portal" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/portal/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
      <Route path="/portal/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/portal/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/portal/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
      <Route path="/portal/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/portal/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/portal/discounts" element={<ProtectedRoute><Discounts /></ProtectedRoute>} />
      <Route path="/portal/gift-cards" element={<ProtectedRoute><GiftCards /></ProtectedRoute>} />
      <Route path="/portal/abandoned-cart" element={<ProtectedRoute><AbandonedCart /></ProtectedRoute>} />
      <Route path="/portal/email-marketing" element={<ProtectedRoute><EmailMarketing /></ProtectedRoute>} />
      <Route path="/portal/email-templates" element={<ProtectedRoute><EmailTemplates /></ProtectedRoute>} />
      <Route path="/portal/coming-soon" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
      <Route path="/portal/pages" element={<ProtectedRoute><Pages /></ProtectedRoute>} />
      <Route path="/portal/store-builder" element={<ProtectedRoute><StoreBuilder /></ProtectedRoute>} />
      <Route path="/portal/themes" element={<ProtectedRoute><Themes /></ProtectedRoute>} />
      <Route path="/portal/seo" element={<ProtectedRoute><SEO /></ProtectedRoute>} />
      <Route path="/portal/domains" element={<ProtectedRoute><Domains /></ProtectedRoute>} />
      <Route path="/portal/navigation" element={<ProtectedRoute><Navigation /></ProtectedRoute>} />
      <Route path="/portal/blog" element={<ProtectedRoute><DashboardBlog /></ProtectedRoute>} />
      <Route path="/store/:slug" element={<Store />} />
      <Route path="/store/:slug/shop" element={<Shop />} />
      <Route path="/store/:slug/collections/:collectionSlug" element={<CollectionPage />} />
      <Route path="/store/:slug/pages/:pageSlug" element={<StorePage />} />
      <Route path="/store/:slug/blog" element={<StorefrontBlog />} />
      <Route path="/store/:slug/blog/:postSlug" element={<BlogPost />} />
    </Routes>
  );
}

export default App;
