import { useState } from "react";
import { motion } from "framer-motion";

import {
  FaMagnifyingGlass,
  FaPlaneDeparture,
  FaBox,
  FaClock,
  FaShield,
  FaLocationDot,
  FaCircleCheck,
  FaTruckFast,
} from "react-icons/fa6";

import "./TrackShipment.css";
import TrackEmptyState from "./TrackEmptyState";

const STATUS_ORDER = ["BOOKED", "PROCESSING", "IN_TRANSIT", "DELIVERED"];

const STATUS_LABELS = {
  BOOKED: "Booking Confirmed",
  PROCESSING: "Shipment Processing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

const formatStatus = (status) => {
  return (
    status
      ?.toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Unknown"
  );
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatEstimatedArrival = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCountryFlag = (address = "") => {
  const value = address.toLowerCase();

  if (value.includes("united kingdom") || value.includes("london")) {
    return "🇬🇧";
  }

  if (
    value.includes("nigeria") ||
    value.includes("lagos") ||
    value.includes("abuja") ||
    value.includes("lekki") ||
    value.includes("ikorodu")
  ) {
    return "🇳🇬";
  }

  return "🌍";
};

const getCountryCode = (address = "") => {
  const value = address.toLowerCase();

  if (
    value.includes("united kingdom") ||
    value.includes("london") ||
    value.includes("uk")
  ) {
    return "UK";
  }

  if (
    value.includes("nigeria") ||
    value.includes("lagos") ||
    value.includes("abuja") ||
    value.includes("lekki") ||
    value.includes("ikorodu")
  ) {
    return "NG";
  }

  return "INTL";
};

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    const searchValue = trackingNumber.trim();

    if (!searchValue) return;

    setLoading(true);
    setShipment(null);
    setNotFound(false);
    setSearchComplete(false);

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/track/${searchValue}`,
      );

      const data = await response.json();

      console.log("Tracking API response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Shipment not found");
      }

      setShipment(data.shipment);
    } catch (error) {
      console.error("Tracking error:", error);

      setShipment(null);
      setNotFound(true);
    } finally {
      setLoading(false);
      setSearchComplete(true);
    }
  };

  const progress = shipment?.progress ?? 0;

  const currentStatus = shipment?.status || "BOOKED";

  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  const originFlag = getCountryFlag(shipment?.origin);
  const destinationFlag = getCountryFlag(shipment?.destination);

  const originCode = getCountryCode(shipment?.origin);
  const destinationCode = getCountryCode(shipment?.destination);

  const getStageState = (status) => {
    const stageIndex = STATUS_ORDER.indexOf(status);

    if (stageIndex < currentStatusIndex) {
      return "completed";
    }

    if (stageIndex === currentStatusIndex) {
      return "active";
    }

    return "pending";
  };

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
            Enter your tracking number below to monitor your shipment from
            pickup until final delivery.
          </p>
        </motion.div>

        {/* SEARCH */}

        <motion.div
          className="tracking-search"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="tracking-input-wrapper">
            <FaMagnifyingGlass />

            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              disabled={loading}
              onChange={(event) => setTrackingNumber(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !trackingNumber.trim()}
          >
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

        {/* SHIPMENT */}

        {shipment && (
          <>
            {/* SHIPMENT HEADER */}

            <motion.div
              className="shipment-result-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <span>TRACKING NUMBER</span>

                <h3>{shipment.trackingNumber}</h3>
              </div>

              <div className={`shipment-status ${currentStatus.toLowerCase()}`}>
                <span className="status-indicator" />
                {formatStatus(currentStatus)}
              </div>
            </motion.div>

            {/* OVERVIEW + ROUTE */}

            <div className="tracking-grid">
              {/* OVERVIEW */}

              <motion.div
                className="overview-card"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="card-header">
                  <div>
                    <span className="card-eyebrow">SHIPMENT</span>

                    <h2>Shipment Overview</h2>
                  </div>

                  <div className="status-pill">
                    <FaTruckFast />
                    <span>{formatStatus(currentStatus)}</span>
                  </div>
                </div>

                <div className="overview-grid">
                  <div className="overview-item">
                    <FaBox />

                    <div>
                      <span>Tracking Number</span>
                      <h4>{shipment.trackingNumber}</h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaClock />

                    <div>
                      <span>Estimated Arrival</span>

                      <h4>
                        {formatEstimatedArrival(shipment.estimatedDelivery)}
                      </h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaPlaneDeparture />

                    <div>
                      <span>Service</span>
                      <h4>{shipment.booking?.service || "Standard"}</h4>
                    </div>
                  </div>

                  <div className="overview-item">
                    <FaShield />

                    <div>
                      <span>Package</span>
                      <h4>{shipment.booking?.packageType || "Package"}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ROUTE */}

              <motion.div
                className="route-card"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="card-header">
                  <div>
                    <span className="card-eyebrow">SHIPMENT ROUTE</span>

                    <h2>Live Route</h2>
                  </div>

                  <span className="route-live">LIVE</span>
                </div>

                <div className="route-wrapper">
                  <div className="route-location">
                    <div className="route-flag">{originFlag}</div>

                    <strong>{originCode}</strong>

                    <span>{shipment.origin}</span>
                  </div>

                  <div className="route-track">
                    <div className="route-track-line">
                      <motion.div
                        className="route-track-progress"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                        }}
                      />
                    </div>

                    <motion.div
                      className="route-plane"
                      initial={{ left: 0 }}
                      animate={{
                        left: `${progress}%`,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                    >
                      ✈️
                    </motion.div>
                  </div>

                  <div className="route-location destination">
                    <div className="route-flag">{destinationFlag}</div>

                    <strong>{destinationCode}</strong>

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
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progress}%`,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                    />
                  </div>

                  <div className="progress-status">
                    <span>
                      {currentStatus === "DELIVERED"
                        ? "Shipment delivered successfully"
                        : currentStatus === "IN_TRANSIT"
                          ? "Shipment is currently in transit"
                          : currentStatus === "PROCESSING"
                            ? "Shipment is being prepared for dispatch"
                            : "Booking has been confirmed"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* BOTTOM */}

            <div className="tracking-bottom">
              {/* TIMELINE */}

              <motion.div
                className="timeline-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="card-header">
                  <div>
                    <span className="card-eyebrow">SHIPMENT ACTIVITY</span>

                    <h2>Shipment Timeline</h2>
                  </div>
                </div>

                <div className="timeline">
                  {STATUS_ORDER.map((status, index) => {
                    const state = getStageState(status);

                    const event = shipment.trackingEvents?.find(
                      (item) => item.title === STATUS_LABELS[status],
                    );

                    return (
                      <div key={status} className={`timeline-item ${state}`}>
                        <div className="timeline-marker">
                          {state === "completed" ? (
                            <FaCircleCheck />
                          ) : state === "active" ? (
                            <span className="active-marker" />
                          ) : (
                            <span className="pending-marker" />
                          )}
                        </div>

                        <div className="timeline-content">
                          <div className="timeline-heading">
                            <h4>{STATUS_LABELS[status]}</h4>

                            {state === "active" && (
                              <span className="timeline-active">CURRENT</span>
                            )}

                            {state === "completed" && (
                              <span className="timeline-complete">
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {event && (
                            <>
                              <p>
                                <FaLocationDot />
                                {event.location}
                              </p>

                              <small>
                                {formatDate(event.eventDate)}
                                {" • "}
                                {formatTime(event.eventDate)}
                              </small>
                            </>
                          )}

                          {state === "pending" && (
                            <small className="pending-text">
                              Awaiting shipment progress
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* CURRENT STATUS */}

              <motion.div
                className="status-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <span className="card-eyebrow">LIVE STATUS</span>

                <h2>Current Shipment Status</h2>

                <div className="status-live">
                  <div className="status-pulse" />

                  <span>{formatStatus(currentStatus)}</span>
                </div>

                <div className="status-details">
                  <div className="status-row">
                    <span>Current Route</span>

                    <strong>
                      {originCode}
                      {" → "}
                      {destinationCode}
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Tracking Number</span>

                    <strong>{shipment.trackingNumber}</strong>
                  </div>

                  <div className="status-row">
                    <span>Estimated Arrival</span>

                    <strong>
                      {formatEstimatedArrival(shipment.estimatedDelivery)}
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Service</span>

                    <strong>{shipment.booking?.service || "Standard"}</strong>
                  </div>

                  <div className="status-row">
                    <span>Package Weight</span>

                    <strong>{shipment.booking?.weight ?? "—"} kg</strong>
                  </div>
                </div>

                <div className="last-update">
                  <span>Last updated</span>

                  <strong>
                    {formatDate(shipment.lastUpdate)}
                    {" • "}
                    {formatTime(shipment.lastUpdate)}
                  </strong>
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
