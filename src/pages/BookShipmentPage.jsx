import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBoxOpen,
  FaLocationDot,
  FaPhone,
  FaCalendarDays,
  FaWeightHanging,
} from "react-icons/fa6";

import "../styles/bookShipment.css";

const BookShipmentPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [booking, setBooking] = useState({
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    pickup: "",
    destination: "",
    weight: "",
    service: "Standard",
    pickupDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setBooking((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!booking.senderName.trim())
      newErrors.senderName = "Sender name is required.";

    if (!booking.senderPhone.trim())
      newErrors.senderPhone = "Sender phone is required.";

    if (!booking.receiverName.trim())
      newErrors.receiverName = "Receiver name is required.";

    if (!booking.receiverPhone.trim())
      newErrors.receiverPhone = "Receiver phone is required.";

    if (!booking.pickup.trim())
      newErrors.pickup = "Pickup location is required.";

    if (!booking.destination.trim())
      newErrors.destination = "Destination is required.";

    if (!booking.weight) newErrors.weight = "Weight is required.";

    if (!booking.pickupDate) newErrors.pickupDate = "Pickup date is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const generateBookingId = () => {
    const today = new Date();

    const date =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `LT-${date}-${random}`;
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookingId = generateBookingId();

    const shipment = {
      ...booking,
      bookingId,
      status: "Pending Pickup",
      createdAt: new Date().toISOString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("lordtaylor-bookings")) || [];

    existing.push(shipment);

    localStorage.setItem("lordtaylor-bookings", JSON.stringify(existing));

    navigate("/track", {
      state: {
        bookingId,
      },
    });
  };

  return (
    <section className="booking-page">
      <div className="booking-header">
        <span>BOOK SHIPMENT</span>

        <h1>Book Your Cargo Shipment</h1>

        <p>
          Complete the details below and we'll prepare your shipment for
          collection and delivery.
        </p>
      </div>

      <div className="booking-layout">
        {/* ===========================
            BOOKING FORM
        =========================== */}

        <motion.form
          onSubmit={handleBooking}
          className="booking-form"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Sender Information</h2>

          <div className="double-fields">
            <div className="field">
              <label>Sender Name</label>

              <div className="input-wrapper">
                <FaUser />

                <input
                  type="text"
                  name="senderName"
                  value={booking.senderName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Phone Number</label>

              <div className="input-wrapper">
                <FaPhone />

                <input
                  type="tel"
                  name="senderPhone"
                  value={booking.senderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <h2>Receiver Information</h2>

          <div className="double-fields">
            <div className="field">
              <label>Receiver Name</label>

              <div className="input-wrapper">
                <FaUser />

                <input
                  type="text"
                  name="receiverName"
                  value={booking.receiverName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Receiver Phone</label>

              <div className="input-wrapper">
                <FaPhone />

                <input
                  type="tel"
                  name="receiverPhone"
                  value={booking.receiverPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <h2>Shipment Details</h2>

          <div className="field">
            <label>Pickup Location</label>

            <div className="input-wrapper">
              <FaLocationDot />

              <input
                type="text"
                name="pickup"
                value={booking.pickup}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Destination</label>

            <div className="input-wrapper">
              <FaLocationDot />

              <input
                type="text"
                name="destination"
                value={booking.destination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="double-fields">
            <div className="field">
              <label>Package Weight (KG)</label>

              <div className="input-wrapper">
                <FaWeightHanging />

                <input
                  type="number"
                  min="1"
                  name="weight"
                  placeholder="25"
                  value={booking.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Pickup Date</label>

              <div className="input-wrapper">
                <FaCalendarDays />

                <input
                  type="date"
                  name="pickupDate"
                  value={booking.pickupDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="field">
            <label>Shipping Service</label>

            <div className="input-wrapper">
              <FaBoxOpen />

              <select
                name="service"
                value={booking.service}
                onChange={handleChange}
              >
                <option value="Standard">Standard Shipping</option>
                <option value="Express">Express Shipping</option>
                <option value="Priority">Priority Shipping</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Package Description</label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe the items you're shipping..."
              value={booking.description}
              onChange={handleChange}
            />
          </div>
          <motion.button
            type="submit"
            className="booking-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Shipment
          </motion.button>
        </motion.form>

        {/* ===========================
            LIVE SHIPMENT SUMMARY
        =========================== */}

        <motion.div
          className="booking-summary"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Shipment Summary</h2>

          <div className="summary-card">
            <div className="summary-item">
              <span>Sender</span>
              <strong>{booking.senderName || "Not Provided"}</strong>
            </div>

            <div className="summary-item">
              <span>Receiver</span>
              <strong>{booking.receiverName || "Not Provided"}</strong>
            </div>

            <div className="summary-item">
              <span>Route</span>
              <strong>
                {booking.pickup || "Origin"} →{" "}
                {booking.destination || "Destination"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Weight</span>
              <strong>{booking.weight ? `${booking.weight} KG` : "--"}</strong>
            </div>

            <div className="summary-item">
              <span>Service</span>
              <strong>{booking.service}</strong>
            </div>

            <div className="summary-item">
              <span>Pickup Date</span>
              <strong>{booking.pickupDate || "--"}</strong>
            </div>

            <div className="summary-item">
              <span>Status</span>
              <strong className="pending">Pending Booking</strong>
            </div>
          </div>

          <div className="estimated-card">
            <h3>Estimated Delivery</h3>

            <p>
              {booking.service === "Priority"
                ? "1–2 Business Days"
                : booking.service === "Express"
                  ? "2–4 Business Days"
                  : "5–7 Business Days"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookShipmentPage;
