import Navbar from "../../components/layout/Navbar";
import ContactHero from "../components/ContactHero";
import ContactMethods from "../components/ContactMethods";
import ContactForm from "../components/ContactForm";
import ContactInfoGrid from "../components/ContactInfoGrid";
import Footer from "../../components/layout/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <section className="grid gap-6 px-4 sm:px-8 md:px-20 pb-10 lg:grid-cols-2">
        <ContactMethods />
        <ContactForm />
      </section>
      <ContactInfoGrid />
      <Footer />
    </>
  );
}
