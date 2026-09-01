import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShip,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../../styles/register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/admin-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          adminKey: form.adminKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create admin account.");
        return;
      }

      localStorage.setItem("lordtaylor-token", data.token);
      localStorage.setItem("lordtaylor-user", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin registration error:", error);
      setError(
        "Unable to connect to the server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="register-logo">
          <FaShip />
        </div>

        <h1>Admin Registration</h1>

        <p>Restricted access. A valid admin key is required to continue.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="register-field">
              <label>First Name</label>

              <div className="input-box">
                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label>Last Name</label>

              <div className="input-box">
                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="lastName"
                  placeholder="David"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="register-field">
            <label>Email Address</label>

            <div className="input-box">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="admin@lordtaylorcargo.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Phone Number</label>

            <div className="input-box">
              <FaPhone className="input-icon" />

              <input
                type="tel"
                name="phone"
                placeholder="+44 7123 456789"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Password</label>

            <div className="input-box">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="register-field">
            <label>Confirm Password</label>

            <div className="input-box">
              <FaLock className="input-icon" />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="register-field">
            <label>Admin Key</label>

            <div className="input-box">
              <FaKey className="input-icon" />

              <input
                type="password"
                name="adminKey"
                placeholder="Secret admin key"
                value={form.adminKey}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Admin Account..." : "Create Admin Account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
