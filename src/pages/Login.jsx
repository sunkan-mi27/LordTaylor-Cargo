import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShip, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in");
      }

      const storage = form.remember ? localStorage : sessionStorage;

      storage.setItem("lordtaylor-token", data.token);
      storage.setItem("lordtaylor-user", JSON.stringify(data.user));

      navigate("/portal-loading");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

        {error && <div className="login-error">{error}</div>}

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
                autoComplete="email"
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
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
