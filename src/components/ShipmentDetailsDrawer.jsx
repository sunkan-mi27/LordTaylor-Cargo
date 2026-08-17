import { FaTimes } from "react-icons/fa";

export default function ShipmentDetailsDrawer({ shipment, open, onClose }) {
  if (!open || !shipment) return null;

  const trackingEvents = shipment.trackingEvents || [];

  const statusOrder = ["BOOKED", "PROCESSING", "IN_TRANSIT", "DELIVERED"];

  const statusTitles = {
    BOOKED: "Booking Confirmed",
    PROCESSING: "Shipment Processing",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered",
  };

  const currentStatusIndex = statusOrder.indexOf(shipment.status);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="shipment-drawer">
        {/* HEADER */}
        <div className="drawer-header">
          <div>
            <span className="drawer-badge">Shipment Details</span>

            <h2>{shipment.trackingNumber || shipment.id}</h2>
          </div>

          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close shipment details"
          >
            <FaTimes />
          </button>
        </div>

        {/* INFO */}
        <div className="drawer-section">
          <div className="drawer-row">
            <span>From</span>

            <strong>{shipment.from || shipment.origin || "—"}</strong>
          </div>

          <div className="drawer-row">
            <span>Destination</span>

            <strong>{shipment.to || shipment.destination || "—"}</strong>
          </div>

          <div className="drawer-row">
            <span>Package</span>

            <strong>{shipment.type || shipment.packageType || "—"}</strong>
          </div>

          <div className="drawer-row">
            <span>Weight</span>

            <strong>
              {shipment.weight !== undefined ? `${shipment.weight} kg` : "—"}
            </strong>
          </div>

          {shipment.service && (
            <div className="drawer-row">
              <span>Service</span>

              <strong>{shipment.service}</strong>
            </div>
          )}

          <div className="drawer-row">
            <span>Status</span>

            <strong className="green">
              {(shipment.status || "UNKNOWN").replace("_", " ")}
            </strong>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="shipment-progress">
          <div className="progress-header">
            <span>Shipment Progress</span>

            <strong>{shipment.progress ?? 0}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${shipment.progress ?? 0}%`,
              }}
            />
          </div>
        </div>

        {/* TIMELINE */}
        <div className="timeline">
          <h3>Shipment Timeline</h3>

          {statusOrder.map((status, index) => {
            const title = statusTitles[status];

            const event = trackingEvents.find((item) => item.title === title);

            const isComplete = index <= currentStatusIndex;

            const isActive = status === shipment.status;

            let className = "";

            if (isComplete) {
              className = "complete";
            }

            if (isActive) {
              className = "active";
            }

            return (
              <div key={status} className={`timeline-item ${className}`}>
                <div className="timeline-icon">{isComplete ? "✓" : "○"}</div>

                <div className="timeline-content">
                  <strong>{title}</strong>

                  {event?.location && <span>{event.location}</span>}

                  {event?.description && <p>{event.description}</p>}

                  {event?.eventDate && (
                    <small>{new Date(event.eventDate).toLocaleString()}</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="drawer-actions">
          <button className="primary-success-btn">Download Receipt</button>

          <button
            className="ghost-success-btn"
            onClick={() => {
              const trackingId = shipment.trackingNumber || shipment.id;

              navigator.clipboard.writeText(trackingId).then(() => {
                alert("Tracking ID copied!");
              });
            }}
          >
            Copy Tracking ID
          </button>
        </div>
      </div>
    </>
  );
}
