import { motion } from "framer-motion";
import "../styles/footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaShield,
  FaBox,
  FaPlaneDeparture,
} from "react-icons/fa6";

const quickLinks = ["Home", "Track Shipment", "Services", "Pricing", "Contact"];

const serviceLinks = [
  "Express Shipping",
  "Air Cargo",
  "Business Logistics",
  "Live Tracking",
  "Warehousing",
];

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-glow glow-left"></div>

      <div className="footer-glow glow-right"></div>

      <div className="footer-container">
        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="footer-brand">
            <div className="footer-logo">
              <FaPlaneDeparture />
            </div>

            <h2>
              Cargo<span>Link</span>
            </h2>

            <p>
              Premium logistics connecting Nigeria and the United Kingdom
              through fast, secure and transparent shipping solutions trusted by
              businesses and families.
            </p>

            <div className="socials">
              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaLinkedinIn />
              </a>

              <a href="#">
                <FaXTwitter />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h4>Quick Links</h4>

              <ul>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Services</h4>

              <ul>
                {serviceLinks.map((service, index) => (
                  <li key={index}>
                    <a href="#">{service}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>

              <ul className="contact-list">
                <li>
                  <FaLocationDot />

                  <span>Lagos, Nigeria</span>
                </li>

                <li>
                  <FaLocationDot />

                  <span>London, United Kingdom</span>
                </li>

                <li>
                  <FaPhone />

                  <span>+44 XXXX XXX XXX</span>
                </li>

                <li>
                  <FaEnvelope />

                  <span>support@cargolink.com</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="footer-middle"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="newsletter">
            <h3>Stay Updated</h3>

            <p>
              Receive shipping updates, exclusive offers and logistics insights.
            </p>

            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />

              <button>
                Subscribe
                <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <FaShield />

              <div>
                <h5>Secure Shipping</h5>

                <span>Fully protected deliveries</span>
              </div>
            </div>

            <div className="badge">
              <FaPlaneDeparture />

              <div>
                <h5>Fast Delivery</h5>

                <span>Nigeria ↔ United Kingdom</span>
              </div>
            </div>

            <div className="badge">
              <FaBox />

              <div>
                <h5>Insured Cargo</h5>

                <span>Business & Personal Goods</span>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="footer-route">
            <span>🇳🇬 Nigeria</span>

            <div className="route-line">
              <div className="route-plane">
                <FaPlaneDeparture />
              </div>
            </div>

            <span>🇬🇧 United Kingdom</span>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} CargoLink. All Rights Reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
