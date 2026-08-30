import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaShip,
  FaBell,
  FaTimes,
} from "react-icons/fa";

import "../styles/adminLayout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FRESH_WINDOW_MS = 90000; // toast anything created in the last 90s

const getToken = () => {
  return (
    localStorage.getItem("lordtaylor-token") ||
    sessionStorage.getItem("lordtaylor-token")
  );
};

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  const notifRef = useRef(null);
  const toastedIdsRef = useRef(new Set());

  const showToast = (notification) => {
    const toastId = `${notification.id}-${Date.now()}`;

    setToasts((prev) => [...prev, { ...notification, toastId }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 6000);
  };

  const loadNotifications = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const incoming = data.notifications || [];

        incoming.forEach((n) => {
          const isFresh =
            Date.now() - new Date(n.createdAt).getTime() < FRESH_WINDOW_MS;

          if (!n.read && isFresh && !toastedIdsRef.current.has(n.id)) {
            showToast(n);
            toastedIdsRef.current.add(n.id);
          }
        });

        setNotifications(incoming);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Admin notifications fetch error:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setUnreadCount(0);
    } catch (error) {
      console.error("Admin mark all read error:", error);
    }
  };

  const markRead = async (notificationId) => {
    try {
      const token = getToken();

      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Admin mark notification read error:", error);
    }
  };

  const openNotificationDetail = async (notification) => {
    if (!notification.read) {
      await markRead(notification.id);
    }

    setNotifOpen(false);
    setToasts((prev) => prev.filter((t) => t.id !== notification.id));
    setActiveNotification(notification);
  };

  const handleGoToRelated = () => {
    if (activeNotification?.link) {
      navigate(activeNotification.link);
    }
    setActiveNotification(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("lordtaylor-token");
    localStorage.removeItem("lordtaylor-user");

    sessionStorage.removeItem("lordtaylor-token");
    sessionStorage.removeItem("lordtaylor-user");

    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      label: "Overview",
      path: "/admin/dashboard",
      icon: <FaChartLine />,
    },
    {
      label: "Shipments",
      path: "/admin/shipments",
      icon: <FaBox />,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: <FaUsers />,
    },
    {
      label: "Bookings",
      path: "/admin/bookings",
      icon: <FaClipboardList />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <FaCreditCard />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <div className="admin-layout">
      <div className="admin-notification-toast-stack">
        {toasts.map((toast) => (
          <button
            type="button"
            key={toast.toastId}
            className="admin-notification-toast"
            onClick={() => openNotificationDetail(toast)}
          >
            <span className="admin-notification-toast-dot" />

            <div>
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
          </button>
        ))}
      </div>

      {activeNotification && (
        <div
          className="admin-notification-modal-overlay"
          onClick={() => setActiveNotification(null)}
        >
          <div
            className="admin-notification-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="admin-notification-modal-close"
              onClick={() => setActiveNotification(null)}
            >
              <FaTimes />
            </button>

            <h3>{activeNotification.title}</h3>

            <p>{activeNotification.message}</p>

            <small>
              {new Date(activeNotification.createdAt).toLocaleString()}
            </small>

            {activeNotification.link && (
              <button
                type="button"
                className="admin-notification-modal-action"
                onClick={handleGoToRelated}
              >
                View Related Page
              </button>
            )}
          </div>
        </div>
      )}

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <FaShip />
          </div>

          <div>
            <strong>
              Lord<span>Taylor</span>
            </strong>

            <small>Admin Operations</small>
          </div>
        </div>

        <div className="admin-sidebar-divider" />

        <nav className="admin-navigation">
          <span className="admin-nav-label">OPERATIONS</span>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-page-context">
              <span>LordTaylor Logistics</span>
              <strong>Administration</strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status">
              <span className="admin-status-dot" />
              System Operational
            </div>

            <div className="admin-notification-wrapper" ref={notifRef}>
              <button
                type="button"
                className="admin-notification-btn"
                onClick={() => setNotifOpen((prev) => !prev)}
              >
                <FaBell />
                {unreadCount > 0 && <span className="admin-notification-dot" />}
              </button>

              {notifOpen && (
                <div className="admin-notification-dropdown">
                  <div className="admin-notification-dropdown-header">
                    <strong>Notifications</strong>

                    {unreadCount > 0 && (
                      <button type="button" onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="admin-notification-dropdown-list">
                    {notifications.length === 0 ? (
                      <div className="admin-notification-dropdown-empty">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className={`admin-notification-item ${notification.read ? "" : "unread"}`}
                          onClick={() => openNotificationDetail(notification)}
                        >
                          <strong>{notification.title}</strong>
                          <span>{notification.message}</span>
                          <small>{timeAgo(notification.createdAt)}</small>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-user">
              <div className="admin-user-avatar">AD</div>

              <div className="admin-user-info">
                <strong>Administrator</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
