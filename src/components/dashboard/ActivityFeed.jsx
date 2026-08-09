import { motion } from "framer-motion";
import { FaCircleCheck, FaShip, FaBoxOpen } from "react-icons/fa6";

import shipments from "../../data/shipments";

const getActivityIcon = (shipment) => {
  if (shipment.statusType === "delivered") {
    return FaCircleCheck;
  }

  if (shipment.statusType === "transit") {
    return FaShip;
  }

  return FaBoxOpen;
};

const getActivityColor = (shipment) => {
  if (shipment.statusType === "delivered") {
    return "#22c55e";
  }

  if (shipment.statusType === "transit") {
    return "#3b82f6";
  }

  return "#f59e0b";
};

const ActivityFeed = () => {
  const activities = shipments.slice(0, 4).map((shipment) => ({
    id: shipment.id,
    shipment,
    title:
      shipment.statusType === "delivered"
        ? `Shipment ${shipment.trackingNumber} successfully delivered`
        : `${shipment.trackingNumber} is currently in transit`,
    time: shipment.lastUpdate,
  }));

  return (
    <section className="activity-feed">
      <div className="section-heading">
        <div>
          <h2>Latest Activity</h2>

          <p>Stay informed with your most recent logistics updates.</p>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.shipment);
          const color = getActivityColor(activity.shipment);

          return (
            <motion.div
              key={activity.id}
              className="activity-item"
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.35,
              }}
            >
              <div
                className="activity-icon"
                style={{
                  background: `${color}18`,
                  color,
                }}
              >
                <Icon />
              </div>

              <div className="activity-content">
                <h4>{activity.title}</h4>

                <span>{activity.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityFeed;
