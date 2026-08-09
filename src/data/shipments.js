const shipments = [
  {
    id: "LT-2026-00124",
    trackingNumber: "LTC-84729105",
    status: "In Transit",
    statusType: "transit",

    sender: {
      name: "Sunkanmi Ibrahim",
      city: "Lagos",
      country: "Nigeria",
    },

    receiver: {
      name: "James Taylor",
      city: "London",
      country: "United Kingdom",
    },

    origin: "Lagos, Nigeria",
    destination: "London, United Kingdom",

    package: {
      type: "Document",
      weight: "1.2 kg",
      description: "Business documents",
    },

    shippingMethod: "Express Delivery",

    estimatedDelivery: "Aug 14, 2026",

    lastUpdate: "Shipment departed Lagos facility",

    timeline: [
      {
        title: "Shipment picked up",
        location: "Lagos, Nigeria",
        date: "Aug 08, 2026",
        time: "09:24 AM",
        completed: true,
      },
      {
        title: "Processed at facility",
        location: "Lagos, Nigeria",
        date: "Aug 08, 2026",
        time: "02:15 PM",
        completed: true,
      },
      {
        title: "Departed facility",
        location: "Lagos, Nigeria",
        date: "Aug 09, 2026",
        time: "11:40 AM",
        completed: true,
      },
      {
        title: "In transit",
        location: "International Transit",
        date: "Aug 10, 2026",
        time: "08:10 AM",
        completed: true,
      },
      {
        title: "Arrived at destination facility",
        location: "London, United Kingdom",
        date: "Expected Aug 13",
        time: "—",
        completed: false,
      },
      {
        title: "Out for delivery",
        location: "London, United Kingdom",
        date: "Expected Aug 14",
        time: "—",
        completed: false,
      },
      {
        title: "Delivered",
        location: "London, United Kingdom",
        date: "Expected Aug 14",
        time: "—",
        completed: false,
      },
    ],
  },

  {
    id: "LT-2026-00123",
    trackingNumber: "LTC-58294017",
    status: "Delivered",
    statusType: "delivered",

    sender: {
      name: "Sunkanmi Ibrahim",
      city: "Lagos",
      country: "Nigeria",
    },

    receiver: {
      name: "Daniel Morgan",
      city: "Manchester",
      country: "United Kingdom",
    },

    origin: "Lagos, Nigeria",
    destination: "Manchester, United Kingdom",

    package: {
      type: "Parcel",
      weight: "3.8 kg",
      description: "Personal items",
    },

    shippingMethod: "Standard Delivery",

    estimatedDelivery: "Aug 06, 2026",

    lastUpdate: "Shipment delivered successfully",

    timeline: [
      {
        title: "Shipment picked up",
        location: "Lagos, Nigeria",
        date: "Aug 01, 2026",
        time: "10:12 AM",
        completed: true,
      },
      {
        title: "Processed at facility",
        location: "Lagos, Nigeria",
        date: "Aug 01, 2026",
        time: "03:48 PM",
        completed: true,
      },
      {
        title: "Departed facility",
        location: "Lagos, Nigeria",
        date: "Aug 02, 2026",
        time: "08:30 AM",
        completed: true,
      },
      {
        title: "Arrived at destination facility",
        location: "Manchester, United Kingdom",
        date: "Aug 05, 2026",
        time: "04:20 PM",
        completed: true,
      },
      {
        title: "Out for delivery",
        location: "Manchester, United Kingdom",
        date: "Aug 06, 2026",
        time: "08:05 AM",
        completed: true,
      },
      {
        title: "Delivered",
        location: "Manchester, United Kingdom",
        date: "Aug 06, 2026",
        time: "01:42 PM",
        completed: true,
      },
    ],
  },

  {
    id: "LT-2026-00122",
    trackingNumber: "LTC-39172584",
    status: "Delivered",
    statusType: "delivered",

    sender: {
      name: "Sunkanmi Ibrahim",
      city: "Lagos",
      country: "Nigeria",
    },

    receiver: {
      name: "Olivia Bennett",
      city: "Birmingham",
      country: "United Kingdom",
    },

    origin: "Lagos, Nigeria",
    destination: "Birmingham, United Kingdom",

    package: {
      type: "Parcel",
      weight: "2.4 kg",
      description: "Electronics accessories",
    },

    shippingMethod: "Express Delivery",

    estimatedDelivery: "Jul 29, 2026",

    lastUpdate: "Shipment delivered successfully",

    timeline: [
      {
        title: "Shipment picked up",
        location: "Lagos, Nigeria",
        date: "Jul 25, 2026",
        time: "09:05 AM",
        completed: true,
      },
      {
        title: "Processed at facility",
        location: "Lagos, Nigeria",
        date: "Jul 25, 2026",
        time: "01:30 PM",
        completed: true,
      },
      {
        title: "Departed facility",
        location: "Lagos, Nigeria",
        date: "Jul 26, 2026",
        time: "07:15 AM",
        completed: true,
      },
      {
        title: "Arrived at destination facility",
        location: "Birmingham, United Kingdom",
        date: "Jul 28, 2026",
        time: "03:50 PM",
        completed: true,
      },
      {
        title: "Delivered",
        location: "Birmingham, United Kingdom",
        date: "Jul 29, 2026",
        time: "11:18 AM",
        completed: true,
      },
    ],
  },

  {
    id: "LT-2026-00121",
    trackingNumber: "LTC-72910463",
    status: "In Transit",
    statusType: "transit",

    sender: {
      name: "Sunkanmi Ibrahim",
      city: "Lagos",
      country: "Nigeria",
    },

    receiver: {
      name: "Michael Carter",
      city: "Leeds",
      country: "United Kingdom",
    },

    origin: "Lagos, Nigeria",
    destination: "Leeds, United Kingdom",

    package: {
      type: "Document",
      weight: "0.8 kg",
      description: "Legal documents",
    },

    shippingMethod: "Express Delivery",

    estimatedDelivery: "Aug 16, 2026",

    lastUpdate: "Shipment is moving through international transit",

    timeline: [
      {
        title: "Shipment picked up",
        location: "Lagos, Nigeria",
        date: "Aug 09, 2026",
        time: "08:30 AM",
        completed: true,
      },
      {
        title: "Processed at facility",
        location: "Lagos, Nigeria",
        date: "Aug 09, 2026",
        time: "12:45 PM",
        completed: true,
      },
      {
        title: "Departed facility",
        location: "Lagos, Nigeria",
        date: "Aug 10, 2026",
        time: "06:20 AM",
        completed: true,
      },
      {
        title: "In transit",
        location: "International Transit",
        date: "Aug 10, 2026",
        time: "10:15 AM",
        completed: true,
      },
      {
        title: "Arrived at destination facility",
        location: "Leeds, United Kingdom",
        date: "Expected Aug 15",
        time: "—",
        completed: false,
      },
      {
        title: "Delivered",
        location: "Leeds, United Kingdom",
        date: "Expected Aug 16",
        time: "—",
        completed: false,
      },
    ],
  },

  {
    id: "LT-2026-00120",
    trackingNumber: "LTC-61583920",
    status: "Delivered",
    statusType: "delivered",

    sender: {
      name: "Sunkanmi Ibrahim",
      city: "Lagos",
      country: "Nigeria",
    },

    receiver: {
      name: "Sophia Williams",
      city: "Liverpool",
      country: "United Kingdom",
    },

    origin: "Lagos, Nigeria",
    destination: "Liverpool, United Kingdom",

    package: {
      type: "Parcel",
      weight: "5.1 kg",
      description: "Clothing and accessories",
    },

    shippingMethod: "Standard Delivery",

    estimatedDelivery: "Jul 22, 2026",

    lastUpdate: "Shipment delivered successfully",

    timeline: [
      {
        title: "Shipment picked up",
        location: "Lagos, Nigeria",
        date: "Jul 18, 2026",
        time: "10:20 AM",
        completed: true,
      },
      {
        title: "Processed at facility",
        location: "Lagos, Nigeria",
        date: "Jul 18, 2026",
        time: "03:15 PM",
        completed: true,
      },
      {
        title: "Departed facility",
        location: "Lagos, Nigeria",
        date: "Jul 19, 2026",
        time: "09:00 AM",
        completed: true,
      },
      {
        title: "Arrived at destination facility",
        location: "Liverpool, United Kingdom",
        date: "Jul 21, 2026",
        time: "02:40 PM",
        completed: true,
      },
      {
        title: "Delivered",
        location: "Liverpool, United Kingdom",
        date: "Jul 22, 2026",
        time: "12:05 PM",
        completed: true,
      },
    ],
  },
];

export default shipments;
