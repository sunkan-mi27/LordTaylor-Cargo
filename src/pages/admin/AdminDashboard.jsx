import { useEffect, useState } from "react";
import {
  FaBox,
  FaUsers,
  FaClipboardList,
  FaCreditCard,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import "../../styles/adminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("lordtaylor-token") ||
          sessionStorage.getItem("lordtaylor-token");

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load admin dashboard");
        }

        setDashboard(data);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="admin-dashboard-state">
        <div className="admin-loading-spinner" />
        <h2>Loading operations...</h2>
        <p>Fetching the latest LordTaylor logistics data.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-dashboard-state admin-dashboard-error">
        <div className="admin-state-icon">!</div>
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>

        <button type="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </section>
    );
  }

  const stats = dashboard?.stats || {};

  const statCards = [
    {
      label: "Total Shipments",
      value: stats.totalShipments ?? 0,
      icon: <FaBox />,
      trend: "All shipments",
    },
    {
      label: "Customers",
      value: stats.totalCustomers ?? 0,
      icon: <FaUsers />,
      trend: "Registered customers",
    },
    {
      label: "Bookings",
      value: stats.booked ?? 0,
      icon: <FaClipboardList />,
      trend: "Current bookings",
    },
    {
      label: "Payment Value",
      value: `£${Number(stats.totalPaymentValue ?? 0).toLocaleString()}`,
      icon: <FaCreditCard />,
      trend: "Total processed",
    },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS OVERVIEW</span>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor shipments, customers, bookings and payment activity across
            LordTaylor Logistics.
          </p>
        </div>

        <div className="admin-live-indicator">
          <span />
          Live Operations
        </div>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <article className="admin-stat-card" key={card.label}>
            <div className="admin-stat-top">
              <div className="admin-stat-icon">{card.icon}</div>

              <span className="admin-stat-live">
                <FaArrowUp />
              </span>
            </div>

            <span className="admin-stat-label">{card.label}</span>

            <strong className="admin-stat-value">{card.value}</strong>

            <span className="admin-stat-trend">{card.trend}</span>
          </article>
        ))}
      </div>

      <div className="admin-secondary-grid">
        <article className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">SHIPMENT STATUS</span>

              <h2>Operations</h2>
            </div>
          </div>

          <div className="admin-status-grid">
            <div>
              <FaClock />
              <span>Processing</span>
              <strong>{stats.processing ?? 0}</strong>
            </div>

            <div>
              <FaBox />
              <span>In Transit</span>
              <strong>{stats.inTransit ?? 0}</strong>
            </div>

            <div>
              <FaCheckCircle />
              <span>Delivered</span>
              <strong>{stats.delivered ?? 0}</strong>
            </div>

            <div>
              <FaArrowDown />
              <span>Cancelled</span>
              <strong>{stats.cancelled ?? 0}</strong>
            </div>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">FINANCIAL OVERVIEW</span>

              <h2>Payments</h2>
            </div>
          </div>

          <div className="admin-financial-summary">
            <div>
              <span>Total Payment Value</span>
              <strong>
                £{Number(stats.totalPaymentValue ?? 0).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Payment Transactions</span>
              <strong>{stats.paymentCount ?? 0}</strong>
            </div>

            <div>
              <span>Total Booking Value</span>
              <strong>
                £{Number(stats.totalBookingValue ?? 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </article>
      </div>

      <div className="admin-table-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-panel-kicker">RECENT ACTIVITY</span>

            <h2>Recent Shipments</h2>
          </div>

          <span className="admin-record-count">
            {dashboard?.recentShipments?.length ?? 0} records
          </span>
        </div>

        {dashboard?.recentShipments?.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <strong>{shipment.trackingNumber || "—"}</strong>
                    </td>

                    <td>{shipment.senderName || "—"}</td>

                    <td>
                      {shipment.pickup || "—"}
                      {" → "}
                      {shipment.destination || "—"}
                    </td>

                    <td>
                      <span
                        className={`admin-shipment-status ${String(
                          shipment.status || "",
                        ).toLowerCase()}`}
                      >
                        {shipment.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td>{shipment.progress ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <FaBox />

            <h3>No shipments yet</h3>

            <p>
              Shipment activity will appear here when customers create bookings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
