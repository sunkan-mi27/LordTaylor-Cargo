import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import "../styles/profile.css";

const API_URL = "http://localhost:5000/api";

export default function Profile() {
  /* =========================================
     PERSONAL INFORMATION
  ========================================= */

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    customerId: "",
    memberSince: "",
    accountTier: "Standard",
    country: "",
    city: "",
    avatarUrl: "",
  });

  const [draft, setDraft] = useState(profile);

  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  /* =========================================
     SHIPPING INFORMATION
  ========================================= */

  const [shippingEditing, setShippingEditing] = useState(false);

  const [shipping, setShipping] = useState({
    addressLine: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    addressType: "Residential",
    deliveryPreference: "Standard Delivery",
  });

  const [shippingDraft, setShippingDraft] = useState(shipping);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const token =
          localStorage.getItem("lordtaylor-token") ||
          sessionStorage.getItem("lordtaylor-token");

        if (!token) {
          setProfileError("Your session has expired. Please sign in again.");
          return;
        }

        const response = await fetch(`${API_URL}/profile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your profile");
        }

        const user = data.user;
        const userProfile = user.profile || {};

        setShipping({
          addressLine: userProfile.addressLine || "",
          country: userProfile.country || "",
          state: userProfile.state || "",
          city: userProfile.city || "",
          postalCode: userProfile.postalCode || "",
          addressType: userProfile.addressType || "Residential",
          deliveryPreference:
            userProfile.deliveryPreference || "Standard Delivery",
        });

        const realProfile = {
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          email: user.email || "",
          phone: userProfile.phone || "",
          customerId: user.id || "",
          memberSince: user.createdAt
            ? new Date(user.createdAt).getFullYear().toString()
            : "",
          accountTier: "Standard",
          country: userProfile.country || "",
          city: userProfile.city || "",
          avatarUrl: userProfile.avatarUrl || "",
        };

        setProfile(realProfile);
        setDraft(realProfile);

        // Keep the latest user information available to the app
        const storage = localStorage.getItem("lordtaylor-token")
          ? localStorage
          : sessionStorage;

        storage.setItem("lordtaylor-user", JSON.stringify(user));
      } catch (error) {
        console.error("Profile loading error:", error);
        setProfileError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =========================================
     PERSONAL HANDLERS
  ========================================= */

  const handleEdit = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaved(false);

      const token =
        localStorage.getItem("lordtaylor-token") ||
        sessionStorage.getItem("lordtaylor-token");

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          phone: draft.phone,
          country: draft.country,
          city: draft.city,
          avatarUrl: draft.avatarUrl,

          addressLine: shippingDraft.addressLine,
          state: shippingDraft.state,
          postalCode: shippingDraft.postalCode,
          addressType: shippingDraft.addressType,
          deliveryPreference: shippingDraft.deliveryPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update your profile");
      }

      const updatedProfile = {
        ...profile,
        firstName: data.profile.firstName || "",
        lastName: data.profile.lastName || "",
        phone: data.profile.phone || "",
        country: data.profile.country || "",
        city: data.profile.city || "",
        avatarUrl: data.profile.avatarUrl || "",
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setEditing(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError(error.message);
    }
  };

  /* =========================================
     SHIPPING HANDLERS
  ========================================= */

  const handleShippingEdit = () => {
    setShippingDraft(shipping);
    setShippingEditing(true);
  };

  const handleShippingChange = (event) => {
    const { name, value } = event.target;

    setShippingDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleShippingCancel = () => {
    setShippingDraft(shipping);
    setShippingEditing(false);
  };

  const handleShippingSave = async () => {
    try {
      setProfileError("");

      const token =
        localStorage.getItem("lordtaylor-token") ||
        sessionStorage.getItem("lordtaylor-token");

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          country: shippingDraft.country,
          city: shippingDraft.city,
          avatarUrl: profile.avatarUrl,

          addressLine: shippingDraft.addressLine,
          state: shippingDraft.state,
          postalCode: shippingDraft.postalCode,
          addressType: shippingDraft.addressType,
          deliveryPreference: shippingDraft.deliveryPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update your shipping information",
        );
      }

      setShipping({
        addressLine: data.profile.addressLine || "",
        country: data.profile.country || "",
        state: data.profile.state || "",
        city: data.profile.city || "",
        postalCode: data.profile.postalCode || "",
        addressType: data.profile.addressType || "Residential",
        deliveryPreference:
          data.profile.deliveryPreference || "Standard Delivery",
      });

      setShippingDraft({
        addressLine: data.profile.addressLine || "",
        country: data.profile.country || "",
        state: data.profile.state || "",
        city: data.profile.city || "",
        postalCode: data.profile.postalCode || "",
        addressType: data.profile.addressType || "Residential",
        deliveryPreference:
          data.profile.deliveryPreference || "Standard Delivery",
      });

      setProfile((previous) => ({
        ...previous,
        country: data.profile.country || "",
        city: data.profile.city || "",
      }));

      setShippingEditing(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Shipping update error:", error);
      setProfileError(error.message);
    }
  };

  /* =========================================
     DERIVED VALUES
  ========================================= */

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const initials = `${profile.firstName.charAt(
    0,
  )}${profile.lastName.charAt(0)}`;

  /* =========================================
     PAGE
  ========================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <main className="profile-page">
          {profileError && <div className="profile-error">{profileError}</div>}

          <div className="profile-loading">Loading your profile...</div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="profile-page">
        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <section className="profile-page-header">
          <div>
            <span className="profile-kicker">ACCOUNT CENTER</span>

            <h1>Profile</h1>

            <p>
              Manage your account details, preferences, and shipping
              information.
            </p>
          </div>

          {!editing ? (
            <button className="profile-edit-button" onClick={handleEdit}>
              <span className="profile-edit-icon">✎</span>
              Edit Profile
            </button>
          ) : (
            <div className="profile-action-group">
              <button className="profile-cancel-button" onClick={handleCancel}>
                Cancel
              </button>

              <button className="profile-save-button" onClick={handleSave}>
                <span>✓</span>
                Save Changes
              </button>
            </div>
          )}
        </section>

        {/* =====================================
            SAVE NOTICE
        ===================================== */}

        {saved && (
          <div className="profile-save-notice">
            <span>✓</span>

            <div>
              <strong>Profile updated</strong>

              <p>Your account information has been saved.</p>
            </div>
          </div>
        )}

        {/* =====================================
            PROFILE IDENTITY
        ===================================== */}

        <section className="profile-identity-card">
          <div className="profile-identity-main">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <span>{initials}</span>
              </div>

              <span className="profile-avatar-status" />
            </div>

            <div className="profile-identity-info">
              <div className="profile-name-line">
                <h2>{fullName}</h2>

                <span className="profile-verified">
                  <span>✓</span>
                  Verified Customer
                </span>
              </div>

              <p className="profile-email">{profile.email}</p>

              <div className="profile-meta-row">
                <span>
                  Customer ID
                  <strong>{profile.customerId}</strong>
                </span>

                <span className="profile-meta-divider" />

                <span>
                  Member since
                  <strong>{profile.memberSince}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="profile-tier">
            <span className="profile-tier-label">ACCOUNT TIER</span>

            <div className="profile-tier-value">
              <span className="profile-tier-dot" />

              {profile.accountTier}
            </div>

            <span className="profile-tier-description">Active customer</span>
          </div>
        </section>

        {/* =====================================
            PROFILE COMPLETION
        ===================================== */}

        <section className="profile-completion">
          <div className="profile-completion-left">
            <div className="profile-completion-icon">✓</div>

            <div>
              <span className="profile-completion-label">
                PROFILE COMPLETION
              </span>

              <strong>75% complete</strong>

              <p>
                Add your shipping address and preferences to complete your
                profile.
              </p>
            </div>
          </div>

          <div className="profile-completion-progress">
            <div className="profile-progress-track">
              <div className="profile-progress-fill" style={{ width: "75%" }} />
            </div>

            <span>75%</span>
          </div>
        </section>

        {/* =====================================
            PERSONAL INFORMATION
        ===================================== */}

        <section className="profile-personal-card">
          <div className="profile-panel-top">
            <div className="profile-panel-index">01</div>

            <div>
              <span className="profile-panel-kicker">ACCOUNT</span>

              <h3>Personal Information</h3>
            </div>
          </div>

          <p className="profile-panel-description">
            Keep your personal and contact information up to date.
          </p>

          <div className={`profile-form ${editing ? "is-editing" : ""}`}>
            {/* FIRST NAME */}

            <div className="profile-form-field">
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={editing ? draft.firstName : profile.firstName}
                onChange={handleChange}
                disabled={!editing}
                autoComplete="given-name"
              />
            </div>

            {/* LAST NAME */}

            <div className="profile-form-field">
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={editing ? draft.lastName : profile.lastName}
                onChange={handleChange}
                disabled={!editing}
                autoComplete="family-name"
              />
            </div>

            {/* EMAIL */}

            <div className="profile-form-field profile-field-wide">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={editing ? draft.email : profile.email}
                onChange={handleChange}
                disabled={!editing}
                autoComplete="email"
              />

              <span className="profile-field-note">
                This is the email associated with your account.
              </span>
            </div>

            {/* PHONE */}

            <div className="profile-form-field">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={editing ? draft.phone : profile.phone}
                onChange={handleChange}
                disabled={!editing}
                autoComplete="tel"
              />
            </div>
          </div>
        </section>

        {/* =====================================
            SHIPPING INFORMATION
        ===================================== */}

        <section className="profile-shipping-card">
          <div className="profile-section-header">
            <div className="profile-panel-top">
              <div className="profile-panel-index">02</div>

              <div>
                <span className="profile-panel-kicker">SHIPPING</span>

                <h3>Shipping Information</h3>
              </div>
            </div>

            {!shippingEditing ? (
              <button
                className="profile-section-edit"
                onClick={handleShippingEdit}
              >
                ✎ Edit
              </button>
            ) : (
              <div className="profile-shipping-actions">
                <button
                  className="profile-shipping-cancel"
                  onClick={handleShippingCancel}
                >
                  Cancel
                </button>

                <button
                  className="profile-shipping-save"
                  onClick={handleShippingSave}
                >
                  ✓ Save
                </button>
              </div>
            )}
          </div>

          <p className="profile-panel-description">
            Your default delivery location and shipping preferences.
          </p>

          {!shippingEditing ? (
            <>
              {/* DEFAULT ADDRESS */}

              <div className="profile-default-address">
                <div className="profile-address-heading">
                  <div className="profile-address-icon">⌖</div>

                  <div>
                    <span className="profile-address-label">
                      DEFAULT DELIVERY ADDRESS
                    </span>

                    <strong>{shipping.addressLine}</strong>
                  </div>

                  <span className="profile-default-badge">Default</span>
                </div>

                <div className="profile-address-grid">
                  <div>
                    <span>Country</span>

                    <strong>{shipping.country}</strong>
                  </div>

                  <div>
                    <span>State</span>

                    <strong>{shipping.state}</strong>
                  </div>

                  <div>
                    <span>City</span>

                    <strong>{shipping.city}</strong>
                  </div>

                  <div>
                    <span>Postal Code</span>

                    <strong>{shipping.postalCode}</strong>
                  </div>
                </div>
              </div>

              {/* SHIPPING PREFERENCES */}

              <div className="profile-shipping-preferences">
                <div className="profile-preference">
                  <span className="profile-preference-icon">▣</span>

                  <div>
                    <span>Address Type</span>

                    <strong>{shipping.addressType}</strong>
                  </div>
                </div>

                <div className="profile-preference">
                  <span className="profile-preference-icon">◷</span>

                  <div>
                    <span>Delivery Preference</span>

                    <strong>{shipping.deliveryPreference}</strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* SHIPPING EDIT FORM */

            <div className="profile-shipping-form">
              {/* ADDRESS */}

              <div className="profile-shipping-field profile-shipping-wide">
                <label htmlFor="addressLine">Street Address</label>

                <input
                  id="addressLine"
                  name="addressLine"
                  type="text"
                  value={shippingDraft.addressLine}
                  onChange={handleShippingChange}
                  autoComplete="street-address"
                />
              </div>

              {/* COUNTRY */}

              <div className="profile-shipping-field">
                <label htmlFor="country">Country</label>

                <select
                  id="country"
                  name="country"
                  value={shippingDraft.country}
                  onChange={handleShippingChange}
                >
                  <option>Nigeria</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
              </div>

              {/* STATE */}

              <div className="profile-shipping-field">
                <label htmlFor="state">State</label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={shippingDraft.state}
                  onChange={handleShippingChange}
                  autoComplete="address-level1"
                />
              </div>

              {/* CITY */}

              <div className="profile-shipping-field">
                <label htmlFor="city">City</label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingDraft.city}
                  onChange={handleShippingChange}
                  autoComplete="address-level2"
                />
              </div>

              {/* POSTAL CODE */}

              <div className="profile-shipping-field">
                <label htmlFor="postalCode">Postal Code</label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={shippingDraft.postalCode}
                  onChange={handleShippingChange}
                  autoComplete="postal-code"
                />
              </div>

              {/* ADDRESS TYPE */}

              <div className="profile-shipping-field">
                <label htmlFor="addressType">Address Type</label>

                <select
                  id="addressType"
                  name="addressType"
                  value={shippingDraft.addressType}
                  onChange={handleShippingChange}
                >
                  <option>Residential</option>

                  <option>Business</option>

                  <option>Warehouse</option>
                </select>
              </div>

              {/* DELIVERY PREFERENCE */}

              <div className="profile-shipping-field">
                <label htmlFor="deliveryPreference">Delivery Preference</label>

                <select
                  id="deliveryPreference"
                  name="deliveryPreference"
                  value={shippingDraft.deliveryPreference}
                  onChange={handleShippingChange}
                >
                  <option>Standard Delivery</option>

                  <option>Express Delivery</option>

                  <option>Contact Before Delivery</option>
                </select>
              </div>
            </div>
          )}
        </section>

        {/* =====================================
            SECURITY
        ===================================== */}

        <section className="profile-security-card">
          <div className="profile-panel-top">
            <div className="profile-panel-index">03</div>

            <div>
              <span className="profile-panel-kicker">PROTECTION</span>

              <h3>Security</h3>
            </div>
          </div>

          <p className="profile-panel-description">
            Keep your LordTaylor Cargo account protected.
          </p>

          <div className="profile-security-preview">
            {/* PASSWORD */}

            <div className="profile-security-item">
              <div className="profile-security-icon">◆</div>

              <div>
                <strong>Password</strong>

                <p>Your account password is protected.</p>
              </div>

              <span className="profile-security-state">Protected</span>
            </div>

            {/* TWO FACTOR */}

            <div className="profile-security-item">
              <div className="profile-security-icon">+</div>

              <div>
                <strong>Two-factor authentication</strong>

                <p>Add another layer of protection to your account.</p>
              </div>

              <span className="profile-security-coming">Coming Soon</span>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
