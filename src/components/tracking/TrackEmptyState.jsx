import { motion } from "framer-motion";
import { FaBoxOpen, FaArrowRotateRight } from "react-icons/fa6";

const TrackingEmptyState = ({ onRetry }) => {
  return (
    <motion.div
      className="tracking-empty"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="tracking-empty-icon">
        <FaBoxOpen />
      </div>

      <h2>Shipment Not Found</h2>

      <p>We couldn't locate any shipment with that Booking ID.</p>

      <ul>
        <li>Check for typing mistakes.</li>

        <li>Verify the Booking ID.</li>

        <li>Contact support if the issue persists.</li>
      </ul>

      <button onClick={onRetry}>
        <FaArrowRotateRight />
        Search Again
      </button>
    </motion.div>
  );
};

export default TrackingEmptyState;
