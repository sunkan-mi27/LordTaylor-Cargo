import { Link } from "react-router-dom";

import { FaBell, FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6";

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>Dashboard</h1>

        <p>Welcome back, Sunkanmi 👋</p>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <FaMagnifyingGlass />

          <input type="text" placeholder="Search shipments..." />
        </div>

        <button className="notification-btn">
          <FaBell />

          <span className="notification-dot"></span>
        </button>

        <Link to="/profile" className="user-profile">
          <div className="user-avatar">SI</div>

          <div className="user-info">
            <strong>Sunkanmi Ibrahim</strong>

            <small>Customer</small>
          </div>

          <FaChevronDown />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
