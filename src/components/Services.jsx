import { motion } from "framer-motion";
import "../styles/services.css";
import {
  FaArrowRight,
  FaPlaneDeparture,
  FaBoxOpen,
  FaMapMarkedAlt,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    id: 1,
    title: "Business Logistics",
    icon: <FaBuilding />,
    featured: true,
    description:
      "Reliable logistics solutions designed for growing businesses shipping between Nigeria and the United Kingdom.",

    features: [
      "Dedicated Account Manager",
      "Priority Cargo Handling",
      "Business Discounts",
    ],
  },

  {
    id: 2,
    title: "Express Shipping",
    icon: <FaPlaneDeparture />,
    description:
      "Fast and secure express deliveries with priority handling and rapid customs processing.",

    features: ["2–3 Day Delivery", "Express Processing", "Real-Time Updates"],
  },

  {
    id: 3,
    title: "Live Tracking",
    icon: <FaMapMarkedAlt />,
    description:
      "Track every shipment from pickup to delivery with accurate real-time updates.",

    features: ["GPS Tracking", "Instant Notifications", "Delivery Timeline"],
  },

  {
    id: 4,
    title: "Air Cargo",
    icon: <FaBoxOpen />,
    description:
      "Affordable and dependable cargo transportation for personal and commercial shipments.",

    features: ["Door-to-Door", "Secure Packaging", "Insured Delivery"],
  },
];

const Services = () => {
  return (
    <section className="services-section" id="quote">
      <div className="services-glow glow-left"></div>

      <div className="services-glow glow-right"></div>

      <div className="services-container">
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="services-tag">Premium Logistics Services</span>

          <h2>Built For Every Shipping Need.</h2>

          <p>
            Whether you're sending personal packages or managing business
            logistics, we've designed services that prioritize speed,
            transparency and peace of mind.
          </p>
        </motion.div>

        <div className="services-grid">
          {/* Featured Service */}

          <motion.div
            className="service-card featured"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10 }}
          >
            <div className="service-icon featured-icon">{services[0].icon}</div>

            <span className="featured-badge">Featured Solution</span>

            <h3>{services[0].title}</h3>

            <p>{services[0].description}</p>

            <div className="service-features">
              {services[0].features.map((item, index) => (
                <div key={index} className="feature">
                  <FaCheckCircle />

                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="service-bg-animation"></div>
          </motion.div>

          {/* Right Column */}

          <div className="services-side">
            {services.slice(1).map((service, index) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,

                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <div className="service-icon">{service.icon}</div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <div className="service-features">
                  {service.features.map((feature, i) => (
                    <div key={i} className="feature">
                      <FaCheckCircle />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="service-bg-animation"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
