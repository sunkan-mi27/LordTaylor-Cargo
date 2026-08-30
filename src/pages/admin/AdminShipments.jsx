import { useEffect, useState } from "react";

import {
  FaBox,
  FaMagnifyingGlass,
  FaRotate,
  FaCircleCheck,
  FaTruck,
  FaClock,
  FaBan,
} from "react-icons/fa6";

import "../../styles/adminShipments.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const getToken = () => {
    return (
      localStorage.getItem("lordtaylor-token") ||
      sessionStorage.getItem("lordtaylor-token")
    );
  };

  const loadShipments = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/admin/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Admin shipments response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load shipments");
      }

      setShipments(data.shipments || data.data || []);
    } catch (error) {
      console.error("Admin shipments error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesStatus = status === "ALL" || shipment.status === status;

    const query = search.toLowerCase().trim();

    if (!query) {
      return matchesStatus;
    }

    const matchesSearch =
      shipment.trackingNumber?.toLowerCase().includes(query) ||
      shipment.senderName?.toLowerCase().includes(query) ||
      shipment.receiverName?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (shipmentStatus) => {
    switch (shipmentStatus) {
      case "DELIVERED":
        return <FaCircleCheck />;

      case "IN_TRANSIT":
        return <FaTruck />;

      case "PROCESSING":
        return <FaClock />;

      case "CANCELLED":
        return <FaBan />;

      default:
        return <FaBox />;
    }
  };

  const formatStatus = (value) => {
    if (!value) return "Unknown";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <section className="admin-shipments-page">
      <div className="admin-shipments-header">
        <div>
          <span className="admin-eyebrow">OPERATIONS / SHIPMENTS</span>

          <h1>Shipment Operations</h1>

          <p>
            Monitor and manage every shipment moving through LordTaylor
            Logistics.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadShipments}
          disabled={loading}
        >
          <FaRotate className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      <div className="admin-shipment-toolbar">
        <div className="admin-search-box">
          <FaMagnifyingGlass />

          <input
            type="text"
            placeholder="Search tracking number, sender or receiver..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PROCESSING">Processing</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="admin-shipment-count">
        <span>SHIPMENTS</span>

        <strong>{filteredShipments.length}</strong>
      </div>

      <div className="admin-shipments-panel">
        {loading ? (
          <div className="admin-shipment-loading">
            <FaRotate className="refresh-spinning" />

            <span>Loading shipment operations...</span>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="admin-shipment-empty">
            <div>
              <FaBox />
            </div>

            <h3>No shipments found</h3>

            <p>There are currently no shipments matching your filters.</p>
          </div>
        ) : (
          <div className="admin-shipment-table">
            <div className="admin-table-header">
              <span>SHIPMENT</span>
              <span>ROUTE</span>
              <span>PACKAGE</span>
              <span>STATUS</span>
              <span>VALUE</span>
            </div>

            {filteredShipments.map((shipment) => (
              <div className="admin-table-row" key={shipment.id}>
                <div className="shipment-identity">
                  <div className="shipment-icon">
                    <FaBox />
                  </div>

                  <div>
                    <strong>
                      {shipment.trackingNumber || "No tracking ID"}
                    </strong>

                    <span>{shipment.id}</span>
                  </div>
                </div>

                <div className="shipment-route">
                  <strong>{shipment.senderName || "Unknown sender"}</strong>

                  <span>→</span>

                  <strong>{shipment.receiverName || "Unknown receiver"}</strong>
                </div>

                <div className="shipment-package">
                  <strong>{shipment.packageType || "Standard"}</strong>

                  <span>{shipment.weight ?? 0} kg</span>
                </div>

                <div>
                  <span
                    className={`shipment-status status-${shipment.status?.toLowerCase()}`}
                  >
                    {getStatusIcon(shipment.status)}

                    {formatStatus(shipment.status)}
                  </span>
                </div>

                <div className="shipment-value">
                  £
                  {Number(shipment.estimatedCost || shipment.cost || 0).toFixed(
                    2,
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminShipments;
