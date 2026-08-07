import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FaCircleCheck, FaBoxesStacked, FaShieldHalved } from "react-icons/fa6";

import "../styles/portalSplash.css";

const PortalSplash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="portal-splash">
      <motion.div
        className="portal-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="portal-logo"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          LT
        </motion.div>

        <h1>Welcome Back</h1>

        <p>Preparing your logistics workspace...</p>

        <div className="portal-progress">
          <motion.div
            className="portal-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="portal-status">
          <motion.div
            className="status-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FaShieldHalved />

            <span>Authenticating account</span>

            <FaCircleCheck className="status-check" />
          </motion.div>

          <motion.div
            className="status-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <FaBoxesStacked />

            <span>Syncing shipments</span>

            <FaCircleCheck className="status-check" />
          </motion.div>

          <motion.div
            className="status-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <FaCircleCheck />

            <span>Loading dashboard</span>

            <FaCircleCheck className="status-check" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalSplash;
