import { Routes, Route } from "react-router-dom";
import Home from "./features/MainPage/pages/Home";
import Services from "./features/MainPage/pages/Services";
import Industries from "./features/MainPage/pages/Industries";
import Solutions from "./features/MainPage/pages/Solutions";
import SolutionDetail from "./features/MainPage/pages/SolutionDetail";
import CaseStudies from "./features/MainPage/pages/CaseStudies";
import CaseStudyDetail from "./features/MainPage/pages/CaseStudyDetail";
import About from "./features/MainPage/pages/About";
import Insights from "./features/MainPage/pages/Insights";
import Insight from "./features/MainPage/pages/Insight";
import Contact from "./features/MainPage/pages/Contact";

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
    </Routes>
  );
}

export default App;
