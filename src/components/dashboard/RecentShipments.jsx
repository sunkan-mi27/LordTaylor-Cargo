import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBox,
  FaCircleCheck,
  FaTruck,
  FaClock,
} from "react-icons/fa6";

const shipments = [
  {
    id: "LT-24081",
    destination: "Lagos, Nigeria",
    status: "In Transit",
    eta: "12 Aug 2026",
    icon: <FaTruck />,
    color: "#3b82f6",
  },

  {
    id: "LT-24073",
    destination: "Abuja, Nigeria",
    status: "Delivered",
    eta: "Completed",
    icon: <FaCircleCheck />,
    color: "#22c55e",
  },

  {
    id: "LT-24069",
    destination: "Port Harcourt",
    status: "Processing",
    eta: "15 Aug 2026",
    icon: <FaClock />,
    color: "#f59e0b",
  },

  {
    id: "LT-24058",
    destination: "Ibadan",
    status: "Booked",
    eta: "Awaiting Dispatch",
    icon: <FaBox />,
    color: "#8b5cf6",
  },
];

const RecentShipments = () => {
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
        {shipments.map((shipment) => (
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
                background: `${shipment.color}18`,
                color: shipment.color,
              }}
            >
              {shipment.icon}
            </div>

            <div className="shipment-info">
              <h3>{shipment.id}</h3>

              <p>{shipment.destination}</p>
            </div>

            <div className="shipment-status">
              <span
                className="status-badge"
                style={{
                  background: `${shipment.color}18`,
                  color: shipment.color,
                }}
              >
                {shipment.status}
              </span>

              <small>{shipment.eta}</small>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentShipments;
