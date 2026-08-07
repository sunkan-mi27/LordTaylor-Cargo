import { motion, AnimatePresence } from "framer-motion";
import { FaCircleCheck, FaBox, FaCalendarDays, FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../styles/bookingSucessModal.css";

const BookingSuccessModal = ({ isOpen, onClose, booking }) => {
  const navigate = useNavigate();

  const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000,
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="booking-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.35 }}
          >
            <button className="modal-close" onClick={onClose}>
              <FaXmark />
            </button>

            <div className="success-icon">
              <FaCircleCheck />
            </div>

            <h2>Booking Confirmed</h2>

            <p>
              Your shipment has been successfully scheduled. Our logistics team
              will contact you shortly.
            </p>

            <div className="booking-reference">
              <div>
                <span>Booking ID</span>

                <strong>{bookingId}</strong>
              </div>

              <div>
                <span>Pickup Date</span>

                <strong>{booking.pickupDate || "Pending"}</strong>
              </div>
            </div>
            <div className="modal-summary">
              <div className="summary-row">
                <span>Sender</span>

                <strong>{booking.senderName || "Not Provided"}</strong>
              </div>

              <div className="summary-row">
                <span>Receiver</span>

                <strong>{booking.receiverName || "Not Provided"}</strong>
              </div>

              <div className="summary-row">
                <span>
                  <FaBox />
                  Package
                </span>

                <strong>{booking.packageType}</strong>
              </div>

              <div className="summary-row">
                <span>Weight</span>

                <strong>{booking.weight} KG</strong>
              </div>

              <div className="summary-row">
                <span>Service</span>

                <strong>{booking.service}</strong>
              </div>

              <div className="summary-row">
                <span>Route</span>

                <strong>
                  {booking.pickup || "Not Provided"}→
                  {booking.destination || "Not Provided"}
                </strong>
              </div>

              <div className="summary-row">
                <span>Estimated Cost</span>

                <strong>
                  £
                  {Number(booking.weight) * 18 +
                    (booking.service === "Priority Express"
                      ? 80
                      : booking.service === "Express"
                        ? 40
                        : 15)}
                </strong>
              </div>
            </div>
            <div className="modal-actions">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="track-btn"
                onClick={() => navigate("/track")}
              >
                Track Shipment
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="home-btn"
                onClick={() => navigate("/")}
              >
                Back Home
              </motion.button>
            </div>

            <div className="modal-footer">
              <div className="footer-info">
                <FaCalendarDays />

                <span>
                  Our operations team will verify your booking and contact you
                  before pickup.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessModal;
