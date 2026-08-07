import { motion } from "framer-motion";

import { FaCircleCheck, FaShip, FaBoxOpen, FaBell } from "react-icons/fa6";

const activities = [
  {
    id: 1,
    icon: <FaShip />,
    color: "#3b82f6",
    title: "Shipment departed from London Hub",
    time: "12 mins ago",
  },

  {
    id: 2,
    icon: <FaBoxOpen />,
    color: "#f59e0b",
    title: "Shipment arrived at Lagos Distribution Centre",
    time: "1 hour ago",
  },

  {
    id: 3,
    icon: <FaCircleCheck />,
    color: "#22c55e",
    title: "Shipment LT-24073 successfully delivered",
    time: "Yesterday",
  },

  {
    id: 4,
    icon: <FaBell />,
    color: "#8b5cf6",
    title: "New shipping quote generated",
    time: "2 days ago",
  },
];

const ActivityFeed = () => {
  return (
    <section className="activity-feed">
      <div className="section-heading">
        <div>
          <h2>Latest Activity</h2>

          <p>Stay informed with your most recent logistics updates.</p>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((activity, index) => (
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
                background: `${activity.color}18`,
                color: activity.color,
              }}
            >
              {activity.icon}
            </div>

            <div className="activity-content">
              <h4>{activity.title}</h4>

              <span>{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ActivityFeed;
