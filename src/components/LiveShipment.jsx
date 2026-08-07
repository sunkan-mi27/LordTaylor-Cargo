import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/liveShipment.css";
import {
  FaBoxOpen,
  FaWarehouse,
  FaPlaneDeparture,
  FaClipboardCheck,
  FaTruck,
  FaCheckCircle,
  FaArrowRight,
  FaSatellite,
} from "react-icons/fa";

const shipmentStages = [
  {
    icon: <FaBoxOpen />,
    title: "Parcel Picked Up",
    location: "Lagos, Nigeria",
  },
  {
    icon: <FaWarehouse />,
    title: "Warehouse Processing",
    location: "Lagos Hub",
  },
  {
    icon: <FaPlaneDeparture />,
    title: "International Flight",
    location: "In Transit",
  },
  {
    icon: <FaClipboardCheck />,
    title: "UK Customs",
    location: "London",
  },
  {
    icon: <FaTruck />,
    title: "Out For Delivery",
    location: "London",
  },
  {
    icon: <FaCheckCircle />,
    title: "Delivered",
    location: "Recipient",
  },
];

const LiveShipment = () => {
  const [activeStage, setActiveStage] = useState(2);

  const [progress, setProgress] = useState(58);

  const [trackingId] = useState("LT-2048-UK");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= shipmentStages.length - 1) {
          setProgress(15);

          return 0;
        }

        setProgress((prevProgress) => Math.min(prevProgress + 14, 100));

        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mission-control" id="tracking">
      <div className="mission-blur blur-one"></div>

      <div className="mission-blur blur-two"></div>

      <div className="mission-container">
        <motion.div
          className="mission-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-tag">
            <FaSatellite />
            Mission Control
          </div>

          <h2>Watch Every Shipment Move Across Borders In Real Time.</h2>

          <p>
            From pickup in Lagos to final delivery in the United Kingdom, every
            shipment is monitored with complete visibility, giving customers
            confidence at every stage.
          </p>
        </motion.div>

        <div className="mission-grid">
          <motion.div
            className="journey-panel"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="journey-top">
              <h3>Shipment Journey</h3>

              <span>{trackingId}</span>
            </div>

            <div className="journey-track">
              <motion.div
                className="journey-progress"
                animate={{
                  height: `${progress}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
              />

              {shipmentStages.map((stage, index) => (
                <motion.div
                  key={index}
                  className={`checkpoint ${
                    index <= activeStage ? "active" : ""
                  } ${index === activeStage ? "current" : ""}`}
                  whileHover={{
                    scale: 1.04,
                  }}
                >
                  <div className="checkpoint-icon">{stage.icon}</div>

                  <div className="checkpoint-info">
                    <h4>{stage.title}</h4>

                    <span>{stage.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="control-panel"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="control-header">
              <div>
                <p>Shipment ID</p>

                <h3>{trackingId}</h3>
              </div>

              <div className="live-chip">
                <span></span>
                LIVE
              </div>
            </div>

            <div className="cargo-card">
              <h4>Current Cargo</h4>

              <strong>Apple MacBook Pro Package</strong>
            </div>

            <div className="status-grid">
              <div className="status-box">
                <p>Current Status</p>

                <strong>In Transit</strong>
              </div>

              <div className="status-box">
                <p>Estimated Arrival</p>

                <strong>Tuesday</strong>
              </div>

              <div className="status-box">
                <p>Current Hub</p>

                <strong>London Heathrow</strong>
              </div>

              <div className="status-box">
                <p>Package Weight</p>

                <strong>4.8 kg</strong>
              </div>
            </div>

            <div className="shipment-progress-card">
              <div className="shipment-progress-top">
                <span>Overall Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="shipment-progress-bar">
                <motion.div
                  className="shipment-progress-fill"
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                ></motion.div>
              </div>
            </div>

            <div className="mission-footer">
              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="track-button"
              >
                Track Shipment
                <FaArrowRight />
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            className="floating-info weather-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
          >
            <div className="floating-dot"></div>

            <div>
              <small>Weather</small>
              <h4>Clear Skies</h4>
              <span>London • 21°C</span>
            </div>
          </motion.div>

          <motion.div
            className="floating-info customs-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
          >
            <div className="floating-dot success"></div>

            <div>
              <small>Customs</small>
              <h4>Cleared</h4>
              <span>No Delays Detected</span>
            </div>
          </motion.div>

          <motion.div
            className="floating-info insurance-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -8 }}
          >
            <div className="floating-dot premium"></div>

            <div>
              <small>Protection</small>
              <h4>Fully Insured</h4>
              <span>Premium Cargo Cover</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveShipment;
