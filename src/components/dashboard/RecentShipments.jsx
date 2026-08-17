import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { FaArrowRight, FaBox, FaCircleCheck, FaTruck } from "react-icons/fa6";

const getShipmentIcon = (status) => {
  if (status === "DELIVERED") {
    return FaCircleCheck;
  }

  if (status === "IN_TRANSIT") {
    return FaTruck;
  }

  return FaBox;
};

const getShipmentColor = (status) => {
  if (status === "DELIVERED") {
    return "#22c55e";
  }

  if (status === "IN_TRANSIT") {
    return "#3b82f6";
  }

  return "#f59e0b";
};

const formatStatus = (status) => {
  if (status === "IN_TRANSIT") return "In Transit";
  if (status === "DELIVERED") return "Delivered";
  if (status === "BOOKED") return "Booked";
  if (status === "PROCESSING") return "Processing";
  if (status === "CANCELLED") return "Cancelled";

  return status;
};

const RecentShipments = ({ shipments = [], loading }) => {
  return (
    <section className="recent-shipments">
      <div className="section-heading">
        <div>
          <h2>Recent Shipments</h2>

          <p>Monitor your latest logistics activities.</p>
        </div>

        <Link to="/history" className="view-all-link">
          View All
          <FaArrowRight />
        </Link>
      </div>

      <div className="shipment-list">
        {loading ? (
          <div className="shipment-loading">Loading recent shipments...</div>
        ) : shipments.length === 0 ? (
          <div className="shipment-loading">No shipments found.</div>
        ) : (
          shipments.slice(0, 4).map((shipment) => {
            const Icon = getShipmentIcon(shipment.status);

            const color = getShipmentColor(shipment.status);

            return (
              <motion.div
                key={shipment.id}
                className="shipment-card"
                whileHover={{
                  y: -4,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <div
                  className="shipment-icon"
                  style={{
                    background: `${color}18`,
                    color,
                  }}
                >
                  <Icon />
                </div>

                <div className="shipment-info">
                  <h3>{shipment.trackingNumber}</h3>

                  <p>{shipment.destination}</p>
                </div>

                <div className="shipment-status">
                  <span
                    className="status-badge"
                    style={{
                      background: `${color}18`,
                      color,
                    }}
                  >
                    {formatStatus(shipment.status)}
                  </span>

                  <small>{shipment.progress}% complete</small>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RecentShipments;
