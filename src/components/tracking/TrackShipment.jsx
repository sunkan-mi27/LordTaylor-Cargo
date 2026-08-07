import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMagnifyingGlass,
  FaPlaneDeparture,
  FaBox,
  FaClock,
  FaShield,
  FaLocationDot,
} from "react-icons/fa6";

import "./TrackShipment.css";
import TrackEmptyState from "./TrackEmptyState";

const timeline = [
  {
    title: "Shipment Received",
    location: "London Warehouse",
    completed: true,
  },
  {
    title: "Customs Cleared",
    location: "United Kingdom",
    completed: true,
  },
  {
    title: "In Transit",
    location: "Over Atlantic Ocean",
    active: true,
  },
  {
    title: "Arrival Scan",
    location: "Lagos Hub",
  },
  {
    title: "Delivered",
    location: "Customer Address",
  },
];

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setShipment(null);
    setNotFound(false);
    setSearchComplete(false);
    const bookings =
      JSON.parse(localStorage.getItem("lordtaylor-bookings")) || [];

    setTimeout(() => {
      const found = bookings.find(
        (item) =>
          item.bookingId.toLowerCase() === trackingNumber.trim().toLowerCase(),
      );

      if (found) {
        setShipment(found);

        setNotFound(false);
      } else {
        setShipment(null);

        setNotFound(true);
      }

      setLoading(false);

      setSearchComplete(true);
    }, 1500);
  };

  const progress = shipment?.progress || 55;

  return (
    <section className="tracking-page">
      <div className="tracking-container">
        {/* HERO */}

        <motion.div
          className="tracking-hero"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="tracking-tag">Live Shipment Tracking</span>

          <h1>Track Every Shipment</h1>

          <p>
            Enter your booking ID below to monitor your shipment from pickup in
            the United Kingdom until final delivery in Nigeria.
          </p>
        </motion.div>

        {/* SEARCH */}

        <motion.div
          className="tracking-search"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Enter Booking ID"
            value={trackingNumber}
            disabled={loading}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />

          <button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              <>
                <FaMagnifyingGlass />
                Track Shipment
              </>
            )}
          </button>
        </motion.div>

        {searchComplete && notFound && (
          <TrackEmptyState
            onRetry={() => {
              setTrackingNumber("");
              setNotFound(false);
              setSearchComplete(false);
            }}
          />
        )}
        {shipment && (
          <>
            <div className="tracking-grid">
              {/* SHIPMENT OVERVIEW */}

              <motion.div
                className="overview-card"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="card-header">
                  <h2>Shipment Overview</h2>

                  <div className="status-pill">
                    <FaPlaneDeparture />
                    <span>{shipment.status}</span>
                  </div>
                </div>

                <div className="overview-grid">
                  <div className="overview-item">
                    <FaBox />

                    <div>
                      <span>Tracking Number</span>
                      <h4>{shipment.bookingId}</h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaClock />

                    <div>
                      <span>Estimated Arrival</span>
                      <h4>{shipment.eta}</h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaPlaneDeparture />

                    <div>
                      <span>Service</span>
                      <h4>{shipment.service}</h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaShield />

                    <div>
                      <span>Insurance</span>
                      <h4>Covered</h4>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* LIVE ROUTE */}

              <motion.div
                className="route-card"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2>Live Route</h2>

                <div className="route-wrapper">
                  <div className="country">
                    <h3>🇬🇧</h3>

                    <span>{shipment.pickup}</span>
                  </div>

                  <div className="flight-line">
                    <div
                      className="flight-progress"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                    <div
                      className="plane"
                      style={{
                        left: `${progress}%`,
                      }}
                    >
                      ✈️
                    </div>
                  </div>

                  <div className="country">
                    <h3>🇳🇬</h3>

                    <span>{shipment.destination}</span>
                  </div>
                </div>

                <div className="progress-box">
                  <div className="progress-top">
                    <span>Delivery Progress</span>

                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progress}%`,
                      }}
                      transition={{
                        duration: 1,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="tracking-bottom">
              {/* TIMELINE */}

              <motion.div
                className="timeline-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2>Shipment Timeline</h2>

                <div className="timeline">
                  {timeline.map((step, index) => (
                    <div
                      key={index}
                      className={`timeline-item ${
                        step.completed
                          ? "completed"
                          : step.active
                            ? "active"
                            : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>

                      <div className="timeline-content">
                        <h4>{step.title}</h4>

                        <p>
                          <FaLocationDot />

                          {step.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CURRENT STATUS */}

              <motion.div
                className="status-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h2>Current Shipment Status</h2>

                <div className="status-live">
                  <div className="status-pulse"></div>

                  <span>{shipment.status}</span>
                </div>

                <div className="status-details">
                  <div className="status-row">
                    <span>Current Route</span>

                    <strong>
                      {shipment.pickup} → {shipment.destination}
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Tracking Number</span>

                    <strong>{shipment.bookingId}</strong>
                  </div>

                  <div className="status-row">
                    <span>Estimated Arrival</span>

                    <strong>{shipment.eta}</strong>
                  </div>

                  <div className="status-row">
                    <span>Service</span>

                    <strong>{shipment.service}</strong>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TrackShipment;
