import { useMemo, useState } from "react";

import ShipmentDetailsDrawer from "../components/ShipmentDetailsDrawer";
import DashboardLayout from "../layouts/DashboardLayout";
import ShipmentSearch from "../components/ShipmentSearch";
import ShipmentFilter from "../components/ShipmentFilter";
import ShipmentCard from "../components/ShipmentCard";

import shipments from "../data/shipments";

import "../styles/shipment-history.css";

export default function ShipmentHistory() {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const openDrawer = (shipment) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        shipment.trackingNumber.toLowerCase().includes(search) ||
        shipment.destination.toLowerCase().includes(search) ||
        shipment.receiver.name.toLowerCase().includes(search);

      const matchesFilter =
        activeFilter === "All" || shipment.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <DashboardLayout>
      <div className="shipment-history-page">
        {/* HEADER */}

        <div className="shipment-history-header">
          <span className="shipment-history-badge">Shipment Center</span>

          <h1>Shipment History</h1>

          <p>Track every shipment you've booked with LordTaylor Logistics.</p>
        </div>

        {/* SEARCH */}

        <ShipmentSearch value={searchTerm} onChange={setSearchTerm} />

        {/* FILTER */}

        <ShipmentFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* SHIPMENTS */}

        {filteredShipments.length > 0 ? (
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

        {/* DETAILS DRAWER */}

        <ShipmentDetailsDrawer
          shipment={selectedShipment}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
