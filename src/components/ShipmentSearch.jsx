import { FaSearch } from "react-icons/fa";

export default function ShipmentSearch({ value, onChange }) {
  return (
    <div className="shipment-search">
      <FaSearch className="shipment-search-icon" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by Tracking Number..."
      />
    </div>
  );
}
