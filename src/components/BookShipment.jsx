import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/bookShipment.css";
import BookingSuccessModal from "./BookingSucessModal";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaBoxOpen,
  FaCalendarDays,
  FaTruckFast,
  FaCreditCard,
} from "react-icons/fa6";

const BookShipment = () => {
  const [booking, setBooking] = useState({
    senderName: "",

    senderPhone: "",

    senderEmail: "",

    receiverName: "",

    receiverPhone: "",

    pickup: "",

    destination: "",

    packageType: "Parcel",

    weight: "5",

    pickupDate: "",

    service: "Express",

    payment: "Pay on Delivery",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setBooking({
      ...booking,

      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="booking-page">
      <div className="booking-glow glow-left"></div>

      <div className="booking-glow glow-right"></div>

      <div className="booking-container">
        <motion.div
          className="booking-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span>Book Shipment</span>

          <h1>Schedule Your Shipment</h1>

          <p>
            Complete the details below to schedule a pickup and delivery. Review
            everything before confirming your shipment.
          </p>
        </motion.div>

        <div className="booking-layout">
          <motion.div
            className="booking-form"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="field">
              <label>
                <FaUser />
                Sender Name
              </label>

              <input
                type="text"
                name="senderName"
                placeholder="John David"
                value={booking.senderName}
                onChange={handleChange}
              />
            </div>

            <div className="double-fields">
              <div className="field">
                <label>
                  <FaPhone />
                  Phone
                </label>

                <input
                  type="text"
                  name="senderPhone"
                  placeholder="+44 7123 456789"
                  value={booking.senderPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>
                  <FaEnvelope />
                  Email
                </label>

                <input
                  type="email"
                  name="senderEmail"
                  placeholder="john@email.com"
                  value={booking.senderEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="section-title">Receiver Information</div>

            <div className="field">
              <label>
                <FaUser />
                Receiver Name
              </label>

              <input
                type="text"
                name="receiverName"
                placeholder="Receiver Name"
                value={booking.receiverName}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>
                <FaPhone />
                Receiver Phone
              </label>

              <input
                type="text"
                name="receiverPhone"
                placeholder="+234..."
                value={booking.receiverPhone}
                onChange={handleChange}
              />
            </div>

            <div className="double-fields">
              <div className="field">
                <label>
                  <FaLocationDot />
                  Pickup location
                </label>

                <input
                  type="text"
                  name="pickup"
                  placeholder="London, UK"
                  value={booking.pickup}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>
                  <FaLocationDot />
                  Delivery location
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="Lagos, Nigeria"
                  value={booking.destination}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="double-fields">
              <div className="field">
                <label>
                  <FaBoxOpen />
                  Package Type
                </label>

                <select
                  name="packageType"
                  value={booking.packageType}
                  onChange={handleChange}
                >
                  <option>Documents</option>

                  <option>Parcel</option>

                  <option>Electronics</option>

                  <option>Commercial Cargo</option>
                </select>
              </div>

              <div className="field">
                <label>Weight (KG)</label>

                <input
                  type="number"
                  min="1"
                  name="weight"
                  value={booking.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="double-fields">
              <div className="field">
                <label>
                  <FaCalendarDays />
                  Pickup Date
                </label>

                <input
                  type="date"
                  name="pickupDate"
                  value={booking.pickupDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>
                  <FaTruckFast />
                  Shipping Service
                </label>

                <select
                  name="service"
                  value={booking.service}
                  onChange={handleChange}
                >
                  <option>Standard</option>

                  <option>Express</option>

                  <option>Priority Express</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>
                <FaCreditCard />
                Payment Method
              </label>

              <select
                name="payment"
                value={booking.payment}
                onChange={handleChange}
              >
                <option>Pay on Delivery</option>

                <option>Card Payment</option>

                <option>Bank Transfer</option>
              </select>
            </div>
          </motion.div>
          <motion.div
            className="booking-summary"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="summary-card">
              <span>Booking Summary</span>

              <h2>Shipment Overview</h2>
            </div>

            <div className="summary-list">
              <div className="summary-item">
                <span>Sender</span>

                <strong>{booking.senderName || "Not Provided"}</strong>
              </div>

              <div className="summary-item">
                <span>Receiver</span>

                <strong>{booking.receiverName || "Not Provided"}</strong>
              </div>

              <div className="summary-item">
                <span>Pickup</span>

                <strong>{booking.pickup || "Not Provided"}</strong>
              </div>

              <div className="summary-item">
                <span>Destination</span>

                <strong>{booking.destination || "Not Provided"}</strong>
              </div>

              <div className="summary-item">
                <span>Package</span>

                <strong>{booking.packageType}</strong>
              </div>

              <div className="summary-item">
                <span>Weight</span>

                <strong>{booking.weight} KG</strong>
              </div>

              <div className="summary-item">
                <span>Service</span>

                <strong>{booking.service}</strong>
              </div>

              <div className="summary-item">
                <span>Pickup Date</span>

                <strong>{booking.pickupDate || "Not Selected"}</strong>
              </div>

              <div className="summary-item">
                <span>Payment</span>

                <strong>{booking.payment}</strong>
              </div>
            </div>

            <div className="booking-price">
              <h3>Estimated Shipping Cost</h3>

              <h1>
                £
                {Number(booking.weight) * 18 +
                  (booking.service === "Priority Express"
                    ? 80
                    : booking.service === "Express"
                      ? 40
                      : 15)}
              </h1>

              <p>Final cost will be confirmed after package inspection.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="confirm-booking-btn"
              onClick={() => setShowSuccessModal(true)}
            >
              Confirm Booking
            </motion.button>
          </motion.div>
        </div>
      </div>

      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={booking}
      />
    </section>
  );
};

export default BookShipment;
