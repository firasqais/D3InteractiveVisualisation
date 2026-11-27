// Meridian Retail FY2026 revenue vs target, in $M.
// Fictional teaching data. The same rows live in data/stores.json and data/stores.csv.
// Loaded as a plain <script> so every example also works when opened straight from disk.
const STORES = [
  { store: "Mumbai", region: "India", revenue: 4.8, target: 4.2 },
  { store: "Pune", region: "India", revenue: 3.1, target: 2.8 },
  { store: "Bengaluru", region: "India", revenue: 4.1, target: 4.4 },
  { store: "Delhi", region: "India", revenue: 3.6, target: 3.9 },
  { store: "Dubai", region: "GCC", revenue: 6.2, target: 5.8 },
  { store: "Abu Dhabi", region: "GCC", revenue: 3.9, target: 4.3 },
  { store: "Doha", region: "GCC", revenue: 3.3, target: 3.0 },
  { store: "Singapore", region: "SE Asia", revenue: 5.4, target: 5.6 },
  { store: "Jakarta", region: "SE Asia", revenue: 2.9, target: 2.6 },
  { store: "KL", region: "SE Asia", revenue: 2.7, target: 3.2 },
  { store: "Sydney", region: "Australia", revenue: 4.5, target: 4.7 },
  { store: "Melbourne", region: "Australia", revenue: 3.8, target: 3.4 }
];

// Region colours: fixed order, one hue per region (never re-assigned when filtering).
const REGIONS = ["India", "GCC", "SE Asia", "Australia"];
const REGION_COLOURS = {
  "India":     "#2a78d6", // blue
  "GCC":       "#eb6834", // orange
  "SE Asia":   "#1baf7a", // aqua
  "Australia": "#eda100"  // yellow
};

// Performance colours: used with a text label or marker, never colour alone.
const MET_COLOUR = "#2a78d6";
const MISSED_COLOUR = "#d03b3b";
