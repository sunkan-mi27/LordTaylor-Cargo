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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PAYMENT_METHODS = {
  "Pay on Delivery": "PAY_ON_DELIVERY",
  "Card Payment": "CARD",
  "Bank Transfer": "BANK_TRANSFER",
};

const SERVICE_OPTIONS = {
  Standard: "Standard",
  Express: "Express",
  "Priority Express": "Express",
};

const calculateShippingCost = (weight, service) => {
  const numericWeight = Number(weight) || 0;

  const baseCost = numericWeight * 18;

  const serviceFee =
    service === "Priority Express" ? 80 : service === "Express" ? 40 : 15;

  return baseCost + serviceFee;
};

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
  const [createdBooking, setCreatedBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBooking((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleConfirmBooking = async () => {
    setError("");

    const token =
      localStorage.getItem("lordtaylor-token") ||
      sessionStorage.getItem("lordtaylor-token");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    if (
      !booking.senderName.trim() ||
      !booking.receiverName.trim() ||
      !booking.pickup.trim() ||
      !booking.destination.trim()
    ) {
      setError(
        "Please complete the sender, receiver, pickup, and destination details.",
      );
      return;
    }

    const weight = Number(booking.weight);

    if (!weight || weight <= 0) {
      setError("Please enter a valid shipment weight.");
      return;
    }

    const estimatedCost = calculateShippingCost(weight, booking.service);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderName: booking.senderName.trim(),
          senderPhone: booking.senderPhone.trim(),
          senderEmail: booking.senderEmail.trim(),

          receiverName: booking.receiverName.trim(),
          receiverPhone: booking.receiverPhone.trim(),

          pickup: booking.pickup.trim(),
          destination: booking.destination.trim(),

          packageType: booking.packageType,
          weight,

          pickupDate: booking.pickupDate || null,

          service: SERVICE_OPTIONS[booking.service] || "Standard",

          paymentMethod: PAYMENT_METHODS[booking.payment] || "PAY_ON_DELIVERY",

          estimatedCost,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create your shipment booking.",
        );
      }

      setCreatedBooking(data.booking);
      setShowSuccessModal(true);
    } catch (bookingError) {
      console.error("Booking error:", bookingError);

      setError(
        bookingError.message ||
          "Unable to create your shipment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = calculateShippingCost(booking.weight, booking.service);

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

        {error && <div className="booking-error">{error}</div>}

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

            <div className="field">
              <label>
                <FaUser />
                Receiver Name
              </label>

              <input
                type="text"
                name="receiverName"
                placeholder="James Taylor"
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
                placeholder="+44 7123 456789"
                value={booking.receiverPhone}
                onChange={handleChange}
              />
            </div>

            <div className="double-fields">
              <div className="field">
                <label>
                  <FaLocationDot />
                  Pickup Location
                </label>

                <input
                  type="text"
                  name="pickup"
                  placeholder="Lagos, Nigeria"
                  value={booking.pickup}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>
                  <FaLocationDot />
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="London, United Kingdom"
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
                  <option>Parcel</option>
                  <option>Document</option>
                  <option>Electronics</option>
                  <option>Personal Items</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="field">
                <label>
                  <FaBoxOpen />
                  Weight (KG)
                </label>

                <input
                  type="number"
                  name="weight"
                  min="0.1"
                  step="0.1"
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

              <h1>£{estimatedCost}</h1>

              <p>Final cost will be confirmed after package inspection.</p>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="confirm-booking-btn"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? "Creating Shipment..." : "Confirm Booking"}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={createdBooking || booking}
      />
    </section>
  );
};

export default BookShipment;
