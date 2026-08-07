import { useMemo, useState } from "react";
import ShipmentDetailsDrawer from "../components/ShipmentDetailsDrawer";
import DashboardLayout from "../layouts/DashboardLayout";
import ShipmentSearch from "../components/ShipmentSearch";
import ShipmentFilter from "../components/ShipmentFilter";
import ShipmentCard from "../components/ShipmentCard";

import "../styles/shipment-history.css";

const shipments = [
  {
    id: "LT-78291KD",
    from: "London, UK",
    to: "Lagos, NG",
    weight: "12 kg",
    type: "Electronics",
    status: "In Transit",
    date: "6 Aug 2026",
  },
  {
    id: "LT-1827AAK",
    from: "Manchester, UK",
    to: "Abuja, NG",
    weight: "3 kg",
    type: "Documents",
    status: "Booked",
    date: "2 Aug 2026",
  },
  {
    id: "LT-9932KDL",
    from: "Birmingham, UK",
    to: "Port Harcourt",
    weight: "20 kg",
    type: "Machinery",
    status: "Delivered",
    date: "28 Jul 2026",
  },
];

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
      const matchesSearch = shipment.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const matchesFilter =
        activeFilter === "All" || shipment.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

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

        <ShipmentDetailsDrawer
          shipment={selectedShipment}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
