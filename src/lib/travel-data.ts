/**
 * Shared mock data for the ReRoute AI product surface.
 * Presentation-only: no network, no persistence.
 */

export type Airport = {
  code: string;
  city: string;
  country: string;
  /** normalized 0-100 coordinates on the world map (equirectangular) */
  x: number;
  y: number;
  congestion: number; // 0-1
  delayMin: number;
};

export const AIRPORTS: Airport[] = [
  { code: "SFO", city: "San Francisco", country: "United States", x: 14.5, y: 37.5, congestion: 0.42, delayMin: 12 },
  { code: "JFK", city: "New York", country: "United States", x: 26.5, y: 35.5, congestion: 0.78, delayMin: 41 },
  { code: "LHR", city: "London", country: "United Kingdom", x: 48.6, y: 29.5, congestion: 0.61, delayMin: 24 },
  { code: "CDG", city: "Paris", country: "France", x: 50.2, y: 31.5, congestion: 0.55, delayMin: 18 },
  { code: "ZRH", city: "Zurich", country: "Switzerland", x: 52.2, y: 32.4, congestion: 0.31, delayMin: 6 },
  { code: "DXB", city: "Dubai", country: "UAE", x: 63.5, y: 43.5, congestion: 0.47, delayMin: 9 },
  { code: "SIN", city: "Singapore", country: "Singapore", x: 78.5, y: 55.5, congestion: 0.38, delayMin: 7 },
  { code: "HND", city: "Tokyo", country: "Japan", x: 88.0, y: 38.5, congestion: 0.52, delayMin: 15 },
  { code: "SYD", city: "Sydney", country: "Australia", x: 90.5, y: 74.0, congestion: 0.27, delayMin: 4 },
  { code: "GRU", city: "São Paulo", country: "Brazil", x: 33.5, y: 68.0, congestion: 0.44, delayMin: 22 },
];

export const airport = (code: string) => AIRPORTS.find((a) => a.code === code)!;

export type RouteLine = {
  id: string;
  from: string;
  to: string;
  status: "active" | "scheduled" | "rerouted";
  flight: string;
};

export const ROUTES: RouteLine[] = [
  { id: "r1", from: "JFK", to: "ZRH", status: "active", flight: "LX 15" },
  { id: "r2", from: "LHR", to: "DXB", status: "scheduled", flight: "EK 4" },
  { id: "r3", from: "SFO", to: "HND", status: "rerouted", flight: "NH 7" },
  { id: "r4", from: "SIN", to: "SYD", status: "scheduled", flight: "SQ 231" },
  { id: "r5", from: "CDG", to: "GRU", status: "scheduled", flight: "AF 456" },
];

export const STORMS = [
  { id: "s1", x: 30, y: 33, r: 7, label: "Nor'easter · Atlantic seaboard", severity: "Severe" },
  { id: "s2", x: 72, y: 50, r: 5, label: "Monsoon cell · Bay of Bengal", severity: "Moderate" },
];

export type RecoveryStep = {
  id: string;
  label: string;
  detail: string;
  state: "done" | "running" | "pending";
  duration: string;
};

export const RECOVERY_STEPS: RecoveryStep[] = [
  { id: "n1", label: "Cancelled", detail: "LX 15 · JFK → ZRH cancelled by carrier", state: "done", duration: "0s" },
  { id: "n2", label: "Searching", detail: "27 alternatives across 9 carriers", state: "done", duration: "4.2s" },
  { id: "n3", label: "Negotiating", detail: "Fare rules + protection applied", state: "done", duration: "11s" },
  { id: "n4", label: "Rebooking", detail: "UA 934 · JFK → ZRH via BRU", state: "done", duration: "6s" },
  { id: "n5", label: "Hotel Updated", detail: "Widder Hotel · late arrival held", state: "running", duration: "—" },
  { id: "n6", label: "Taxi Updated", detail: "ZRH pickup shifted to 21:40", state: "pending", duration: "—" },
  { id: "n7", label: "Boarding Pass Ready", detail: "Wallet pass reissued", state: "pending", duration: "—" },
];

export type Trip = {
  id: string;
  city: string;
  country: string;
  code: string;
  from: string;
  to: string;
  flight: string;
  carrier: string;
  gate: string;
  seat: string;
  depart: string;
  arrive: string;
  date: string;
  countdownHours: number;
  tempC: number;
  weather: string;
  hue: string;
  status: "On time" | "Rerouted" | "Boarding" | "Scheduled" | "Delayed" | "Recovered" | "Action Required";
};

export const TRIPS: Trip[] = [
  {
    id: "zrh-2026", city: "Zurich", country: "Switzerland", code: "ZRH",
    from: "JFK", to: "ZRH", flight: "UA 934", carrier: "United", gate: "B22", seat: "3A",
    depart: "18:40", arrive: "08:15", date: "Aug 2, 2026", countdownHours: 31,
    tempC: 19, weather: "Light rain", hue: "from-[#1e3a5f] to-[#0f1b3d]", status: "Rerouted",
  },
  {
    id: "dxb-2026", city: "Dubai", country: "United Arab Emirates", code: "DXB",
    from: "LHR", to: "DXB", flight: "EK 4", carrier: "Emirates", gate: "A7", seat: "2K",
    depart: "13:05", arrive: "23:35", date: "Aug 19, 2026", countdownHours: 412,
    tempC: 39, weather: "Clear", hue: "from-[#8b5e34] to-[#3b2415]", status: "Scheduled",
  },
  {
    id: "hnd-2026", city: "Tokyo", country: "Japan", code: "HND",
    from: "SFO", to: "HND", flight: "NH 7", carrier: "ANA", gate: "G94", seat: "11F",
    depart: "01:10", arrive: "05:25", date: "Sep 4, 2026", countdownHours: 950,
    tempC: 27, weather: "Humid", hue: "from-[#5b2b45] to-[#20101c]", status: "Scheduled",
  },
  {
    id: "sin-2026", city: "Singapore", country: "Singapore", code: "SIN",
    from: "SYD", to: "SIN", flight: "SQ 232", carrier: "Singapore Airlines", gate: "D41", seat: "6C",
    depart: "09:20", arrive: "15:05", date: "Oct 11, 2026", countdownHours: 1820,
    tempC: 31, weather: "Thunderstorms", hue: "from-[#134e4a] to-[#052e2b]", status: "Scheduled",
  },
];

export const NOTIFICATIONS = [
  { id: "1", group: "Today", time: "09:42", title: "LX 15 cancelled — recovery started", body: "Autonomous rebooking engaged. No action needed.", kind: "alert", unread: true },
  { id: "2", group: "Today", time: "09:46", title: "Rebooked on UA 934", body: "Seat 3A confirmed. Arrival 08:15 local.", kind: "success", unread: true },
  { id: "3", group: "Today", time: "09:47", title: "Widder Hotel held for late arrival", body: "Check-in window extended to 02:00.", kind: "info", unread: true },
  { id: "4", group: "Yesterday", time: "17:12", title: "Storm system forming near JFK", body: "Departure risk raised to 62%.", kind: "warning", unread: false },
  { id: "5", group: "Yesterday", time: "08:03", title: "Passport expires in 7 months", body: "Some destinations require 6 months validity.", kind: "info", unread: false },
  { id: "6", group: "Earlier", time: "Jul 21", title: "$380 recovered on AF 456", body: "EU261 compensation credited.", kind: "success", unread: false },
  { id: "7", group: "Earlier", time: "Jul 18", title: "Lounge access added at DXB", body: "Emirates Business complimentary.", kind: "info", unread: false },
] as const;

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { to: "/trips", label: "Trips", icon: "Plane" },
  { to: "/recovery", label: "Recovery Center", icon: "Workflow" },
  { to: "/hotels", label: "Hotels", icon: "BedDouble" },
  { to: "/notifications", label: "Notifications", icon: "Bell" },
  { to: "/analytics", label: "Analytics", icon: "BarChart3" },
  { to: "/assistant", label: "AI Assistant", icon: "Bot" },
  { to: "/history", label: "Travel History", icon: "History" },
  { to: "/profile", label: "Profile", icon: "IdCard" },
  { to: "/settings", label: "Settings", icon: "Settings" },
] as const;
