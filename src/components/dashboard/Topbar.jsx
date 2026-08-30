import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaMagnifyingGlass,
  FaChevronDown,
  FaXmark,
} from "react-icons/fa6";

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

const Topbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  const notifRef = useRef(null);
  const toastedIdsRef = useRef(new Set());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/profile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch profile");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Topbar profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

        /* -----------------------------------------------
           TOAST FOR FRESH NOTIFICATIONS
           Fires on every poll, including the very first —
           but only for notifications created recently and
           not already toasted this session. This is what
           catches a "Welcome" notification created seconds
           before the dashboard's first render.
        ----------------------------------------------- */

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
      console.error("Notifications fetch error:", error);
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

  const handleBellClick = () => {
    setNotifOpen((prev) => !prev);
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
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all read error:", error);
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
      console.error("Mark notification read error:", error);
    }
  };

  /* -----------------------------------------------
     CLICKING A NOTIFICATION (dropdown or toast)
     Opens a detail popup instead of silently navigating —
     that way something visibly happens even if the linked
     page is the one you're already on.
  ----------------------------------------------- */

  const openNotificationDetail = async (notification) => {
    if (!notification.read) {
      await markRead(notification.id);
    }

    setNotifOpen(false);
    setToasts((prev) => prev.filter((t) => t.id !== notification.id));
    setActiveNotification(notification);
  };

  const handleGoToRelated = () => {
    navigate("/notifications");
    setActiveNotification(null);
  };

  const firstName = user?.profile?.firstName || "Customer";
  const lastName = user?.profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="notification-toast-stack">
        {toasts.map((toast) => (
          <button
            type="button"
            key={toast.toastId}
            className="notification-toast"
            onClick={() => openNotificationDetail(toast)}
          >
            <span className="notification-toast-dot" />

            <div>
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
          </button>
        ))}
      </div>

      {activeNotification && (
        <div
          className="notification-modal-overlay"
          onClick={() => setActiveNotification(null)}
        >
          <div
            className="notification-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="notification-modal-close"
              onClick={() => setActiveNotification(null)}
            >
              <FaXmark />
            </button>

            <h3>{activeNotification.title}</h3>

            <p>{activeNotification.message}</p>

            <small>
              {new Date(activeNotification.createdAt).toLocaleString()}
            </small>

            <button
              type="button"
              className="notification-modal-action"
              onClick={handleGoToRelated}
            >
              View Related Page
            </button>
          </div>
        </div>
      )}

      <header className="topbar">
        <div className="topbar-left">
          <h1>Dashboard</h1>

          <p>Welcome back, {loading ? "..." : firstName} 👋</p>
        </div>

        <div className="topbar-right">
          <div className="search-box">
            <FaMagnifyingGlass />

            <input type="text" placeholder="Search shipments..." />
          </div>

          <div className="notification-wrapper" ref={notifRef}>
            <button className="notification-btn" onClick={handleBellClick}>
              <FaBell />

              {unreadCount > 0 && <span className="notification-dot"></span>}
            </button>

            {notifOpen && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <strong>Notifications</strong>

                  {unreadCount > 0 && (
                    <button type="button" onClick={handleMarkAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="notification-dropdown-list">
                  {notifications.filter((n) => !n.read).length === 0 ? (
                    <div className="notification-dropdown-empty">
                      You're all caught up!
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.read)
                      .map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className="notification-item unread"
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

          <Link to="/profile" className="user-profile">
            <div className="user-avatar">{loading ? "..." : initials}</div>

            <div className="user-info">
              <strong>{loading ? "Loading..." : fullName}</strong>

              <small>{user?.role === "ADMIN" ? "Admin" : "Customer"}</small>
            </div>

            <FaChevronDown />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Topbar;
