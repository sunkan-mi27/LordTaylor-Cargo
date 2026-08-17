import StatCard from "./StatCard";

import {
  FaShip,
  FaCircleCheck,
  FaFileInvoiceDollar,
  FaClipboardList,
} from "react-icons/fa6";

const DashboardStats = ({ stats, loading }) => {
  const dashboardStats = stats || {
    total: 0,
    booked: 0,
    processing: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    totalSpent: 0,
  };

  const cards = [
    {
      id: 1,
      title: "Active Shipments",
      value: dashboardStats.inTransit,
      icon: FaShip,
      color: "#22c55e",
      change: `${dashboardStats.inTransit} active`,
      positive: true,
    },

    {
      id: 2,
      title: "Delivered",
      value: dashboardStats.delivered,
      icon: FaCircleCheck,
      color: "#3b82f6",
      change: `${dashboardStats.delivered} completed`,
      positive: true,
    },

    {
      id: 3,
      title: "Total Shipments",
      value: dashboardStats.total,
      icon: FaClipboardList,
      color: "#f59e0b",
      change: "All time",
      positive: true,
    },

    {
      id: 4,
      title: "Pending Quotes",
      value: "—",
      icon: FaFileInvoiceDollar,
      color: "#ef4444",
      change: "Coming soon",
      positive: false,
    },
  ];

  return (
    <section className="dashboard-stats">
      <div className="section-heading">
        <div>
          <h2>Operations Overview</h2>

          <p>A quick summary of your logistics activities.</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((stat) => {
          const Icon = stat.icon;

          return (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={loading ? "..." : stat.value}
              icon={<Icon />}
              color={stat.color}
              change={stat.change}
              positive={stat.positive}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DashboardStats;
