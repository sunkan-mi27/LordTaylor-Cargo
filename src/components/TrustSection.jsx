import { motion } from "framer-motion";
import "../styles/trustSection.css";
import {
  FaShieldAlt,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

const trustCards = [
  {
    icon: <FaShieldAlt />,
    title: "Secure Handling",
    text: "Every shipment is professionally handled, protected and monitored from pickup to final delivery.",
    color: "blue",
  },
  {
    icon: <FaPlaneDeparture />,
    title: "Fast Air Freight",
    text: "Express air cargo connecting Nigeria and the United Kingdom with reliable schedules.",
    color: "gold",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Real-Time Tracking",
    text: "Know exactly where your shipment is with live tracking updates and delivery progress.",
    color: "green",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Customer Support",
    text: "Friendly support is always available whenever you need shipment assistance.",
    color: "purple",
  },
];

const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="trust-blur blur-left"></div>

      <div className="trust-blur blur-right"></div>

      <div className="trust-container">
        <motion.div
          className="trust-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="trust-tag">Why Companies Trust Us</span>

          <h2>Trusted By Businesses Built Around Reliability.</h2>

          <p>
            Thousands of successful shipments, transparent tracking and
            dependable logistics between Nigeria and the United Kingdom.
          </p>
        </motion.div>

        <div className="trust-stats">
          <div className="stat-box">
            <h3>98.9%</h3>

            <span>Delivery Success</span>
          </div>

          <div className="stat-box">
            <h3>24K+</h3>

            <span>Shipments Completed</span>
          </div>

          <div className="stat-box">
            <h3>11+</h3>

            <span>Years Experience</span>
          </div>

          <div className="stat-box">
            <h3>24/7</h3>

            <span>Support</span>
          </div>
        </div>

        <div className="trust-grid">
          {trustCards.map((card, index) => (
            <motion.div
              key={index}
              className={`trust-card ${card.color}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -12,
              }}
            >
              <div className="trust-icon">{card.icon}</div>

              <h3>{card.title}</h3>

              <p>{card.text}</p>

              <div className="trust-footer">
                <span>Learn More</span>

                <FaArrowRight />
              </div>

              <div className="trust-glow"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="trust-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="banner-content">
            <h3>Your Cargo. Our Commitment.</h3>

            <p>
              Reliable logistics solutions designed for businesses, families and
              international trade between Nigeria and the United Kingdom.
            </p>
          </div>

          <button className="banner-btn">
            Start Shipping
            <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
