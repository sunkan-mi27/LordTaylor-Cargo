import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import "../styles/portal.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>

      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
