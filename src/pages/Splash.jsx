import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShip } from "react-icons/fa6";
import "../styles/splash.css";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isAuthenticated =
        localStorage.getItem("lordtaylor-auth") ||
        sessionStorage.getItem("lordtaylor-auth");

      if (isAuthenticated) {
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <motion.div
        className="splash-content"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="splash-logo"
          animate={{
            rotate: [0, -8, 8, -4, 4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaShip />
        </motion.div>

        <motion.h1
          className="splash-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          LordTaylor
        </motion.h1>

        <motion.p
          className="splash-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Secure Cargo Logistics
        </motion.p>

        <motion.p
          className="splash-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Connecting the United Kingdom & Nigeria
        </motion.p>

        <div className="loading-wrapper">
          <motion.div
            className="loading-bar"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.span
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Initializing Portal...
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Splash;
