import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import RecentShipments from "../components/dashboard/RecentShipments";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AccountSnapshot from "../components/dashboard/AccountSnapshot";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token =
          localStorage.getItem("lordtaylor-token") ||
          sessionStorage.getItem("lordtaylor-token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          "http://localhost:5000/api/bookings/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load dashboard data");
        }

        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout showTopbar>
      <DashboardHero />

      <DashboardStats stats={dashboardData?.stats} loading={loading} />

      <QuickActions />

      <RecentShipments
        shipments={dashboardData?.recentShipments || []}
        loading={loading}
      />

      <ActivityFeed
        activities={dashboardData?.activity || []}
        loading={loading}
      />

      <AccountSnapshot />
    </DashboardLayout>
  );
};

export default Dashboard;
