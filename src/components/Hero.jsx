import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import {
  FaArrowRight,
  FaBoxOpen,
  FaPlaneDeparture,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

const Hero = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [shipmentCount, setShipmentCount] = useState(126);

  const [progress, setProgress] = useState(72);

  const [eta, setEta] = useState("2 Days");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setShipmentCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;

        const next = prev + change;

        if (next < 121) return 121;

        if (next > 132) return 132;

        return next;
      });

      setProgress((prev) => {
        const next = prev + 1;

        return next > 100 ? 72 : next;
      });

      setEta((prev) => (prev === "2 Days" ? "3 Days" : "2 Days"));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMouse({
      x: e.clientX - rect.left,

      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="hero" onMouseMove={handleMouseMove} id="home">
      <div
        className="mouse-light"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      ></div>

      <div className="hero-gradient gradient-one"></div>

      <div className="hero-gradient gradient-two"></div>

      <div className="particles">
        {Array.from({ length: 35 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          ></span>
        ))}
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="hero-badge">
            <FaShieldAlt />
            Trusted International Cargo Logistics
          </div>

          <h1>
            Moving Cargo.
            <br />
            Building Trust.
            <br />
            Across Borders.
          </h1>

          <p>
            Premium cargo logistics connecting Nigeria and the United Kingdom
            through secure delivery, transparent tracking and exceptional
            customer experience.
          </p>

          <div className="hero-highlights">
            <div className="highlight">
              <FaHeadset />

              <div>
                <h3>24/7</h3>

                <span>Support</span>
              </div>
            </div>

            <div className="highlight">
              <FaCheckCircle />

              <div>
                <h3>98.9%</h3>

                <span>Success Rate</span>
              </div>
            </div>

            <div className="highlight">
              <FaBoxOpen />

              <div>
                <h3>{shipmentCount}</h3>

                <span>Today's Shipments</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="command-center">
            <div className="command-top">
              <div className="live-indicator">
                <span className="live-pulse"></span>
                LIVE OPERATIONS
              </div>

              <div className="system-status">Online</div>
            </div>

            <div className="tracking-card">
              <div className="tracking-header">
                <h3>Shipment Tracking</h3>

                <span>#LT-2026-04821</span>
              </div>

              <div className="tracking-progress">
                <div className="progress-header">
                  <span>Delivery Progress</span>

                  <strong>{progress}%</strong>
                </div>

                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                  />
                </div>
              </div>

              <div className="tracking-timeline">
                <div className="timeline-item active">
                  <div className="timeline-icon">
                    <FaBoxOpen />
                  </div>

                  <div>
                    <h4>Parcel Received</h4>

                    <span>Lagos Warehouse</span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-item active">
                  <div className="timeline-icon">
                    <FaPlaneDeparture />
                  </div>

                  <div>
                    <h4>International Flight</h4>

                    <span>Currently In Transit</span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-item">
                  <div className="timeline-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h4>London Office</h4>

                    <span>Awaiting Arrival</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <FaClock />

                <div>
                  <span>ETA</span>

                  <strong>{eta}</strong>
                </div>
              </div>

              <div className="dashboard-card">
                <FaCheckCircle />

                <div>
                  <span>Status</span>

                  <strong>On Schedule</strong>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="floating-card floating-one"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          >
            <div className="floating-icon">
              <FaBoxOpen />
            </div>

            <div>
              <h4>126</h4>

              <span>Today's Shipments</span>
            </div>
          </motion.div>

          <motion.div
            className="floating-card floating-two"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
          >
            <div className="floating-icon">
              <FaPlaneDeparture />
            </div>

            <div>
              <h4>14</h4>

              <span>Flights Today</span>
            </div>
          </motion.div>

          <motion.div
            className="floating-card floating-three"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
          >
            <div className="floating-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h4>Secure</h4>

              <span>Customs Cleared</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
