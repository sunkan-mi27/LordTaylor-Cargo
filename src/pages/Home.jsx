import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LiveShipment from "../components/LiveShipment";
import TrustSection from "../components/TrustSection";
import ShippingCalculator from "../components/ShippingCalculator";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

import "../styles/global.css";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <LiveShipment />
      <TrustSection />
      <ShippingCalculator />
      <Services />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Home;
