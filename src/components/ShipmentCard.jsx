import { FaArrowRight } from "react-icons/fa";

export default function ShipmentCard({ shipment, onView }) {
  return (
    <div className="shipment-card">
      {/* TOP */}
      <div className="shipment-top">
        <div className="shipment-id">
          <span className="tracking-label">Tracking Number</span>
          <h3>{shipment.id}</h3>
        </div>

        <span
          className={`status ${shipment.status
            .toLowerCase()
            .replace(/\s/g, "-")}`}
        >
          {shipment.status}
        </span>
      </div>

      {/* ROUTE */}
      <div className="shipment-route">
        <div className="route-point">
          <span>FROM</span>
          <strong>{shipment.from}</strong>
        </div>

        <div className="route-line">
          <div className="route-dot green"></div>
          <div className="route-bar"></div>
          <div className="route-dot"></div>
        </div>

        <div className="route-point route-destination">
          <span>TO</span>
          <strong>{shipment.to}</strong>
        </div>
      </div>

      {/* SHIPMENT INFO */}
      <div className="shipment-middle">
        <div className="info-box">
          <small>Package</small>
          <strong>{shipment.type}</strong>
        </div>

        <div className="info-box">
          <small>Weight</small>
          <strong>{shipment.weight}</strong>
        </div>

        <div className="info-box">
          <small>Date</small>
          <strong>{shipment.date}</strong>
        </div>
      </div>

      {/* ACTION */}
      <button className="view-btn" onClick={onView}>
        <span>View Shipment</span>
        <FaArrowRight />
      </button>
    </div>
  );
}
