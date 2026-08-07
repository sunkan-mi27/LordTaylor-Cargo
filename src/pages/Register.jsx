import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShip,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/register.css";

const Register = () => {
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
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend Integration Later
    navigate("/home");
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

        <h1>Create Account</h1>

        <p>
          Join LordTaylor Cargo and manage all your shipments from one secure
          dashboard.
        </p>

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
                placeholder="john@email.com"
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="register-btn"
            type="submit"
          >
            Create Account
          </motion.button>
        </form>

        <div className="register-divider">
          <span>OR</span>
        </div>

        <p className="signin-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
