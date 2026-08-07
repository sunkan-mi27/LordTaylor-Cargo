import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import RecentShipments from "../components/dashboard/RecentShipments";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AccountSnapshot from "../components/dashboard/AccountSnapshot";

import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHero />

      <DashboardStats />

      <QuickActions />

      <RecentShipments />

      <ActivityFeed />

      <AccountSnapshot />
    </DashboardLayout>
  );
};

export default Dashboard;
