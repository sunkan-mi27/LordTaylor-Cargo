import { FaTimes } from "react-icons/fa";

export default function ShipmentDetailsDrawer({ shipment, open, onClose }) {
  if (!open || !shipment) return null;

  const timeline = ["Shipment Booked", "Picked Up", "In Transit", "Delivered"];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="shipment-drawer">
        <div className="drawer-header">
          <div>
            <span className="drawer-badge">Shipment Details</span>

            <h2>{shipment.id}</h2>
          </div>

          <button className="drawer-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="drawer-section">
          <div className="drawer-row">
            <span>From</span>
            <strong>{shipment.from}</strong>
          </div>

          <div className="drawer-row">
            <span>Destination</span>
            <strong>{shipment.to}</strong>
          </div>

          <div className="drawer-row">
            <span>Package</span>
            <strong>{shipment.type}</strong>
          </div>

          <div className="drawer-row">
            <span>Weight</span>
            <strong>{shipment.weight}</strong>
          </div>

          <div className="drawer-row">
            <span>Status</span>

            <strong className="green">{shipment.status}</strong>
          </div>
        </div>

        <div className="timeline">
          <h3>Shipment Timeline</h3>

          {timeline.map((step, index) => {
            const stepNumber = index + 1;

            let className = "";

            if (stepNumber < shipment.progress) {
              className = "complete";
            } else if (stepNumber === shipment.progress) {
              className = "active";
            }

            return (
              <div key={step} className={`timeline-item ${className}`}>
                {stepNumber < shipment.progress
                  ? "✓"
                  : stepNumber === shipment.progress
                    ? "🚚"
                    : "○"}{" "}
                {step}
              </div>
            );
          })}
        </div>

        <div className="drawer-actions">
          <button className="primary-success-btn">Download Receipt</button>

          <button className="ghost-success-btn">Copy Tracking ID</button>
        </div>
      </div>
    </>
  );
}
