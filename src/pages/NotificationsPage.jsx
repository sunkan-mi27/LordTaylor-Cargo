import { useEffect, useState } from "react";
import { FaBell, FaCheck } from "react-icons/fa6";

import DashboardLayout from "../layouts/DashboardLayout";

import "../styles/notificationsPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  return (
    localStorage.getItem("lordtaylor-token") ||
    sessionStorage.getItem("lordtaylor-token")
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/notifications?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load notifications");
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Notifications page error:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      const token = getToken();

      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = getToken();

      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <section className="notifications-page">
        <div className="notifications-page-header">
          <div>
            <h1>Notifications</h1>
            <p>Everything that's happened on your account, in one place.</p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="notifications-mark-all"
              onClick={handleMarkAllRead}
            >
              <FaCheck />
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-page-panel">
          {loading ? (
            <div className="notifications-page-state">
              <span>Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="notifications-page-state">
              <FaBell />
              <h3>Unable to load notifications</h3>
              <p>{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-page-state">
              <FaBell />
              <h3>No notifications yet</h3>
              <p>You'll see booking, payment, and shipment updates here.</p>
            </div>
          ) : (
            <div className="notifications-page-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notifications-page-item ${notification.read ? "" : "unread"}`}
                  onClick={() =>
                    !notification.read && markRead(notification.id)
                  }
                >
                  <div className="notifications-page-item-main">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{formatDate(notification.createdAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default NotificationsPage;
