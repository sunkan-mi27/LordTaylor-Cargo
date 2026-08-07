import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { FaShip } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navigate = useNavigate();

  const scrollToSection = (id) => {
    closeMenu();

    const section = document.querySelector(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        {/* =======================
              LOGO
        ======================= */}

        <div className="logo" onClick={() => scrollToSection("#home")}>
          <div className="logo-icon">
            <FaShip />
          </div>

          <div className="logo-text">
            <h2 className="company-name">LordTaylor</h2>

            <span className="company-tagline">Cargo Experience</span>
          </div>
        </div>

        {/* =======================
             DESKTOP LINKS
        ======================= */}

        <div className="nav-links">
          <a onClick={() => scrollToSection("#home")}>Home</a>

          <a onClick={() => scrollToSection("#tracking")}>Tracking</a>

          <a onClick={() => scrollToSection("#quote")}>Quote</a>

          <a onClick={() => scrollToSection("#booking")}>Book</a>
        </div>

        {/* =======================
             RIGHT SIDE
        ======================= */}

        <div className="navbar-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="demo-btn">
            Get Started
            <FaArrowRight />
          </Link>

          <button className="menu-btn" onClick={() => setMenuOpen(true)}>
            <FaBars />
          </button>
        </div>
      </motion.nav>
      {/* =======================
           MOBILE MENU
      ======================= */}

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />

            <motion.aside
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
              }}
            >
              <button className="close-btn" onClick={closeMenu}>
                <FaTimes />
              </button>

              <div className="mobile-logo">
                <div className="logo-icon">
                  <FaShip />
                </div>

                <div className="logo-text">
                  <h2 className="company-name">LordTaylor</h2>

                  <span className="company-tagline">Cargo Experience</span>
                </div>
              </div>

              <nav className="mobile-links">
                <a onClick={() => scrollToSection("#home")}>Home</a>

                <a onClick={() => scrollToSection("#tracking")}>Tracking</a>

                <a onClick={() => scrollToSection("#quote")}>Quote</a>

                <a onClick={() => scrollToSection("#booking")}>Book Shipment</a>

                <a onClick={() => scrollToSection("#contact")}>Contact Us</a>

                <Link
                  to="/login"
                  className="mobile-login-btn"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="mobile-register-btn"
                  onClick={closeMenu}
                >
                  Create Account
                </Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
