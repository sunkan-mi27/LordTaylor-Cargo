import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShip, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary Authentication
    if (form.remember) {
      localStorage.setItem("lordtaylor-auth", "true");
    } else {
      sessionStorage.setItem("lordtaylor-auth", "true");
    }

    navigate("/portal-loading");
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="login-logo">
          <FaShip />
        </div>

        <h1>Welcome Back</h1>

        <p>Sign in to access your shipment dashboard.</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email Address</label>

            <div className="input-box">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="john@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>

            <div className="input-box">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember Me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-btn"
          >
            Sign In
          </motion.button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
