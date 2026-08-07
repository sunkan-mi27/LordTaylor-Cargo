// Shipment Status Order

export const shipmentStages = [
  "Shipment Received",
  "Customs Cleared",
  "In Transit",
  "Arrival Scan",
  "Out For Delivery",
  "Delivered",
];

// Default Timeline

export const timelineTemplate = [
  {
    title: "Shipment Received",
    location: "United Kingdom Warehouse",
  },
  {
    title: "Customs Cleared",
    location: "United Kingdom",
  },
  {
    title: "In Transit",
    location: "Atlantic Route",
  },
  {
    title: "Arrival Scan",
    location: "Nigeria Hub",
  },
  {
    title: "Out For Delivery",
    location: "Customer Address",
  },
  {
    title: "Delivered",
    location: "Completed",
  },
];

// Build Timeline Based On Shipment Status

export const buildTimeline = (status = "Shipment Received") => {
  const activeIndex = shipmentStages.indexOf(status);

  return timelineTemplate.map((step, index) => ({
    ...step,
    completed: index < activeIndex,
    active: index === activeIndex,
  }));
};

// Progress Percentage

export const getProgress = (status = "Shipment Received") => {
  const index = shipmentStages.indexOf(status);

  if (index === -1) return 0;

  return Math.round((index / (shipmentStages.length - 1)) * 100);
};

// Status Badge Color

export const getStatusColor = (status = "") => {
  switch (status) {
    case "Shipment Received":
      return "#3498db";

    case "Customs Cleared":
      return "#9b59b6";

    case "In Transit":
      return "#f39c12";

    case "Arrival Scan":
      return "#1abc9c";

    case "Out For Delivery":
      return "#2ecc71";

    case "Delivered":
      return "#27ae60";

    default:
      return "#6b7280";
  }
};

// Format Weight

export const formatWeight = (weight) => {
  if (!weight) return "--";

  return `${weight} KG`;
};

// Format Service

export const formatService = (service) => {
  if (!service) return "--";

  return service;
};

// Default Shipment Object

export const emptyShipment = {
  bookingId: "",
  senderName: "",
  receiverName: "",
  pickup: "",
  destination: "",
  weight: "",
  service: "",
  status: "Shipment Received",
};
