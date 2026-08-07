import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon,
  color = "#22c55e",
  change,
  positive = true,
}) => {
  return (
    <motion.div
      className="stat-card"
      whileHover={{
        y: -6,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <div className="stat-card-top">
        <div
          className="stat-icon"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {icon}
        </div>

        {change && (
          <span className={`stat-change ${positive ? "positive" : "negative"}`}>
            {change}
          </span>
        )}
      </div>

      <div className="stat-content">
        <h3>{value}</h3>

        <p>{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
