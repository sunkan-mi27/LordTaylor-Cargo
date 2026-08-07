import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShip, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../styles/forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend Integration Later
    setSent(true);
  };

  return (
    <div className="forgot-page">
      <motion.div
        className="forgot-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="forgot-logo">
          <FaShip />
        </div>

        <h1>Forgot Password?</h1>

        <p>
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="forgot-field">
              <label>Email Address</label>

              <div className="input-box">
                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  placeholder="john@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="forgot-btn"
              type="submit"
            >
              Send Reset Link
            </motion.button>
          </form>
        ) : (
          <motion.div
            className="reset-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>✓ Email Sent</h3>

            <p>
              If an account exists with this email, you'll receive a password
              reset link shortly.
            </p>
          </motion.div>
        )}

        <Link to="/login" className="back-login">
          <FaArrowLeft />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
