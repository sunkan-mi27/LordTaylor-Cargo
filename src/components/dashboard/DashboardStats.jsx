import StatCard from "./StatCard";

import {
  FaShip,
  FaCircleCheck,
  FaFileInvoiceDollar,
  FaClipboardList,
} from "react-icons/fa6";

import shipments from "../../data/shipments";

const DashboardStats = () => {
  const activeShipments = shipments.filter(
    (shipment) => shipment.statusType === "transit",
  ).length;

  const deliveredShipments = shipments.filter(
    (shipment) => shipment.statusType === "delivered",
  ).length;

  const totalShipments = shipments.length;

  const stats = [
    {
      id: 1,
      title: "Active Shipments",
      value: activeShipments,
      icon: FaShip,
      color: "#22c55e",
      change: `${activeShipments} active`,
      positive: true,
    },

    {
      id: 2,
      title: "Delivered",
      value: deliveredShipments,
      icon: FaCircleCheck,
      color: "#3b82f6",
      change: `${deliveredShipments} completed`,
      positive: true,
    },

    {
      id: 3,
      title: "Total Shipments",
      value: totalShipments,
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
