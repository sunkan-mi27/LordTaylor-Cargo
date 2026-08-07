import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBox, FaMagnifyingGlass, FaArrowTrendUp } from "react-icons/fa6";

const DashboardHero = ({
  userName = "Customer",
  greeting = "Good Afternoon",
}) => {
  return (
    <motion.section
      className="dashboard-hero"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* LEFT */}

      <div className="dashboard-hero-left">
        <span className="dashboard-badge">
          <FaArrowTrendUp />
          Logistics Dashboard
        </span>

        <h1>
          {greeting}, <span>{userName}</span>
          👋
        </h1>

        <p>
          Welcome back to LordTaylor Logistics. Manage your shipments, monitor
          deliveries, generate quotes and stay updated from one central
          dashboard.
        </p>

        <div className="dashboard-actions">
          <Link to="/book" className="primary-action">
            <FaBox />
            Book Shipment
          </Link>

          <Link to="/track" className="secondary-action">
            <FaMagnifyingGlass />
            Track Shipment
          </Link>
        </div>
      </div>

      {/* RIGHT */}

      <div className="dashboard-hero-right">
        <div className="hero-status-card">
          <span className="status-label">System Status</span>

          <h3>Operational</h3>

          <div className="status-indicator">
            <span className="live-dot"></span>
            All logistics services are running normally.
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DashboardHero;
