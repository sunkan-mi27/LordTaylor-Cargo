import { NavLink, useNavigate } from "react-router-dom";

import {
  FaChartLine,
  FaBox,
  FaLocationDot,
  FaClockRotateLeft,
  FaBell,
  FaUser,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    {
      title: "Dashboard",
      icon: <FaChartLine />,
      path: "/dashboard",
    },
    {
      title: "Book Shipment",
      icon: <FaBox />,
      path: "/book",
    },
    {
      title: "Track Shipment",
      icon: <FaLocationDot />,
      path: "/track",
    },
    {
      title: "History",
      icon: <FaClockRotateLeft />,
      path: "/history",
    },
    {
      title: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
    {
      title: "Settings",
      icon: <FaGear />,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("lordtaylor-token");
    localStorage.removeItem("lordtaylor-user");

    sessionStorage.removeItem("lordtaylor-token");
    sessionStorage.removeItem("lordtaylor-user");

    // Send customer back to login
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>
          Lord<span>Taylor</span>
        </h2>

        <p>Logistics Portal</p>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FaArrowRightFromBracket />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
