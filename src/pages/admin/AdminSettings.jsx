import { useEffect, useState } from "react";
import { FaGear, FaRotate, FaCircleCheck } from "react-icons/fa6";

import "../../styles/adminSettings.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("lordtaylor-token") ||
      sessionStorage.getItem("lordtaylor-token")
    );
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(`${API_URL}/settings/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load settings");
      }

      setSettings(data.settings);
    } catch (err) {
      console.error("Admin settings error:", err);
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const token = getToken();

      const response = await fetch(`${API_URL}/settings/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipmentUpdates: settings.shipmentUpdates,
          deliveryAlerts: settings.deliveryAlerts,
          promotionalEmails: settings.promotionalEmails,
          language: settings.language,
          timezone: settings.timezone,
          theme: settings.theme,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update settings");
      }

      setSettings(data.settings);
      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Admin settings update error:", err);
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-settings-page">
      <div className="admin-settings-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS / SETTINGS</span>

          <h1>Admin Settings</h1>

          <p>Manage your notification preferences and account defaults.</p>
        </div>
      </div>

      <div className="admin-settings-panel">
        {loading ? (
          <div className="admin-settings-loading">
            <FaRotate className="refresh-spinning" />
            <span>Loading settings...</span>
          </div>
        ) : error && !settings ? (
          <div className="admin-settings-empty">
            <div>
              <FaGear />
            </div>
            <h3>Unable to load settings</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="admin-settings-section">
              <h2>Notifications</h2>

              <div className="admin-settings-row">
                <div>
                  <strong>Shipment updates</strong>
                  <span>Get notified when a shipment status changes.</span>
                </div>

                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!!settings.shipmentUpdates}
                    onChange={() => handleToggle("shipmentUpdates")}
                  />
                  <span className="admin-toggle-track" />
                </label>
              </div>

              <div className="admin-settings-row">
                <div>
                  <strong>Delivery alerts</strong>
                  <span>Get notified when a shipment is delivered.</span>
                </div>

                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!!settings.deliveryAlerts}
                    onChange={() => handleToggle("deliveryAlerts")}
                  />
                  <span className="admin-toggle-track" />
                </label>
              </div>

              <div className="admin-settings-row">
                <div>
                  <strong>Promotional emails</strong>
                  <span>Receive occasional product and feature updates.</span>
                </div>

                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!!settings.promotionalEmails}
                    onChange={() => handleToggle("promotionalEmails")}
                  />
                  <span className="admin-toggle-track" />
                </label>
              </div>
            </div>

            <div className="admin-settings-section">
              <h2>Preferences</h2>

              <div className="admin-settings-field">
                <label>Language</label>
                <select
                  value={settings.language || "English"}
                  onChange={(event) =>
                    handleChange("language", event.target.value)
                  }
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Hausa">Hausa</option>
                  <option value="Igbo">Igbo</option>
                </select>
              </div>

              <div className="admin-settings-field">
                <label>Timezone</label>
                <select
                  value={settings.timezone || "West Africa Time (WAT)"}
                  onChange={(event) =>
                    handleChange("timezone", event.target.value)
                  }
                >
                  <option value="West Africa Time (WAT)">
                    West Africa Time (WAT)
                  </option>
                  <option value="Greenwich Mean Time (GMT)">
                    Greenwich Mean Time (GMT)
                  </option>
                  <option value="Central European Time (CET)">
                    Central European Time (CET)
                  </option>
                </select>
              </div>

              <div className="admin-settings-field">
                <label>Theme</label>
                <select
                  value={settings.theme || "Dark"}
                  onChange={(event) =>
                    handleChange("theme", event.target.value)
                  }
                >
                  <option value="Dark">Dark</option>
                  <option value="Light">Light</option>
                </select>
              </div>
            </div>

            {error && <p className="admin-settings-error">{error}</p>}

            <div className="admin-settings-actions">
              <button
                type="button"
                className="admin-settings-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <FaRotate className="refresh-spinning" />
                ) : saved ? (
                  <FaCircleCheck />
                ) : null}
                {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminSettings;
