import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import "../styles/settings.css";

export default function Settings() {
  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const [notifications, setNotifications] = useState({
    shipmentUpdates: true,
    deliveryAlerts: true,
    promotionalEmails: false,
  });

  /* =========================================================
     DISPLAY
  ========================================================= */

  const [display, setDisplay] = useState({
    language: "English",
    timezone: "West Africa Time (WAT)",
    theme: "Dark",
  });

  /* =========================================================
     PAYMENT METHODS
  ========================================================= */

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      lastFour: "4821",
      expiry: "08/28",
      holder: "Sunkanmi Ibrahim",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      lastFour: "7316",
      expiry: "11/27",
      holder: "Sunkanmi Ibrahim",
      isDefault: false,
    },
  ]);

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [newPayment, setNewPayment] = useState({
    type: "Visa",
    lastFour: "",
    expiry: "",
    holder: "",
  });

  /* =========================================================
     SAVE STATE
  ========================================================= */

  const [saved, setSaved] = useState(false);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const toggleNotification = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handleDisplayChange = (event) => {
    const { name, value } = event.target;

    setDisplay((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  /* =========================================================
     PAYMENT HANDLERS
  ========================================================= */

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setNewPayment((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddPayment = (event) => {
    event.preventDefault();

    if (!newPayment.lastFour || !newPayment.expiry || !newPayment.holder) {
      return;
    }

    const payment = {
      id: Date.now(),
      type: newPayment.type,
      lastFour: newPayment.lastFour.slice(-4),
      expiry: newPayment.expiry,
      holder: newPayment.holder,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods((previous) => [...previous, payment]);

    setNewPayment({
      type: "Visa",
      lastFour: "",
      expiry: "",
      holder: "",
    });

    setShowPaymentForm(false);
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods((previous) =>
      previous.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const removePayment = (id) => {
    setPaymentMethods((previous) => {
      const remaining = previous.filter((method) => method.id !== id);

      if (
        remaining.length > 0 &&
        !remaining.some((method) => method.isDefault)
      ) {
        return remaining.map((method, index) => ({
          ...method,
          isDefault: index === 0,
        }));
      }

      return remaining;
    });
  };

  return (
    <DashboardLayout>
      <main className="settings-page">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="settings-page-header">
          <div>
            <span className="settings-kicker">ACCOUNT PREFERENCES</span>

            <h1>Settings</h1>

            <p>
              Manage your preferences, notifications, account, and payment
              information.
            </p>
          </div>

          <button className="settings-save-button" onClick={handleSave}>
            Save Changes
          </button>
        </section>

        {/* =====================================================
            SAVE NOTICE
        ===================================================== */}

        {saved && (
          <div className="settings-save-notice">
            <span>✓</span>

            <div>
              <strong>Settings updated</strong>

              <p>Your preferences have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* =====================================================
            01 — NOTIFICATIONS
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-panel-heading">
            <div className="settings-panel-number">01</div>

            <div>
              <span className="settings-panel-kicker">COMMUNICATION</span>

              <h2>Notifications</h2>

              <p>Choose how LordTaylor Cargo keeps you informed.</p>
            </div>
          </div>

          <div className="settings-options">
            {/* Shipment Updates */}

            <div className="settings-option">
              <div className="settings-option-icon">◈</div>

              <div className="settings-option-content">
                <strong>Shipment Updates</strong>

                <p>Receive updates when your shipment status changes.</p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  notifications.shipmentUpdates ? "active" : ""
                }`}
                onClick={() => toggleNotification("shipmentUpdates")}
                aria-label="Toggle shipment updates"
              >
                <span />
              </button>
            </div>

            {/* Delivery Alerts */}

            <div className="settings-option">
              <div className="settings-option-icon">◷</div>

              <div className="settings-option-content">
                <strong>Delivery Alerts</strong>

                <p>Get notified about important delivery events.</p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  notifications.deliveryAlerts ? "active" : ""
                }`}
                onClick={() => toggleNotification("deliveryAlerts")}
                aria-label="Toggle delivery alerts"
              >
                <span />
              </button>
            </div>

            {/* Promotional */}

            <div className="settings-option">
              <div className="settings-option-icon">✦</div>

              <div className="settings-option-content">
                <strong>Promotional Emails</strong>

                <p>Receive occasional news, offers, and service updates.</p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  notifications.promotionalEmails ? "active" : ""
                }`}
                onClick={() => toggleNotification("promotionalEmails")}
                aria-label="Toggle promotional emails"
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            02 — DISPLAY & LANGUAGE
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-panel-heading">
            <div className="settings-panel-number">02</div>

            <div>
              <span className="settings-panel-kicker">EXPERIENCE</span>

              <h2>Display &amp; Language</h2>

              <p>
                Customize how the LordTaylor Cargo portal feels and behaves.
              </p>
            </div>
          </div>

          <div className="settings-form">
            {/* Language */}

            <div className="settings-field">
              <label htmlFor="language">LANGUAGE</label>

              <select
                id="language"
                name="language"
                value={display.language}
                onChange={handleDisplayChange}
              >
                <option>English</option>
              </select>
            </div>

            {/* Timezone */}

            <div className="settings-field">
              <label htmlFor="timezone">TIMEZONE</label>

              <select
                id="timezone"
                name="timezone"
                value={display.timezone}
                onChange={handleDisplayChange}
              >
                <option>West Africa Time (WAT)</option>

                <option>Greenwich Mean Time (GMT)</option>

                <option>Coordinated Universal Time (UTC)</option>
              </select>
            </div>
          </div>

          {/* Theme */}

          <div className="settings-option settings-theme-option">
            <div className="settings-option-icon">☾</div>

            <div className="settings-option-content">
              <strong>Appearance</strong>

              <p>Choose how the portal interface should appear.</p>
            </div>

            <select
              value={display.theme}
              onChange={(event) =>
                setDisplay((previous) => ({
                  ...previous,
                  theme: event.target.value,
                }))
              }
              className="settings-field-select"
            >
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
        </section>

        {/* =====================================================
            03 — ACCOUNT MANAGEMENT
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-panel-heading">
            <div className="settings-panel-number">03</div>

            <div>
              <span className="settings-panel-kicker">ACCOUNT</span>

              <h2>Account Management</h2>

              <p>Manage your password and account security.</p>
            </div>
          </div>

          <div className="settings-account-actions">
            {/* Password */}

            <div className="settings-account-row">
              <div>
                <strong>Password</strong>

                <p>
                  Update your account password regularly to keep your account
                  secure.
                </p>
              </div>

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  alert("Password change will be connected to the backend.")
                }
              >
                Change Password
              </button>
            </div>

            {/* Two Factor */}

            <div className="settings-account-row">
              <div>
                <strong>Two-factor authentication</strong>

                <p>
                  Add another layer of protection to your LordTaylor Cargo
                  account.
                </p>
              </div>

              <span className="settings-coming-soon">Coming Soon</span>
            </div>

            {/* Danger */}

            <div className="settings-account-row danger-row">
              <div>
                <strong>Delete Account</strong>

                <p>
                  Permanently remove your account and associated information.
                </p>
              </div>

              <button
                type="button"
                className="settings-danger-button"
                onClick={() =>
                  alert("Account deletion will be connected to the backend.")
                }
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            04 — PAYMENT SETTINGS
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-panel-heading">
            <div className="settings-panel-number">04</div>

            <div>
              <span className="settings-panel-kicker">BILLING</span>

              <h2>Payment Settings</h2>

              <p>
                Manage your saved payment methods and choose your default
                payment option for shipments.
              </p>
            </div>
          </div>

          {/* PAYMENT METHODS */}

          <div className="payment-settings-list">
            {paymentMethods.length === 0 ? (
              <div className="payment-empty-state">
                <div className="payment-empty-icon">+</div>

                <strong>No payment methods saved</strong>

                <p>
                  Add a payment method to make future shipment payments faster.
                </p>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div
                  className={`payment-method ${
                    method.isDefault ? "payment-method-default" : ""
                  }`}
                  key={method.id}
                >
                  {/* CARD ICON */}

                  <div className="payment-method-icon">
                    {method.type === "Visa" ? "V" : "M"}
                  </div>

                  {/* DETAILS */}

                  <div className="payment-method-details">
                    <div className="payment-method-title">
                      <strong>{method.type}</strong>

                      {method.isDefault && (
                        <span className="payment-default-badge">Default</span>
                      )}
                    </div>

                    <span className="payment-card-number">
                      •••• •••• •••• {method.lastFour}
                    </span>

                    <div className="payment-card-meta">
                      <span>{method.holder}</span>

                      <span>Expires {method.expiry}</span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="payment-method-actions">
                    {!method.isDefault && (
                      <button
                        type="button"
                        className="payment-default-button"
                        onClick={() => setDefaultPayment(method.id)}
                      >
                        Set Default
                      </button>
                    )}

                    <button
                      type="button"
                      className="payment-remove-button"
                      onClick={() => removePayment(method.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ADD PAYMENT */}

          {!showPaymentForm ? (
            <button
              type="button"
              className="payment-add-button"
              onClick={() => setShowPaymentForm(true)}
            >
              <span>+</span>
              Add Payment Method
            </button>
          ) : (
            <form className="payment-add-form" onSubmit={handleAddPayment}>
              <div className="payment-form-heading">
                <div>
                  <strong>Add Payment Method</strong>

                  <p>Enter your payment method details.</p>
                </div>
              </div>

              <div className="payment-form-grid">
                {/* TYPE */}

                <div className="settings-field">
                  <label htmlFor="paymentType">CARD TYPE</label>

                  <select
                    id="paymentType"
                    name="type"
                    value={newPayment.type}
                    onChange={handlePaymentChange}
                  >
                    <option>Visa</option>
                    <option>Mastercard</option>
                  </select>
                </div>

                {/* LAST FOUR */}

                <div className="settings-field">
                  <label htmlFor="lastFour">CARD NUMBER</label>

                  <input
                    id="lastFour"
                    name="lastFour"
                    type="text"
                    inputMode="numeric"
                    maxLength="4"
                    placeholder="Last 4 digits"
                    value={newPayment.lastFour}
                    onChange={handlePaymentChange}
                  />
                </div>

                {/* EXPIRY */}

                <div className="settings-field">
                  <label htmlFor="expiry">EXPIRY</label>

                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={newPayment.expiry}
                    onChange={handlePaymentChange}
                  />
                </div>

                {/* HOLDER */}

                <div className="settings-field">
                  <label htmlFor="holder">CARDHOLDER NAME</label>

                  <input
                    id="holder"
                    name="holder"
                    type="text"
                    placeholder="Name on card"
                    value={newPayment.holder}
                    onChange={handlePaymentChange}
                    autoComplete="cc-name"
                  />
                </div>
              </div>

              <div className="payment-form-actions">
                <button
                  type="button"
                  className="settings-secondary-button"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="settings-save-button">
                  Add Payment Method
                </button>
              </div>
            </form>
          )}

          {/* PAYMENT NOTE */}

          <div className="payment-security-note">
            <span>🔒</span>

            <div>
              <strong>Payment security</strong>

              <p>
                Your payment details are only represented here for portal
                settings. Real payment processing will be connected securely
                during backend integration.
              </p>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
