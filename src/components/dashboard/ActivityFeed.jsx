import { motion } from "framer-motion";
import { FaCircleCheck, FaShip, FaBoxOpen } from "react-icons/fa6";

const getActivityIcon = (title) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("delivered")) {
    return FaCircleCheck;
  }

  if (normalized.includes("transit")) {
    return FaShip;
  }

  return FaBoxOpen;
};

const getActivityColor = (title) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("delivered")) {
    return "#22c55e";
  }

  if (normalized.includes("transit")) {
    return "#3b82f6";
  }

  return "#f59e0b";
};

const formatActivityTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ActivityFeed = ({ activities = [], loading }) => {
  return (
    <section className="activity-feed">
      <div className="section-heading">
        <div>
          <h2>Latest Activity</h2>

          <p>Stay informed with your most recent logistics updates.</p>
        </div>
      </div>

      <div className="activity-list">
        {loading ? (
          <div className="activity-loading">Loading latest activity...</div>
        ) : activities.length === 0 ? (
          <div className="activity-loading">No recent activity.</div>
        ) : (
          activities.slice(0, 6).map((activity, index) => {
            const Icon = getActivityIcon(activity.title);
            const color = getActivityColor(activity.title);

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

                  <span>{formatActivityTime(activity.eventDate)}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ActivityFeed;
