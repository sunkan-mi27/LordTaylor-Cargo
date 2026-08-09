import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import "../styles/shippingCalculator.css";
import {
  FaCalculator,
  FaArrowRight,
  FaPlaneDeparture,
  FaShieldAlt,
  FaBoxOpen,
} from "react-icons/fa";

const destinations = [
  { city: "London", multiplier: 1.0 },
  { city: "Manchester", multiplier: 1.08 },
  { city: "Birmingham", multiplier: 1.12 },
];

const services = [
  { name: "Express", multiplier: 1.35, days: "2-3 Days" },
  { name: "Priority", multiplier: 1.15, days: "4-5 Days" },
  { name: "Economy", multiplier: 1.0, days: "6-8 Days" },
];

const packageTypes = [
  { name: "Electronics", fee: 18000 },
  { name: "Documents", fee: 5000 },
  { name: "Fashion", fee: 9000 },
  { name: "General Cargo", fee: 12000 },
];

const ShippingCalculator = () => {
  const [weight, setWeight] = useState(5);

  const [destination, setDestination] = useState(destinations[0]);

  const [service, setService] = useState(services[0]);

  const [cargo, setCargo] = useState(packageTypes[0]);

  const estimate = useMemo(() => {
    const base = 18000;

    const total =
      base * weight * destination.multiplier * service.multiplier + cargo.fee;

    return Math.round(total);
  }, [weight, destination, service, cargo]);

  return (
    <section className="calculator-section" id="quote">
      <div className="calculator-glow glow-left"></div>

      <div className="calculator-glow glow-right"></div>

      <div className="calculator-container">
        <motion.div
          className="calculator-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="calculator-tag">
            <FaCalculator />
            Smart Shipping Calculator
          </span>

          <h2>Know Your Shipping Cost Before You Ship.</h2>

          <p>
            Receive an instant estimate for your shipment between Nigeria and
            the United Kingdom.
          </p>
        </motion.div>

        <div className="calculator-grid">
          <motion.div
            className="calculator-card"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="input-group">
              <label>Package Weight (kg)</label>

              <input
                type="range"
                min="1"
                max="50"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />

              <span className="range-value">{weight} kg</span>
            </div>

            <div className="input-group">
              <label>Destination</label>

              <select
                value={destination.city}
                onChange={(e) =>
                  setDestination(
                    destinations.find((item) => item.city === e.target.value),
                  )
                }
              >
                {destinations.map((item) => (
                  <option key={item.city} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Shipping Service</label>

              <select
                value={service.name}
                onChange={(e) =>
                  setService(
                    services.find((item) => item.name === e.target.value),
                  )
                }
              >
                {services.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Package Type</label>

              <select
                value={cargo.name}
                onChange={(e) =>
                  setCargo(
                    packageTypes.find((item) => item.name === e.target.value),
                  )
                }
              >
                {packageTypes.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div
            className="estimate-card"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="estimate-top">
              <div>
                <p>Estimated Shipping Cost</p>

                <h2>₦{estimate.toLocaleString()}</h2>
              </div>

              <div className="estimate-badge">Best Value</div>
            </div>

            <div className="estimate-details">
              <div>
                <FaPlaneDeparture />

                <span>{service.days}</span>
              </div>

              <div>
                <FaShieldAlt />

                <span>Insurance Included</span>
              </div>

              <div>
                <FaBoxOpen />

                <span>Door-to-Door Delivery</span>
              </div>
            </div>

            <div className="estimate-progress">
              <div className="estimate-progress-fill"></div>
            </div>

            <div className="estimate-btn">
              Your Satisfaction
              <FaArrowRight />
            </div>
            <motion.div
              className="assistant-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <div className="assistant-header">
                <div className="assistant-status">
                  <span className="assistant-dot"></span>
                  AI Shipping Assistant
                </div>
              </div>

              <div className="assistant-body">
                <div className="assistant-item">
                  <span>Recommended Route</span>

                  <strong>Lagos → London</strong>
                </div>

                <div className="assistant-item">
                  <span>Estimated Delivery</span>

                  <strong>{service.days}</strong>
                </div>

                <div className="assistant-item">
                  <span>Insurance</span>

                  <strong>Included ✓</strong>
                </div>

                <div className="assistant-item">
                  <span>Tracking</span>

                  <strong>Real-Time Updates</strong>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShippingCalculator;
