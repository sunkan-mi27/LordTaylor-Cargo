import StatCard from "./StatCard";

import {
  FaShip,
  FaCircleCheck,
  FaFileInvoiceDollar,
  FaClipboardList,
} from "react-icons/fa6";

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: "Active Shipments",
      value: "14",
      icon: <FaShip />,
      color: "#22c55e",
      change: "+12%",
      positive: true,
    },
    {
      id: 2,
      title: "Delivered",
      value: "128",
      icon: <FaCircleCheck />,
      color: "#3b82f6",
      change: "+8%",
      positive: true,
    },
    {
      id: 3,
      title: "Pending Quotes",
      value: "6",
      icon: <FaClipboardList />,
      color: "#f59e0b",
      change: "+2",
      positive: true,
    },
    {
      id: 4,
      title: "Payments Due",
      value: "£2,480",
      icon: <FaFileInvoiceDollar />,
      color: "#ef4444",
      change: "-1",
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
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            positive={stat.positive}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
