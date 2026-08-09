import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBox,
  FaCircleCheck,
  FaTruck,
  FaClock,
} from "react-icons/fa6";

import shipments from "../../data/shipments";

const getShipmentIcon = (statusType) => {
  if (statusType === "delivered") {
    return FaCircleCheck;
  }

  if (statusType === "transit") {
    return FaTruck;
  }

  return FaBox;
};

const getShipmentColor = (statusType) => {
  if (statusType === "delivered") {
    return "#22c55e";
  }

  if (statusType === "transit") {
    return "#3b82f6";
  }

  return "#f59e0b";
};

const RecentShipments = () => {
  const recentShipments = shipments.slice(0, 4);

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
        {recentShipments.map((shipment) => {
          const Icon = getShipmentIcon(shipment.statusType);

          const color = getShipmentColor(shipment.statusType);

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
                  {shipment.status}
                </span>

                <small>{shipment.estimatedDelivery}</small>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentShipments;
