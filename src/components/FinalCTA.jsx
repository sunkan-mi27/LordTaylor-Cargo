import { motion } from "framer-motion";
import "../styles/finalCTA.css";
import {
  FaArrowRight,
  FaBox,
  FaPlaneDeparture,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaBox />,
    value: "24K+",
    label: "Deliveries",
  },
  {
    icon: <FaPlaneDeparture />,
    value: "98.9%",
    label: "Success Rate",
  },
  {
    icon: <FaShieldAlt />,
    value: "100%",
    label: "Secure Shipping",
  },
  {
    icon: <FaClock />,
    value: "24/7",
    label: "Support",
  },
];

const FinalCTA = () => {
  return (
    <section className="final-cta" id="booking">
      <div className="cta-glow glow-left"></div>

      <div className="cta-glow glow-right"></div>

      <div className="cta-container">
        <motion.div
          className="cta-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="cta-tag">Ready To Ship?</span>

          <h2>Ship Between Nigeria & The UK With Complete Confidence.</h2>

          <p>
            Fast delivery, transparent tracking and secure logistics trusted by
            thousands of businesses and families every year.
          </p>

          <div className="cta-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="primary-cta"
            >
              Track Shipment
              <FaArrowRight />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="secondary-cta"
            >
              Get Instant Quote
            </motion.button>
          </div>

          <div className="cta-stats">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                className="cta-stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,

                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <div className="cta-stat-icon">{item.icon}</div>

                <div className="cta-stat-info">
                  <h3>{item.value}</h3>

                  <span>{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="cta-route">
            <div className="route-dot nigeria"></div>

            <div className="route-line"></div>

            <div className="route-plane">
              <FaPlaneDeparture />
            </div>

            <div className="route-dot uk"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
