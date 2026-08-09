import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { FaCircleCheck, FaUser, FaGear, FaArrowRight } from "react-icons/fa6";

const AccountSnapshot = () => {
  const account = {
    firstName: "Sunkanmi",
    lastName: "Ibrahim",
    tier: "Standard",
    region: "Nigeria",
    verification: "Verified",
  };

  const initials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`;

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
        <div className="account-avatar">{initials}</div>

        <div className="account-user">
          <h3>
            {account.firstName} {account.lastName}
          </h3>

          <p>Customer Account</p>
        </div>
      </div>

      <div className="account-status">
        <div className="account-status-row">
          <span>Verification</span>

          <strong>
            <FaCircleCheck />

            {account.verification}
          </strong>
        </div>

        <div className="account-status-row">
          <span>Membership</span>

          <strong>{account.tier}</strong>
        </div>

        <div className="account-status-row">
          <span>Region</span>

          <strong>{account.region}</strong>
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
