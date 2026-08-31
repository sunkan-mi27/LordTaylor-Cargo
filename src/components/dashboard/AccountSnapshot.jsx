import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  FaCircleCheck,
  FaUser,
  FaGear,
  FaArrowRight,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

const AccountSnapshot = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lordtaylor-token");
    localStorage.removeItem("lordtaylor-user");

    sessionStorage.removeItem("lordtaylor-token");
    sessionStorage.removeItem("lordtaylor-user");

    navigate("/login", { replace: true });
  };

  const storedUser =
    localStorage.getItem("lordtaylor-user") ||
    sessionStorage.getItem("lordtaylor-user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const firstName = user?.firstName || user?.name?.split(" ")[0] || "Customer";

  const lastName =
    user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "";

  const tier = user?.tier || "Standard";
  const region = user?.region || "Nigeria";
  const verification = user?.verification || "Verified";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

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
            {firstName} {lastName}
          </h3>

          <p>Customer Account</p>
        </div>
      </div>

      <div className="account-status">
        <div className="account-status-row">
          <span>Verification</span>

          <strong>
            <FaCircleCheck />
            {verification}
          </strong>
        </div>

        <div className="account-status-row">
          <span>Membership</span>

          <strong>{tier}</strong>
        </div>

        <div className="account-status-row">
          <span>Region</span>

          <strong>{region}</strong>
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

      <div className="manage-account-row">
        <Link to="/profile" className="manage-account">
          Manage Account
          <FaArrowRight />
        </Link>

        <button
          type="button"
          className="manage-account-logout"
          onClick={handleLogout}
        >
          Logout
          <FaArrowRightFromBracket />
        </button>
      </div>
    </motion.section>
  );
};

export default AccountSnapshot;
