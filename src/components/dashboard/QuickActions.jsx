import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaBox,
  FaMagnifyingGlass,
  FaFileInvoiceDollar,
  FaClockRotateLeft,
  FaArrowRight,
} from "react-icons/fa6";

const actions = [
  {
    id: 1,
    title: "Book Shipment",
    description: "Create a new shipment and receive a booking reference.",
    icon: <FaBox />,
    link: "/book",
    color: "#22c55e",
  },

  {
    id: 2,
    title: "Track Shipment",
    description: "Monitor your shipment in real time from pickup to delivery.",
    icon: <FaMagnifyingGlass />,
    link: "/track",
    color: "#3b82f6",
  },

  {
    id: 3,
    title: "Generate Quote",
    description: "Calculate shipping costs before booking your shipment.",
    icon: <FaFileInvoiceDollar />,
    link: "/quote",
    color: "#f59e0b",
  },

  {
    id: 4,
    title: "Shipment History",
    description: "Review previous shipments and delivery records.",
    link: "#",
    icon: <FaClockRotateLeft />,
    color: "#8b5cf6",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>

          <p>Access your most frequently used logistics tools.</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <motion.div
            key={action.id}
            whileHover={{
              y: -6,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <Link to={action.link} className="quick-action-card">
              <div
                className="quick-action-icon"
                style={{
                  background: `${action.color}18`,
                  color: action.color,
                }}
              >
                {action.icon}
              </div>

              <div className="quick-action-content">
                <h3>{action.title}</h3>

                <p>{action.description}</p>
              </div>

              <FaArrowRight className="quick-arrow" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
