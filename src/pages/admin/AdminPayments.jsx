import { useEffect, useState } from "react";

import { FaCreditCard, FaMagnifyingGlass, FaRotate } from "react-icons/fa6";

import "../../styles/adminPayments.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
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

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(`${API_URL}/admin/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load payments");
      }

      setPayments(data.payments || []);
    } catch (err) {
      console.error("Admin payments error:", err);
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = status === "ALL" || payment.status === status;

    const query = search.toLowerCase().trim();

    if (!query) return matchesStatus;

    const matchesSearch =
      payment.bookingId?.toLowerCase().includes(query) ||
      payment.senderName?.toLowerCase().includes(query) ||
      payment.customerEmail?.toLowerCase().includes(query) ||
      payment.transactionId?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const formatStatus = (value) => {
    if (!value) return "Unknown";

    return value.charAt(0) + value.slice(1).toLowerCase();
  };

  return (
    <section className="admin-payments-page">
      <div className="admin-payments-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS / PAYMENTS</span>

          <h1>Payment Records</h1>

          <p>Every payment processed through LordTaylor Logistics.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadPayments}
          disabled={loading}
        >
          <FaRotate className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      <div className="admin-payments-toolbar">
        <div className="admin-search-box">
          <FaMagnifyingGlass />

          <input
            type="text"
            placeholder="Search booking ID, sender, email or transaction..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="admin-payments-count">
        <span>PAYMENTS</span>

        <strong>{filteredPayments.length}</strong>
      </div>

      <div className="admin-payments-panel">
        {loading ? (
          <div className="admin-payments-loading">
            <FaRotate className="refresh-spinning" />
            <span>Loading payments...</span>
          </div>
        ) : error ? (
          <div className="admin-payments-empty">
            <div>
              <FaCreditCard />
            </div>
            <h3>Unable to load payments</h3>
            <p>{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="admin-payments-empty">
            <div>
              <FaCreditCard />
            </div>
            <h3>No payments found</h3>
            <p>There are currently no payments matching your filters.</p>
          </div>
        ) : (
          <div className="admin-payments-table">
            <div className="admin-table-header">
              <span>BOOKING</span>
              <span>CUSTOMER</span>
              <span>METHOD</span>
              <span>STATUS</span>
              <span>AMOUNT</span>
            </div>

            {filteredPayments.map((payment) => (
              <div className="admin-table-row" key={payment.id}>
                <div className="payment-identity">
                  <strong>{payment.bookingId || "—"}</strong>
                  <span>{payment.transactionId || "No transaction ID"}</span>
                </div>

                <div className="payment-customer">
                  <strong>{payment.senderName || "Unknown"}</strong>
                  <span>{payment.customerEmail}</span>
                </div>

                <div className="payment-method">{payment.method}</div>

                <div>
                  <span
                    className={`payment-status status-${payment.status?.toLowerCase()}`}
                  >
                    {formatStatus(payment.status)}
                  </span>
                </div>

                <div className="payment-amount">
                  £{Number(payment.amount || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPayments;
