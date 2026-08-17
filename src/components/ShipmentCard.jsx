import { FaArrowRight } from "react-icons/fa";

export default function ShipmentCard({ shipment, onView }) {
  const trackingNumber = shipment.shipment?.trackingNumber || "N/A";

  const status = shipment.status || "BOOKED";

  const displayStatus = status.replace("_", " ");

  return (
    <div className="shipment-card">
      <div className="shipment-top">
        <div className="shipment-id">
          <span className="tracking-label">Tracking Number</span>

          <h3>{trackingNumber}</h3>
        </div>

        <span className={`status ${status.toLowerCase().replace("_", "-")}`}>
          {displayStatus}
        </span>
      </div>

      <div className="shipment-route">
        <div className="route-point">
          <span>FROM</span>

          <strong>{shipment.pickup}</strong>
        </div>

        <div className="route-line">
          <div className="route-dot green"></div>

          <div className="route-bar"></div>

          <div className="route-dot"></div>
        </div>

        <div className="route-point route-destination">
          <span>TO</span>

          <strong>{shipment.destination}</strong>
        </div>
      </div>

      <div className="shipment-middle">
        <div className="info-box">
          <small>Package</small>

          <strong>{shipment.packageType}</strong>
        </div>

        <div className="info-box">
          <small>Weight</small>

          <strong>{shipment.weight} kg</strong>
        </div>

        <div className="info-box">
          <small>Date</small>

          <strong>
            {shipment.pickupDate
              ? new Date(shipment.pickupDate).toLocaleDateString()
              : "—"}
          </strong>
        </div>
      </div>

      <button className="view-btn" onClick={onView}>
        <span>View Shipment</span>

        <FaArrowRight />
      </button>
    </div>
  );
}
