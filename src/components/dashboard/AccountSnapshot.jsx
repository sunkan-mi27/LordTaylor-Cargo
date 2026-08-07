import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import { FaCircleCheck, FaUser, FaGear, FaArrowRight } from "react-icons/fa6";

const AccountSnapshot = () => {
  return (
    <motion.section
      className="account-snapshot"
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="account-header">
        <div className="account-avatar">SI</div>

        <div className="account-user">
          <h3>Sunkanmi Ibrahim</h3>

          <p>Customer Account</p>
        </div>
      </div>

      <div className="account-status">
        <div className="account-status-row">
          <span>Verification</span>

          <strong>
            <FaCircleCheck />
            Verified
          </strong>
        </div>

        <div className="account-status-row">
          <span>Membership</span>

          <strong>Standard</strong>
        </div>

        <div className="account-status-row">
          <span>Region</span>

          <strong>United Kingdom</strong>
        </div>
      </div>

      <div className="account-actions">
        <Link to="/profile" className="account-btn">
          <FaUser />
          My Profile
        </Link>

        <Link to="/settings" className="account-btn">
          <FaGear />
          Settings
        </Link>
      </div>

      <Link to="/profile" className="manage-account">
        Manage Account
        <FaArrowRight />
      </Link>
    </motion.section>
  );
};

export default AccountSnapshot;
