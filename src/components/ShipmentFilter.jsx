const filters = ["All", "Booked", "In Transit", "Delivered", "Cancelled"];

export default function ShipmentFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="shipment-filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={activeFilter === filter ? "active" : ""}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
