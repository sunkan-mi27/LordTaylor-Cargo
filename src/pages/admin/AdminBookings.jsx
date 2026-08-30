import { useEffect, useState } from "react";

import {
  FaClipboardList,
  FaMagnifyingGlass,
  FaRotate,
  FaBox,
} from "react-icons/fa6";

import "../../styles/adminBookings.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const getToken = () => {
    return (
      localStorage.getItem("lordtaylor-token") ||
      sessionStorage.getItem("lordtaylor-token")
    );
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(`${API_URL}/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Admin bookings error:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = status === "ALL" || booking.status === status;

    const query = search.toLowerCase().trim();

    if (!query) return matchesStatus;

    const matchesSearch =
      booking.bookingId?.toLowerCase().includes(query) ||
      booking.senderName?.toLowerCase().includes(query) ||
      booking.receiverName?.toLowerCase().includes(query) ||
      booking.customerEmail?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const formatStatus = (value) => {
    if (!value) return "Unknown";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <section className="admin-bookings-page">
      <div className="admin-bookings-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS / BOOKINGS</span>

          <h1>Booking Records</h1>

          <p>Every booking placed through LordTaylor Logistics.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadBookings}
          disabled={loading}
        >
          <FaRotate className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      <div className="admin-bookings-toolbar">
        <div className="admin-search-box">
          <FaMagnifyingGlass />

          <input
            type="text"
            placeholder="Search booking ID, sender, receiver or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="BOOKED">Booked</option>
          <option value="PROCESSING">Processing</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="admin-bookings-count">
        <span>BOOKINGS</span>

        <strong>{filteredBookings.length}</strong>
      </div>

      <div className="admin-bookings-panel">
        {loading ? (
          <div className="admin-bookings-loading">
            <FaRotate className="refresh-spinning" />
            <span>Loading bookings...</span>
          </div>
        ) : error ? (
          <div className="admin-bookings-empty">
            <div>
              <FaClipboardList />
            </div>
            <h3>Unable to load bookings</h3>
            <p>{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="admin-bookings-empty">
            <div>
              <FaClipboardList />
            </div>
            <h3>No bookings found</h3>
            <p>There are currently no bookings matching your filters.</p>
          </div>
        ) : (
          <div className="admin-bookings-table">
            <div className="admin-table-header">
              <span>BOOKING</span>
              <span>ROUTE</span>
              <span>PACKAGE</span>
              <span>STATUS</span>
              <span>VALUE</span>
            </div>

            {filteredBookings.map((booking) => (
              <div className="admin-table-row" key={booking.id}>
                <div className="booking-identity">
                  <div className="booking-icon">
                    <FaBox />
                  </div>

                  <div>
                    <strong>{booking.bookingId}</strong>
                    <span>{booking.customerEmail}</span>
                  </div>
                </div>

                <div className="booking-route">
                  <strong>{booking.senderName || "Unknown sender"}</strong>
                  <span>→</span>
                  <strong>{booking.receiverName || "Unknown receiver"}</strong>
                </div>

                <div className="booking-package">
                  <strong>{booking.packageType || "Standard"}</strong>
                  <span>{booking.weight ?? 0} kg</span>
                </div>

                <div>
                  <span
                    className={`booking-status status-${booking.status?.toLowerCase()}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                </div>

                <div className="booking-value">
                  £{Number(booking.estimatedCost || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminBookings;
