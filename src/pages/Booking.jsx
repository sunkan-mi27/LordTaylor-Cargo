import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

import "../styles/booking.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BookShipment = () => {
  const navigate = useNavigate();

  /* =========================================
     BOOKING STATE
  ========================================= */

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [errors, setErrors] = useState({});

  /* =========================================
     SENDER
  ========================================= */

  const [sender, setSender] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "United Kingdom",
    state: "",
    city: "",
    postalCode: "",
    address: "",
  });

  /* =========================================
     RECEIVER
  ========================================= */

  const [receiver, setReceiver] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    state: "",
    city: "",
    postalCode: "",
    address: "",
  });

  /* =========================================
     PARCEL
  ========================================= */

  const [parcel, setParcel] = useState({
    packageType: "Standard Box",
    weight: "",
    value: "",
    length: "",
    width: "",
    height: "",
    description: "",
    shippingMethod: "Standard Delivery",
    insurance: "No Insurance",
  });

  /* =========================================
     PAYMENT
  ========================================= */

  const [payment, setPayment] = useState({
    method: "Visa",
  });

  /* =========================================
     HANDLERS
  ========================================= */

  const handleSenderChange = (e) => {
    const { name, value } = e.target;

    setSender((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;

    setReceiver((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name === "fullName"
        ? "receiverName"
        : name === "email"
          ? "receiverEmail"
          : name === "phone"
            ? "receiverPhone"
            : name === "address"
              ? "receiverAddress"
              : name]: "",
    }));
  };

  const handleParcelChange = (e) => {
    const { name, value } = e.target;

    setParcel((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setPayment((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!sender.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!sender.email.trim()) {
        newErrors.email = "Email is required";
      }

      if (!sender.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!sender.address.trim()) {
        newErrors.address = "Collection address is required";
      }
    }

    if (currentStep === 2) {
      if (!receiver.fullName.trim()) {
        newErrors.receiverName = "Receiver name is required";
      }

      if (!receiver.email.trim()) {
        newErrors.receiverEmail = "Email is required";
      }

      if (!receiver.phone.trim()) {
        newErrors.receiverPhone = "Phone number is required";
      }

      if (!receiver.address.trim()) {
        newErrors.receiverAddress = "Delivery address is required";
      }
    }

    if (currentStep === 3) {
      if (!parcel.weight.trim()) {
        newErrors.weight = "Weight is required";
      }

      if (!parcel.value.trim()) {
        newErrors.value = "Parcel value is required";
      }

      if (!parcel.length.trim()) {
        newErrors.length = "Length is required";
      }

      if (!parcel.width.trim()) {
        newErrors.width = "Width is required";
      }

      if (!parcel.height.trim()) {
        newErrors.height = "Height is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================
     PACKAGE SELECTOR
  ========================================= */

  const selectPackage = (type) => {
    setParcel((previous) => ({
      ...previous,
      packageType: type,
    }));
  };

  /* =========================================
     NAVIGATION
  ========================================= */

  const goNext = () => {
    if (!validateStep()) return;

    setCurrentStep((previous) => previous + 1);
  };

  const goBack = () => {
    setErrors({});

    setCurrentStep((previous) => Math.max(1, previous - 1));
  };

  /* =========================================
     SHIPPING PRICE
  ========================================= */

  const getShippingPrice = () => {
    if (parcel.shippingMethod === "Express Delivery") {
      return 85;
    }

    return 45;
  };

  const getInsurancePrice = () => {
    if (parcel.insurance === "Basic Insurance") {
      return 12;
    }

    if (parcel.insurance === "Premium Insurance") {
      return 25;
    }

    return 0;
  };

  const shippingPrice = getShippingPrice();
  const insurancePrice = getInsurancePrice();

  const subtotal = shippingPrice + insurancePrice;

  const serviceFee = Math.round(subtotal * 0.05);

  const total = subtotal + serviceFee;

  /* =========================================
     PAYMENT
  ========================================= */

  const handleConfirmPayment = async () => {
    if (creatingShipment) return;

    setCreatingShipment(true);

    try {
      const token = localStorage.getItem("lordtaylor-token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const paymentMethodMap = {
        Visa: "CARD",
        Mastercard: "CARD",
        "Bank Transfer": "BANK_TRANSFER",
        "Pay on Delivery": "PAY_ON_DELIVERY",
      };

      const bookingBody = {
        senderName: sender.fullName,
        senderPhone: sender.phone,
        senderEmail: sender.email,

        receiverName: receiver.fullName,
        receiverPhone: receiver.phone,

        pickup: `${sender.address}, ${sender.city}, ${sender.state}, ${sender.country}`,
        destination: `${receiver.address}, ${receiver.city}, ${receiver.state}, ${receiver.country}`,

        packageType: parcel.packageType,
        weight: Number(parcel.weight),

        service:
          parcel.shippingMethod === "Express Delivery" ? "Express" : "Standard",

        paymentMethod: paymentMethodMap[payment.method] || "CARD",

        estimatedCost: Number(total),

        pickupDate: new Date().toISOString(),
      };

      console.log("Sending booking:", bookingBody);

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingBody),
      });

      const data = await response.json();

      console.log("Booking API response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create booking");
      }

      /* =========================================
         REAL PAYMENT
         If the customer chose Card or Bank Transfer,
         send them to Flutterwave's real checkout instead
         of faking a success screen. Pay on Delivery skips
         straight to the success screen since no online
         payment is needed.
      ========================================= */

      const chosenMethod = paymentMethodMap[payment.method] || "CARD";

      if (chosenMethod !== "PAY_ON_DELIVERY") {
        const paymentResponse = await fetch(`${API_URL}/payments/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId: data.booking.id }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentData.success || !paymentData.link) {
          throw new Error(
            paymentData.message || "Failed to start payment. Please try again.",
          );
        }

        window.location.href = paymentData.link;
        return;
      }

      setTrackingId(data.booking.shipment.trackingNumber);

      setCreatingShipment(false);
      setBookingComplete(true);
    } catch (error) {
      console.error("Booking creation error:", error);

      setCreatingShipment(false);

      alert(error.message || "Unable to create shipment. Please try again.");
    }
  };
  /* =========================================
     SUCCESS
  ========================================= */

  if (bookingComplete) {
    return (
      <DashboardLayout>
        <main className="booking-page">
          <section className="booking-success-card">
            <div className="booking-success-icon">✓</div>

            <span className="booking-badge">Shipment Confirmed</span>

            <h1>Booking Successful</h1>

            <p>
              Your shipment has been successfully created and is now ready for
              processing.
            </p>

            <div className="booking-tracking-box">
              <span>TRACKING ID</span>

              <strong>{trackingId}</strong>

              <small>
                Keep this tracking ID safe. You can use it to monitor your
                shipment.
              </small>
            </div>

            <div className="booking-success-summary">
              <div>
                <span>From</span>
                <strong>{sender.city || sender.country}</strong>
              </div>

              <div>
                <span>To</span>
                <strong>{receiver.city || receiver.country}</strong>
              </div>

              <div>
                <span>Total Paid</span>
                <strong>£{total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="booking-success-actions">
              <button
                type="button"
                onClick={() => navigate("/track")}
                className="booking-primary-button"
              >
                Track Shipment
              </button>

              <button
                type="button"
                onClick={() => navigate("/history")}
                className="booking-secondary-button"
              >
                View Shipment History
              </button>
            </div>
          </section>
        </main>
      </DashboardLayout>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <DashboardLayout>
      <main className="booking-page">
        {/* PAGE HEADER */}

        <div className="booking-header">
          <div>
            <span className="booking-badge">📦 Shipment Booking</span>

            <h1>Book New Shipment</h1>

            <p>
              Complete the booking form below to schedule a secure shipment with
              LordTaylor Logistics.
            </p>
          </div>
        </div>

        {/* STEP INDICATOR */}

        <p className="mobile-step-label">
          Step {currentStep} of 5 - {currentStep === 1 && "Sender"}
          {currentStep === 2 && "Receiver"}
          {currentStep === 3 && "Paecel"}
          {currentStep === 4 && "Review"}
          {currentStep === 5 && "Payment"}
        </p>
        <div className="booking-steps">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="step">
              <span
                className={`step-circle ${
                  currentStep === step
                    ? "active"
                    : currentStep > step
                      ? "completed"
                      : "inactive"
                }`}
              >
                {step}
              </span>

              <p
                className={`step-title ${
                  currentStep === step
                    ? "active"
                    : currentStep > step
                      ? "completed"
                      : "inactive"
                }`}
              >
                {step === 1 && "Sender"}
                {step === 2 && "Receiver"}
                {step === 3 && "Parcel"}
                {step === 4 && "Review"}
                {step === 5 && "Payment"}
              </p>
            </div>
          ))}
        </div>

        {/* FORM */}

        <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
          {/* =====================================
              STEP 1 — SENDER
          ===================================== */}

          {currentStep === 1 && (
            <>
              <div className="booking-card-header">
                <h2>Sender Information</h2>

                <p>Tell us who is sending this shipment.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={sender.fullName}
                    onChange={handleSenderChange}
                    className={errors.fullName ? "input-error" : ""}
                    autoComplete="name"
                  />

                  {errors.fullName && (
                    <small className="form-error">{errors.fullName}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={sender.email}
                    onChange={handleSenderChange}
                    className={errors.email ? "input-error" : ""}
                    autoComplete="email"
                  />

                  {errors.email && (
                    <small className="form-error">{errors.email}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={sender.phone}
                    onChange={handleSenderChange}
                    className={errors.phone ? "input-error" : ""}
                    autoComplete="tel"
                  />

                  {errors.phone && (
                    <small className="form-error">{errors.phone}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Country</label>

                  <select
                    name="country"
                    value={sender.country}
                    onChange={handleSenderChange}
                  >
                    <option>United Kingdom</option>
                    <option>Nigeria</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>State / Region</label>

                  <input
                    type="text"
                    name="state"
                    value={sender.state}
                    onChange={handleSenderChange}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={sender.city}
                    onChange={handleSenderChange}
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>

                  <input
                    type="text"
                    name="postalCode"
                    value={sender.postalCode}
                    onChange={handleSenderChange}
                    autoComplete="postal-code"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Collection Address</label>

                  <textarea
                    name="address"
                    value={sender.address}
                    onChange={handleSenderChange}
                    placeholder="Enter the full collection address"
                    rows="4"
                    className={errors.address ? "input-error" : ""}
                    autoComplete="street-address"
                  />

                  {errors.address && (
                    <small className="form-error">{errors.address}</small>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =====================================
              STEP 2 — RECEIVER
          ===================================== */}

          {currentStep === 2 && (
            <>
              <div className="booking-card-header">
                <h2>Receiver Information</h2>

                <p>Enter the details of the person receiving this shipment.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={receiver.fullName}
                    onChange={handleReceiverChange}
                    className={errors.receiverName ? "input-error" : ""}
                    autoComplete="name"
                  />

                  {errors.receiverName && (
                    <small className="form-error">{errors.receiverName}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={receiver.email}
                    onChange={handleReceiverChange}
                    className={errors.receiverEmail ? "input-error" : ""}
                    autoComplete="email"
                  />

                  {errors.receiverEmail && (
                    <small className="form-error">{errors.receiverEmail}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={receiver.phone}
                    onChange={handleReceiverChange}
                    className={errors.receiverPhone ? "input-error" : ""}
                    autoComplete="tel"
                  />

                  {errors.receiverPhone && (
                    <small className="form-error">{errors.receiverPhone}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Country</label>

                  <select
                    name="country"
                    value={receiver.country}
                    onChange={handleReceiverChange}
                  >
                    <option>Nigeria</option>
                    <option>United Kingdom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={receiver.state}
                    onChange={handleReceiverChange}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={receiver.city}
                    onChange={handleReceiverChange}
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>

                  <input
                    type="text"
                    name="postalCode"
                    value={receiver.postalCode}
                    onChange={handleReceiverChange}
                    autoComplete="postal-code"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Delivery Address</label>

                  <textarea
                    name="address"
                    value={receiver.address}
                    onChange={handleReceiverChange}
                    placeholder="Enter the complete delivery address"
                    rows="4"
                    className={errors.receiverAddress ? "input-error" : ""}
                    autoComplete="street-address"
                  />

                  {errors.receiverAddress && (
                    <small className="form-error">
                      {errors.receiverAddress}
                    </small>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =====================================
              STEP 3 — PARCEL
          ===================================== */}

          {currentStep === 3 && (
            <>
              <div className="booking-card-header">
                <h2>Parcel Information</h2>

                <p>
                  Tell us what you're shipping and how it should be handled.
                </p>
              </div>

              <div className="package-selector">
                {["Standard Box", "Document", "Fragile", "Custom Package"].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      className={
                        parcel.packageType === type
                          ? "package-option active"
                          : "package-option"
                      }
                      onClick={() => selectPackage(type)}
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Weight (kg)</label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="weight"
                    value={parcel.weight}
                    onChange={handleParcelChange}
                    placeholder="5"
                    className={errors.weight ? "input-error" : ""}
                  />

                  {errors.weight && (
                    <small className="form-error">{errors.weight}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Declared Value (£)</label>

                  <input
                    type="number"
                    min="0"
                    name="value"
                    value={parcel.value}
                    onChange={handleParcelChange}
                    placeholder="250"
                    className={errors.value ? "input-error" : ""}
                  />

                  {errors.value && (
                    <small className="form-error">{errors.value}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Length (cm)</label>

                  <input
                    type="number"
                    min="0"
                    name="length"
                    value={parcel.length}
                    onChange={handleParcelChange}
                    placeholder="30"
                    className={errors.length ? "input-error" : ""}
                  />

                  {errors.length && (
                    <small className="form-error">{errors.length}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Width (cm)</label>

                  <input
                    type="number"
                    min="0"
                    name="width"
                    value={parcel.width}
                    onChange={handleParcelChange}
                    placeholder="20"
                    className={errors.width ? "input-error" : ""}
                  />

                  {errors.width && (
                    <small className="form-error">{errors.width}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Height (cm)</label>

                  <input
                    type="number"
                    min="0"
                    name="height"
                    value={parcel.height}
                    onChange={handleParcelChange}
                    placeholder="15"
                    className={errors.height ? "input-error" : ""}
                  />

                  {errors.height && (
                    <small className="form-error">{errors.height}</small>
                  )}
                </div>

                <div className="form-group form-group-full">
                  <label>Parcel Description</label>

                  <textarea
                    name="description"
                    value={parcel.description}
                    onChange={handleParcelChange}
                    placeholder="Describe the contents of your shipment"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Shipping Method</label>

                  <select
                    name="shippingMethod"
                    value={parcel.shippingMethod}
                    onChange={handleParcelChange}
                  >
                    <option>Standard Delivery</option>
                    <option>Express Delivery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Insurance</label>

                  <select
                    name="insurance"
                    value={parcel.insurance}
                    onChange={handleParcelChange}
                  >
                    <option>No Insurance</option>
                    <option>Basic Insurance</option>
                    <option>Premium Insurance</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {/* =====================================
              STEP 4 — REVIEW
          ===================================== */}

          {currentStep === 4 && (
            <>
              <div className="booking-card-header">
                <h2>Review Shipment</h2>

                <p>
                  Review your shipment details before proceeding to payment.
                </p>
              </div>

              <div className="booking-review">
                {/* SENDER */}

                <div className="review-section">
                  <div className="review-section-heading">
                    <span>01</span>

                    <div>
                      <small>SENDER</small>
                      <h3>{sender.fullName}</h3>
                    </div>
                  </div>

                  <div className="review-details">
                    <p>{sender.email}</p>
                    <p>{sender.phone}</p>
                    <p>{sender.address}</p>
                    <p>
                      {sender.city}, {sender.state}, {sender.country}{" "}
                      {sender.postalCode}
                    </p>
                  </div>
                </div>

                {/* RECEIVER */}

                <div className="review-section">
                  <div className="review-section-heading">
                    <span>02</span>

                    <div>
                      <small>RECEIVER</small>
                      <h3>{receiver.fullName}</h3>
                    </div>
                  </div>

                  <div className="review-details">
                    <p>{receiver.email}</p>
                    <p>{receiver.phone}</p>
                    <p>{receiver.address}</p>
                    <p>
                      {receiver.city}, {receiver.state}, {receiver.country}{" "}
                      {receiver.postalCode}
                    </p>
                  </div>
                </div>

                {/* PARCEL */}

                <div className="review-section">
                  <div className="review-section-heading">
                    <span>03</span>

                    <div>
                      <small>PARCEL</small>
                      <h3>{parcel.packageType}</h3>
                    </div>
                  </div>

                  <div className="review-details review-parcel-grid">
                    <div>
                      <span>Weight</span>
                      <strong>{parcel.weight} kg</strong>
                    </div>

                    <div>
                      <span>Dimensions</span>

                      <strong>
                        {parcel.length} × {parcel.width} × {parcel.height} cm
                      </strong>
                    </div>

                    <div>
                      <span>Declared Value</span>

                      <strong>£{Number(parcel.value || 0).toFixed(2)}</strong>
                    </div>

                    <div>
                      <span>Shipping Method</span>

                      <strong>{parcel.shippingMethod}</strong>
                    </div>

                    <div>
                      <span>Insurance</span>

                      <strong>{parcel.insurance}</strong>
                    </div>

                    <div>
                      <span>Description</span>

                      <strong>
                        {parcel.description || "No description provided"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* PRICE BREAKDOWN */}

                <div className="review-total-card">
                  <div>
                    <span>Shipping</span>
                    <strong>£{shippingPrice.toFixed(2)}</strong>
                  </div>

                  <div>
                    <span>Insurance</span>
                    <strong>£{insurancePrice.toFixed(2)}</strong>
                  </div>

                  <div>
                    <span>Service Fee</span>
                    <strong>£{serviceFee.toFixed(2)}</strong>
                  </div>

                  <div className="review-total">
                    <span>Total</span>
                    <strong>£{total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================
              STEP 5 — PAYMENT
          ===================================== */}

          {currentStep === 5 && (
            <>
              <div className="booking-card-header">
                <h2>Payment</h2>

                <p>Choose how you'd like to pay for this shipment.</p>
              </div>

              <div className="payment-layout">
                {/* PAYMENT METHOD */}

                <div className="payment-method-panel">
                  <span className="payment-label">PAYMENT METHOD</span>

                  {["Visa", "Bank Transfer", "Pay on Delivery"].map(
                    (method) => (
                      <button
                        type="button"
                        key={method}
                        className={`payment-method-card ${payment.method === method ? "active" : ""}`}
                        onClick={() =>
                          setPayment((prev) => ({ ...prev, method }))
                        }
                      >
                        <div className="payment-card-icon">
                          {method === "Visa"
                            ? "💳"
                            : method === "Bank Transfer"
                              ? "🏦"
                              : "📦"}
                        </div>

                        <div className="payment-card-info">
                          <strong>{method === "Visa" ? "Card" : method}</strong>

                          <span>
                            {method === "Visa"
                              ? "Pay securely via Flutterwave"
                              : method === "Bank Transfer"
                                ? "Pay via bank transfer on Flutterwave"
                                : "Pay in cash when your shipment arrives"}
                          </span>
                        </div>

                        {payment.method === method && (
                          <div className="payment-check">✓</div>
                        )}
                      </button>
                    ),
                  )}

                  <div className="payment-secure-note">
                    <span>🔒</span>

                    <p>
                      Card and bank details are entered directly on
                      Flutterwave's secure checkout page — nothing is stored on
                      our servers.
                    </p>
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}

                <div className="payment-summary-card">
                  <span className="payment-label">PAYMENT SUMMARY</span>

                  <div className="payment-summary-row">
                    <span>Shipment</span>

                    <strong>£{shippingPrice.toFixed(2)}</strong>
                  </div>

                  <div className="payment-summary-row">
                    <span>Insurance</span>

                    <strong>£{insurancePrice.toFixed(2)}</strong>
                  </div>

                  <div className="payment-summary-row">
                    <span>Service fee</span>

                    <strong>£{serviceFee.toFixed(2)}</strong>
                  </div>

                  <div className="payment-summary-divider" />

                  <div className="payment-summary-total">
                    <span>Total</span>

                    <strong>£{total.toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    className="booking-confirm-payment"
                    onClick={handleConfirmPayment}
                    disabled={creatingShipment}
                  >
                    {creatingShipment ? (
                      <>
                        <span className="payment-spinner" />
                        Processing Payment...
                      </>
                    ) : (
                      <>Confirm & Pay £{total.toFixed(2)}</>
                    )}
                  </button>

                  <p className="payment-demo-note">
                    You'll be redirected to a secure Flutterwave checkout page
                    to complete your payment.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* =====================================
              NAVIGATION
          ===================================== */}

          {!creatingShipment && (
            <div className="booking-navigation">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="booking-back-button"
                  onClick={goBack}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {currentStep < 5 && (
                <button
                  type="button"
                  className="booking-next-button"
                  onClick={goNext}
                >
                  {currentStep === 4 ? "Continue to Payment →" : "Continue →"}
                </button>
              )}
            </div>
          )}
        </form>
      </main>
    </DashboardLayout>
  );
};

export default BookShipment;
