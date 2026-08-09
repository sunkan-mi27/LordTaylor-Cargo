import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { useLocation } from "react-router-dom";
import "../styles/portal.css";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>

      <div className="dashboard-main">
        {isDashboard && <Topbar />}

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
