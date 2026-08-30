import { useEffect, useMemo, useState } from "react";

import ShipmentDetailsDrawer from "../components/ShipmentDetailsDrawer";
import DashboardLayout from "../layouts/DashboardLayout";
import ShipmentSearch from "../components/ShipmentSearch";
import ShipmentFilter from "../components/ShipmentFilter";
import ShipmentCard from "../components/ShipmentCard";

import "../styles/shipment-history.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ShipmentHistory() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("lordtaylor-token");

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`${API_URL}/bookings/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load shipments");
      }

      setShipments(data.bookings || []);
    } catch (error) {
      console.error("History error:", error);
      setError(error.message || "Unable to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openDrawer = (booking) => {
    const shipmentData = {
      ...booking,

      ...booking.shipment,

      from: booking.pickup,
      to: booking.destination,
      type: booking.packageType,
      weight: booking.weight,
      service: booking.service,

      status: booking.shipment?.status || booking.status,

      progress: booking.shipment?.progress ?? 0,

      trackingNumber: booking.shipment?.trackingNumber,

      trackingEvents: booking.shipment?.trackingEvents || [],
    };

    setSelectedShipment(shipmentData);
    setDrawerOpen(true);
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase().trim();

      const trackingNumber =
        shipment.shipment?.trackingNumber?.toLowerCase() || "";

      const destination = shipment.destination?.toLowerCase() || "";

      const receiver = shipment.receiverName?.toLowerCase() || "";

      const matchesSearch =
        trackingNumber.includes(search) ||
        destination.includes(search) ||
        receiver.includes(search);

      const status = shipment.status?.replace("_", " ").toLowerCase();

      const filter = activeFilter.toLowerCase();

      const matchesFilter = activeFilter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [shipments, searchTerm, activeFilter]);

  return (
    <DashboardLayout>
      <div className="shipment-history-page">
        <div className="shipment-history-header">
          <span className="shipment-history-badge">Shipment Center</span>

          <h1>Shipment History</h1>

          <p>Track every shipment you've booked with LordTaylor Logistics.</p>
        </div>

        <ShipmentSearch value={searchTerm} onChange={setSearchTerm} />

        <ShipmentFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? (
          <div className="shipment-empty-state">
            <div className="empty-icon">📦</div>

            <h2>Loading shipments...</h2>

            <p>We're retrieving your shipment history.</p>
          </div>
        ) : error ? (
          <div className="shipment-empty-state">
            <div className="empty-icon">⚠️</div>

            <h2>Unable to load shipments</h2>

            <p>{error}</p>

            <button className="empty-reset-btn" onClick={fetchHistory}>
              Try Again
            </button>
          </div>
        ) : filteredShipments.length > 0 ? (
          <div className="shipment-list">
            {filteredShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onView={() => openDrawer(shipment)}
              />
            ))}
          </div>
        ) : (
          <div className="shipment-empty-state">
            <div className="empty-icon">📦</div>

            <h2>No shipments found</h2>

            <p>
              We couldn't find any shipments matching your search or selected
              filter.
            </p>

            <button
              className="empty-reset-btn"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
            >
              View All Shipments
            </button>
          </div>
        )}

        <ShipmentDetailsDrawer
          shipment={selectedShipment}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
