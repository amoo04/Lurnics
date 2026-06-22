import { Routes, Route } from "react-router-dom";
import Home from "./features/MainPage/pages/Home";
import Services from "./features/MainPage/pages/Services";
import Industries from "./features/MainPage/pages/Industries";
import Solutions from "./features/MainPage/pages/Solutions";
import CaseStudies from "./features/MainPage/pages/CaseStudies";
import About from "./features/MainPage/pages/About";
import Insights from "./features/MainPage/pages/Insights";
import Contact from "./features/MainPage/pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/about" element={<About />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
