import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import "../styles/booking.css";

const BookShipment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [errors, setErrors] = useState({});
  const [isBooking, setIsBooking] = useState(false);
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
  const [parcel, setParcel] = useState({
    packageType: "Standard Box",
    weight: "",
    value: "",
    length: "",
    width: "",
    height: "",
    description: "",
  });

  const handleSenderChange = (e) => {
    const { name, value } = e.target;

    setSender((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;

    setReceiver((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
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

    setParcel((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    // STEP 1
    if (currentStep === 1) {
      if (!sender.fullName.trim()) newErrors.fullName = "Full name is required";

      if (!sender.email.trim()) newErrors.email = "Email is required";

      if (!sender.phone.trim()) newErrors.phone = "Phone number is required";

      if (!sender.address.trim())
        newErrors.address = "Collection address is required";
    }

    // STEP 2
    if (currentStep === 2) {
      if (!receiver.fullName.trim())
        newErrors.receiverName = "Receiver name is required";

      if (!receiver.email.trim()) newErrors.receiverEmail = "Email is required";

      if (!receiver.phone.trim())
        newErrors.receiverPhone = "Phone number is required";

      if (!receiver.address.trim())
        newErrors.receiverAddress = "Delivery address is required";
    }

    // STEP 3
    if (currentStep === 3) {
      if (!parcel.weight.trim()) newErrors.weight = "Weight is required";

      if (!parcel.value.trim()) newErrors.value = "Parcel value is required";

      if (!parcel.length.trim()) newErrors.length = "Length is required";

      if (!parcel.width.trim()) newErrors.width = "Width is required";

      if (!parcel.height.trim()) newErrors.height = "Height is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const selectPackage = (type) => {
    setParcel((prev) => ({
      ...prev,
      packageType: type,
    }));
  };

  const handleBooking = () => {
    setCreatingShipment(true);

    setTimeout(() => {
      const id =
        "LT-" +
        new Date().getFullYear() +
        Math.floor(100000 + Math.random() * 900000);

      setTrackingId(id);

      setCreatingShipment(false);

      setBookingComplete(true);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="booking-page">
        {/* ===========================
              PAGE HEADER
        =========================== */}

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

        {/* ===========================
              STEP INDICATOR
        =========================== */}

        <div className="booking-steps">
          {[1, 2, 3, 4].map((step) => (
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
              </p>
            </div>
          ))}
        </div>

        {/* ===========================
              FORM CARD
        =========================== */}

        <form className="booking-form">
          {/* ===========================
        STEP 1
  =========================== */}

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
                    placeholder="John Smith"
                    className={errors.fullName ? "input-error" : ""}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={sender.email}
                    onChange={handleSenderChange}
                    placeholder="john@email.com"
                    className={errors.email ? "input-error" : ""}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={sender.phone}
                    onChange={handleSenderChange}
                    placeholder="+44 7000 000000"
                    className={errors.phone ? "input-error" : ""}
                  />
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
              </div>

              <div className="form-group full-width">
                <label>Collection Address</label>

                <textarea
                  rows="5"
                  name="address"
                  value={sender.address}
                  onChange={handleSenderChange}
                  placeholder="Enter full collection address..."
                  className={errors.address ? "input-error" : ""}
                />
              </div>
            </>
          )}

          {/* ===========================
        STEP 2
  =========================== */}

          {currentStep === 2 && (
            <>
              <div className="booking-card-header">
                <h2>Receiver Information</h2>

                <p>Tell us where the shipment should be delivered.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Receiver Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={receiver.fullName}
                    onChange={handleReceiverChange}
                    placeholder="Receiver Full Name"
                    className={errors.receiverName ? "input-error" : ""}
                  />
                  {errors.receiverName && (
                    <small className="error-text">{errors.receiverName}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={receiver.email}
                    onChange={handleReceiverChange}
                    placeholder="receiver@email.com"
                    className={errors.receiverEmail ? "input-error" : ""}
                  />

                  {errors.receiverEmail && (
                    <small className="error-text">{errors.receiverEmail}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={receiver.phone}
                    onChange={handleReceiverChange}
                    placeholder="+234 800 000 0000"
                    className={errors.receiverPhone ? "input-error" : ""}
                  />

                  {errors.receiverPhone && (
                    <small className="error-text">{errors.receiverPhone}</small>
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
                    placeholder="Lagos"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={receiver.city}
                    onChange={handleReceiverChange}
                    placeholder="Lekki"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={receiver.postalCode}
                    onChange={handleReceiverChange}
                    placeholder="101245"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Delivery Address</label>

                <textarea
                  rows="5"
                  name="address"
                  value={receiver.address}
                  onChange={handleReceiverChange}
                  placeholder="Enter full delivery address..."
                  className={errors.receiverAddress ? "input-error" : ""}
                />

                {errors.receiverAddress && (
                  <small className="error-text">{errors.receiverAddress}</small>
                )}
              </div>
            </>
          )}
          {/* ===========================
      STEP 3
=========================== */}

          {currentStep === 3 && (
            <>
              <div className="booking-card-header">
                <h2>Parcel Information</h2>

                <p>Tell us about the shipment you're sending.</p>
              </div>

              <div className="parcel-layout">
                {/* =====================
            LEFT SIDE============= */}

                <div className="parcel-form">
                  <div className="package-type">
                    <label>Package Type</label>

                    <div className="package-grid">
                      <div
                        className={`package-card ${
                          parcel.packageType === "Standard Box" ? "active" : ""
                        }`}
                        onClick={() => selectPackage("Standard Box")}
                      >
                        <span>📦</span>

                        <h4>Box</h4>

                        <p>Standard Packages</p>
                      </div>

                      <div
                        className={`package-card ${
                          parcel.packageType === "Documents" ? "active" : ""
                        }`}
                        onClick={() => selectPackage("Documents")}
                      >
                        <span>📄</span>

                        <h4>Documents</h4>

                        <p>Files & Papers</p>
                      </div>

                      <div
                        className={`package-card ${
                          parcel.packageType === "Pallet" ? "active" : ""
                        }`}
                        onClick={() => selectPackage("Pallet")}
                      >
                        <span>🪵</span>

                        <h4>Pallet</h4>

                        <p>Bulk Cargo</p>
                      </div>

                      <div
                        className={`package-card ${
                          parcel.packageType === "Fragile" ? "active" : ""
                        }`}
                        onClick={() => selectPackage("Fragile")}
                      >
                        <span>🍷</span>

                        <h4>Fragile</h4>

                        <p>Handle Carefully</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Weight (kg)</label>

                      <input
                        type="number"
                        name="weight"
                        value={parcel.weight}
                        onChange={handleParcelChange}
                        placeholder="0.00"
                        className={errors.weight ? "input-error" : ""}
                      />
                      {errors.weight && (
                        <small className="error-text">{errors.weight}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Declared Value (£)</label>

                      <input
                        type="number"
                        name="value"
                        value={parcel.value}
                        onChange={handleParcelChange}
                        placeholder="0.00"
                        className={errors.value ? "input-error" : ""}
                      />

                      {errors.value && (
                        <small className="error-text">{errors.value}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Length (cm)</label>

                      <input
                        type="number"
                        name="length"
                        value={parcel.length}
                        onChange={handleParcelChange}
                        placeholder="0"
                        className={errors.length ? "input-error" : ""}
                      />

                      {errors.length && (
                        <small className="error-text">{errors.length}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Width (cm)</label>

                      <input
                        type="number"
                        name="width"
                        value={parcel.width}
                        onChange={handleParcelChange}
                        placeholder="0"
                        className={errors.width ? "input-error" : ""}
                      />

                      {errors.width && (
                        <small className="error-text">{errors.width}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Height (cm)</label>

                      <input
                        type="number"
                        name="height"
                        value={parcel.height}
                        onChange={handleParcelChange}
                        placeholder="0"
                        className={errors.height ? "input-error" : ""}
                      />

                      {errors.height && (
                        <small className="error-text">{errors.height}</small>
                      )}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Shipment Description</label>

                    <textarea
                      rows="5"
                      name="description"
                      value={parcel.description}
                      onChange={handleParcelChange}
                      placeholder="Describe the contents..."
                    />
                  </div>
                </div>

                {/* =====================
            RIGHT SIDE
      ===================== */}

                <div className="shipment-preview">
                  <h3>📦 Shipment Preview</h3>

                  <div className="preview-item">
                    <span>Package</span>

                    <strong>{parcel.packageType}</strong>
                  </div>

                  <div className="preview-item">
                    <span>Weight</span>

                    <strong>
                      <strong>{parcel.weight || "--"} kg</strong>
                    </strong>
                  </div>

                  <div className="preview-item">
                    <span>Dimensions</span>

                    <strong>
                      <strong>
                        {parcel.length || "--"} × {parcel.width || "--"} ×{" "}
                        {parcel.height || "--"}
                      </strong>
                    </strong>
                  </div>

                  <div className="preview-item">
                    <span>Shipping</span>

                    <strong>Not Selected</strong>
                  </div>

                  <div className="preview-item">
                    <span>Insurance</span>

                    <strong>Included</strong>
                  </div>

                  <div className="preview-divider"></div>

                  <div className="preview-total">
                    <span>Estimated Cost</span>

                    <h2>£{parcel.value || "0.00"}</h2>
                  </div>

                  <div className="preview-arrival">
                    🚚 ETA will appear after shipping method selection.
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              {bookingComplete ? (
                <div className="booking-success-card">
                  <div className="success-icon">✓</div>

                  <span className="success-badge">Shipment Confirmed</span>

                  <h2>Booking Completed Successfully</h2>

                  <p className="success-text">
                    Your shipment has been successfully booked. A tracking ID
                    has been generated and your shipment is now awaiting pickup.
                  </p>

                  <div className="success-grid">
                    <div className="success-item">
                      <span>Tracking Number</span>
                      <strong>
                        LT-{Math.floor(Math.random() * 900000000 + 100000000)}
                      </strong>
                    </div>

                    <div className="success-item">
                      <span>Status</span>
                      <strong className="green">Confirmed</strong>
                    </div>

                    <div className="success-item">
                      <span>Estimated Delivery</span>
                      <strong>3–5 Business Days</strong>
                    </div>

                    <div className="success-item">
                      <span>Insurance</span>
                      <strong>Included</strong>
                    </div>
                  </div>

                  <div className="shipment-summary">
                    <h3>Shipment Summary</h3>

                    <div className="summary-row">
                      <span>Package</span>
                      <strong>{parcel.packageType}</strong>
                    </div>

                    <div className="summary-row">
                      <span>Weight</span>
                      <strong>{parcel.weight} kg</strong>
                    </div>

                    <div className="summary-row">
                      <span>Dimensions</span>
                      <strong>
                        {parcel.length} × {parcel.width} × {parcel.height} cm
                      </strong>
                    </div>

                    <div className="summary-row">
                      <span>Declared Value</span>
                      <strong>£ {parcel.value}</strong>
                    </div>
                  </div>

                  <div className="success-buttons">
                    <button className="primary-success-btn">
                      Track Shipment →
                    </button>

                    <button
                      className="secondary-success-btn"
                      onClick={() => window.print()}
                    >
                      Download Receipt
                    </button>

                    <button
                      className="ghost-success-btn"
                      onClick={() => {
                        setCurrentStep(1);

                        setBookingComplete(false);

                        setSender({
                          fullName: "",
                          email: "",
                          phone: "",
                          country: "",
                          address: "",
                        });

                        setReceiver({
                          fullName: "",
                          email: "",
                          phone: "",
                          country: "",
                          state: "",
                          city: "",
                          postalCode: "",
                          address: "",
                        });

                        setParcel({
                          packageType: "Standard Box",
                          weight: "",
                          value: "",
                          length: "",
                          width: "",
                          height: "",
                          description: "",
                        });
                      }}
                    >
                      Book Another Shipment
                    </button>
                  </div>
                </div>
              ) : creatingShipment ? (
                <div className="booking-loading">
                  <div className="loader-circle"></div>

                  <h2>Creating Shipment...</h2>

                  <p>Generating Tracking Number</p>
                </div>
              ) : (
                <div className="review-card">
                  <div className="review-header">
                    <h2>Shipment Review</h2>
                    <p>
                      Please review every detail before confirming your
                      shipment.
                    </p>
                  </div>

                  <div className="review-grid">
                    {/* Sender */}

                    <div className="review-section">
                      <h3>👤 Sender</h3>

                      <div className="review-item">
                        <span>Name</span>
                        <strong>{sender.fullName}</strong>
                      </div>

                      <div className="review-item">
                        <span>Email</span>
                        <strong>{sender.email}</strong>
                      </div>

                      <div className="review-item">
                        <span>Phone</span>
                        <strong>{sender.phone}</strong>
                      </div>

                      <div className="review-item">
                        <span>Country</span>
                        <strong>{sender.country}</strong>
                      </div>

                      <div className="review-item">
                        <span>Address</span>
                        <strong>{sender.address}</strong>
                      </div>
                    </div>

                    {/* Receiver */}

                    <div className="review-section">
                      <h3>📍 Receiver</h3>

                      <div className="review-item">
                        <span>Name</span>
                        <strong>{receiver.fullName}</strong>
                      </div>

                      <div className="review-item">
                        <span>Email</span>
                        <strong>{receiver.email}</strong>
                      </div>

                      <div className="review-item">
                        <span>Phone</span>
                        <strong>{receiver.phone}</strong>
                      </div>

                      <div className="review-item">
                        <span>Country</span>
                        <strong>{receiver.country}</strong>
                      </div>

                      <div className="review-item">
                        <span>Address</span>
                        <strong>{receiver.address}</strong>
                      </div>
                    </div>

                    {/* Parcel */}

                    <div className="review-section full-width">
                      <h3>📦 Parcel Details</h3>

                      <div className="parcel-review-grid">
                        <div className="review-item">
                          <span>Package</span>
                          <strong>{parcel.packageType}</strong>
                        </div>

                        <div className="review-item">
                          <span>Weight</span>
                          <strong>{parcel.weight} kg</strong>
                        </div>

                        <div className="review-item">
                          <span>Dimensions</span>
                          <strong>
                            {parcel.length} × {parcel.width} × {parcel.height}
                          </strong>
                        </div>

                        <div className="review-item">
                          <span>Shipping</span>
                          <strong>{parcel.shippingMethod}</strong>
                        </div>

                        <div className="review-item">
                          <span>Insurance</span>
                          <strong>
                            {parcel.insurance ? "Included" : "Not Included"}
                          </strong>
                        </div>

                        <div className="review-item">
                          <span>Declared Value</span>
                          <strong>£{parcel.value}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button className="secondary-btn">Save Draft</button>

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={async () => {
                        setIsBooking(true);

                        await new Promise((resolve) =>
                          setTimeout(resolve, 1800),
                        );

                        setIsBooking(false);

                        setBookingComplete(true);
                      }}
                      disabled={isBooking}
                    >
                      {isBooking && <span className="btn-spinner"></span>}
                      {isBooking ? "Booking Shipment..." : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===========================
        BUTTONS
  =========================== */}

          <div className="booking-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="back-btn"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Back
              </button>
            )}

            {currentStep < 4 && (
              <button
                type="button"
                className="next-btn"
                onClick={() => {
                  if (validateStep()) {
                    setCurrentStep(currentStep + 1);
                  }
                }}
              >
                Continue →
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookShipment;
