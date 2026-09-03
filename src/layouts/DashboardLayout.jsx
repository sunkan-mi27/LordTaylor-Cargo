import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { useLocation } from "react-router-dom";
import { FaShip, FaXmark } from "react-icons/fa6";
import "../styles/portal.css";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "active" : ""}`}>
        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          <FaXmark />
        </button>

        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="dashboard-main">
        <div className="mobile-topbar">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <FaShip />
          </button>

          <span className="mobile-topbar-brand">LordTaylor</span>
        </div>

        {isDashboard && <Topbar />}

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
