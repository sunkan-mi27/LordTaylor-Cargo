import { NavLink } from "react-router-dom";

import {
  FaChartLine,
  FaBox,
  FaLocationDot,
  FaFileInvoiceDollar,
  FaClockRotateLeft,
  FaUser,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

const Sidebar = () => {
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
      title: "Quotes",
      icon: <FaFileInvoiceDollar />,
      path: "/quote",
    },
    {
      title: "History",
      icon: <FaClockRotateLeft />,
      path: "/history",
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
        <button className="logout-btn">
          <FaArrowRightFromBracket />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
