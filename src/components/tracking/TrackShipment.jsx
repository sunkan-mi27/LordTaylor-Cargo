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

import shipments from "../../data/shipments";

import "./TrackShipment.css";
import TrackEmptyState from "./TrackEmptyState";

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const searchValue = trackingNumber.trim();

    if (!searchValue) return;

    setLoading(true);
    setShipment(null);
    setNotFound(false);
    setSearchComplete(false);

    setTimeout(() => {
      const found = shipments.find(
        (item) =>
          item.trackingNumber.toLowerCase() === searchValue.toLowerCase(),
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
    }, 800);
  };

  const getProgress = (currentShipment) => {
    if (!currentShipment) return 0;

    const completedSteps = currentShipment.timeline.filter(
      (step) => step.completed,
    ).length;

    const totalSteps = currentShipment.timeline.length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  const progress = getProgress(shipment);

  return (
    <section className="tracking-page">
      <div className="tracking-container">
        {/* HERO */}

        <motion.div
          className="tracking-hero"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <span className="tracking-tag">Live Shipment Tracking</span>

          <h1>Track Every Shipment</h1>

          <p>
            Enter your tracking number below to monitor your shipment from
            pickup until final delivery.
          </p>
        </motion.div>

        {/* SEARCH */}

        <motion.div
          className="tracking-search"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            disabled={loading}
            onChange={(event) => setTrackingNumber(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
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

        {/* NOT FOUND */}

        {searchComplete && notFound && (
          <TrackEmptyState
            onRetry={() => {
              setTrackingNumber("");
              setNotFound(false);
              setSearchComplete(false);
              setShipment(null);
            }}
          />
        )}

        {/* SHIPMENT RESULT */}

        {shipment && (
          <>
            {/* OVERVIEW + ROUTE */}

            <div className="tracking-grid">
              {/* SHIPMENT OVERVIEW */}

              <motion.div
                className="overview-card"
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <div className="card-header">
                  <h2>Shipment Overview</h2>

                  <div className="status-pill">
                    <FaPlaneDeparture />

                    <span>{shipment.status}</span>
                  </div>
                </div>

                <div className="overview-grid">
                  {/* TRACKING NUMBER */}

                  <div className="overview-item">
                    <FaBox />

                    <div>
                      <span>Tracking Number</span>

                      <h4>{shipment.trackingNumber}</h4>
                    </div>
                  </div>

                  {/* ESTIMATED ARRIVAL */}

                  <div className="overview-item">
                    <FaClock />

                    <div>
                      <span>Estimated Arrival</span>

                      <h4>{shipment.estimatedDelivery}</h4>
                    </div>
                  </div>

                  {/* SERVICE */}

                  <div className="overview-item">
                    <FaPlaneDeparture />

                    <div>
                      <span>Service</span>

                      <h4>{shipment.shippingMethod}</h4>
                    </div>
                  </div>

                  {/* INSURANCE */}

                  <div className="overview-item">
                    <FaShield />

                    <div>
                      <span>Package</span>

                      <h4>{shipment.package.type}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* LIVE ROUTE */}

              <motion.div
                className="route-card"
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <h2>Live Route</h2>

                <div className="route-wrapper">
                  <div className="country">
                    <h3>🇳🇬</h3>

                    <span>{shipment.origin}</span>
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
                    <h3>🇬🇧</h3>

                    <span>{shipment.destination}</span>
                  </div>
                </div>

                {/* PROGRESS */}

                <div className="progress-box">
                  <div className="progress-top">
                    <span>Delivery Progress</span>

                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{
                        width: 0,
                      }}
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

            {/* BOTTOM */}

            <div className="tracking-bottom">
              {/* TIMELINE */}

              <motion.div
                className="timeline-card"
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >
                <h2>Shipment Timeline</h2>

                <div className="timeline">
                  {shipment.timeline.map((step, index) => {
                    const previousCompleted =
                      shipment.timeline[index - 1]?.completed;

                    const isActive = !step.completed && previousCompleted;

                    return (
                      <div
                        key={`${step.title}-${index}`}
                        className={`timeline-item ${
                          step.completed
                            ? "completed"
                            : isActive
                              ? "active"
                              : ""
                        }`}
                      >
                        <div className="timeline-dot" />

                        <div className="timeline-content">
                          <h4>{step.title}</h4>

                          <p>
                            <FaLocationDot />

                            {step.location}
                          </p>

                          <small>
                            {step.date}
                            {" • "}
                            {step.time}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* CURRENT STATUS */}

              <motion.div
                className="status-card"
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                }}
              >
                <h2>Current Shipment Status</h2>

                <div className="status-live">
                  <div className="status-pulse" />

                  <span>{shipment.status}</span>
                </div>

                <div className="status-details">
                  <div className="status-row">
                    <span>Current Route</span>

                    <strong>
                      {shipment.origin}
                      {" → "}
                      {shipment.destination}
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Tracking Number</span>

                    <strong>{shipment.trackingNumber}</strong>
                  </div>

                  <div className="status-row">
                    <span>Estimated Arrival</span>

                    <strong>{shipment.estimatedDelivery}</strong>
                  </div>

                  <div className="status-row">
                    <span>Service</span>

                    <strong>{shipment.shippingMethod}</strong>
                  </div>

                  <div className="status-row">
                    <span>Package</span>

                    <strong>{shipment.package.weight}</strong>
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
