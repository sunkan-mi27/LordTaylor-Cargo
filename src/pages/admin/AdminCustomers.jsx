import { useEffect, useState } from "react";

import {
  FaUsers,
  FaMagnifyingGlass,
  FaRotate,
  FaUser,
  FaTrash,
  FaTriangleExclamation,
} from "react-icons/fa6";

import "../../styles/adminCustomers.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("lordtaylor-token") ||
      sessionStorage.getItem("lordtaylor-token")
    );
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(`${API_URL}/admin/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Admin customers error:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/customers/${customerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete customer");
      }

      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    } catch (err) {
      console.error("Delete customer error:", err);
      setDeleteError(err.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    const fullName =
      `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();

    return (
      customer.email?.toLowerCase().includes(query) || fullName.includes(query)
    );
  });

  return (
    <section className="admin-customers-page">
      <div className="admin-customers-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS / CUSTOMERS</span>

          <h1>Customer Directory</h1>

          <p>All registered customers across LordTaylor Logistics.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadCustomers}
          disabled={loading}
        >
          <FaRotate className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      <div className="admin-customers-toolbar">
        <div className="admin-search-box">
          <FaMagnifyingGlass />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="admin-customers-count">
        <span>CUSTOMERS</span>

        <strong>{filteredCustomers.length}</strong>
      </div>

      <div className="admin-customers-panel">
        {loading ? (
          <div className="admin-customers-loading">
            <FaRotate className="refresh-spinning" />
            <span>Loading customers...</span>
          </div>
        ) : error ? (
          <div className="admin-customers-empty">
            <div>
              <FaUsers />
            </div>
            <h3>Unable to load customers</h3>
            <p>{error}</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="admin-customers-empty">
            <div>
              <FaUsers />
            </div>
            <h3>No customers found</h3>
            <p>There are currently no customers matching your search.</p>
          </div>
        ) : (
          <div className="admin-customers-table">
            <div className="admin-table-header">
              <span>CUSTOMER</span>
              <span>LOCATION</span>
              <span>BOOKINGS</span>
              <span>TOTAL SPENT</span>
              <span>JOINED</span>
              <span></span>
            </div>

            {filteredCustomers.map((customer) => (
              <div className="admin-table-row" key={customer.id}>
                <div className="customer-identity">
                  <div className="customer-icon">
                    <FaUser />
                  </div>

                  <div>
                    <strong>
                      {customer.firstName || customer.lastName
                        ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                        : "Unnamed customer"}
                    </strong>

                    <span>{customer.email}</span>
                  </div>
                </div>

                <div className="customer-location">
                  {customer.city || customer.country
                    ? [customer.city, customer.country]
                        .filter(Boolean)
                        .join(", ")
                    : "—"}
                </div>

                <div className="customer-bookings">
                  {customer.totalBookings}
                </div>

                <div className="customer-spent">
                  £{Number(customer.totalSpent || 0).toLocaleString()}
                </div>

                <div className="customer-joined">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </div>

                <div className="customer-actions">
                  <button
                    type="button"
                    className="customer-delete-button"
                    onClick={() => {
                      setDeleteError("");
                      setCustomerToDelete(customer);
                    }}
                    title="Delete customer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {customerToDelete && (
        <div
          className="customer-delete-modal-overlay"
          onClick={() => !deleting && setCustomerToDelete(null)}
        >
          <div
            className="customer-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-delete-modal-icon">
              <FaTriangleExclamation />
            </div>

            <h3>Delete this customer?</h3>

            <p>
              This will permanently remove{" "}
              <strong>
                {customerToDelete.firstName || customerToDelete.email}
              </strong>{" "}
              and all of their bookings, payments, shipments, and notifications.
              This cannot be undone.
            </p>

            {deleteError && (
              <p className="customer-delete-modal-error">{deleteError}</p>
            )}

            <div className="customer-delete-modal-actions">
              <button
                type="button"
                className="customer-delete-cancel"
                onClick={() => setCustomerToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="customer-delete-confirm"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCustomers;
