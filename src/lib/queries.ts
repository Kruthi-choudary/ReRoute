import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";
import { apiFetch } from "./api";
import { TRIPS, NOTIFICATIONS, AIRPORTS, type Trip } from "./travel-data";

// ── Backend response shapes ───────────────────────────────────────────────

interface ApiFlightSegment {
  sequence_order: number;
  flight_number: string;
  airline: string;
  origin_airport: string;
  destination_airport: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  estimated_departure: string | null;
  estimated_arrival: string | null;
  booking_reference: string | null;
}

interface ApiTrip {
  id: number;
  name: string;
  origin: string;
  destination: string;
  departure_date: string;
  status: string; // HEALTHY | AT_RISK | DISRUPTED | RECOVERING | COMPLETED
  flights: ApiFlightSegment[];
}

interface ApiNotification {
  id: number;
  subject: string | null;
  message: string;
  status: string; // PENDING | SENT | READ
  created_at: string;
}

export interface NotificationItem {
  id: string;
  group: "Today" | "Yesterday" | "Earlier";
  time: string;
  title: string;
  body: string;
  kind: "alert" | "success" | "info" | "warning";
  unread: boolean;
}

// ── Mapping helpers ───────────────────────────────────────────────────────

const HUES = [
  "from-[#1e3a5f] to-[#0f1b3d]",
  "from-[#8b5e34] to-[#3b2415]",
  "from-[#5b2b45] to-[#20101c]",
  "from-[#134e4a] to-[#052e2b]",
  "from-[#1a3d2b] to-[#0a1f15]",
  "from-[#3d1a1a] to-[#1f0a0a]",
];

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function countdownHrs(iso: string): number {
  return Math.max(0, (new Date(iso).getTime() - Date.now()) / 3_600_000);
}

function mapTripStatus(apiStatus: string, hours: number): Trip["status"] {
  if (apiStatus === "DISRUPTED") return "Delayed";
  if (apiStatus === "AT_RISK") return "Action Required";
  if (apiStatus === "ESCALATED") return "Action Required";
  if (apiStatus === "RECOVERING") return "Rerouted";
  if (apiStatus === "RECOVERED") return "Recovered";
  if (hours < 3) return "Boarding";
  if (hours < 48) return "On time";
  return "Scheduled";
}

function mapApiTrip(t: ApiTrip, i: number): Trip {
  const segs = [...(t.flights ?? [])].sort((a, b) => a.sequence_order - b.sequence_order);
  const first = segs[0];
  const last = segs[segs.length - 1] ?? first;
  const destCode = last?.destination_airport ?? t.destination;
  const destAirport = AIRPORTS.find((a) => a.code === destCode);
  const hrs = countdownHrs(t.departure_date);
  return {
    id: String(t.id),
    city: destAirport?.city ?? destCode,
    country: destAirport?.country ?? "",
    code: destCode,
    from: first?.origin_airport ?? t.origin,
    to: destCode,
    flight: first?.flight_number ?? "—",
    carrier: first?.airline ?? "—",
    gate: first?.booking_reference ?? "TBD",
    seat: "TBD",
    depart: fmtTime(first?.estimated_departure ?? first?.scheduled_departure),
    arrive: fmtTime(last?.estimated_arrival ?? last?.scheduled_arrival),
    date: fmtDate(t.departure_date),
    countdownHours: hrs,
    tempC: 22,
    weather: "Clear",
    hue: HUES[i % HUES.length],
    status: mapTripStatus(t.status, hrs),
  };
}

function notifGroup(iso: string): NotificationItem["group"] {
  const ms = new Date(iso).getTime();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ms >= todayStart) return "Today";
  if (ms >= todayStart - 86_400_000) return "Yesterday";
  return "Earlier";
}

function notifTime(iso: string): string {
  const d = new Date(iso);
  if (notifGroup(iso) === "Earlier") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function notifKind(subject: string | null, message: string): NotificationItem["kind"] {
  const text = `${subject ?? ""} ${message}`.toLowerCase();
  if (/cancel/.test(text)) return "alert";
  if (/rebook|recovered|confirm/.test(text)) return "success";
  if (/delay|storm|disrupt/.test(text)) return "warning";
  return "info";
}

function mapApiNotif(n: ApiNotification): NotificationItem {
  return {
    id: String(n.id),
    group: notifGroup(n.created_at),
    time: notifTime(n.created_at),
    title: n.subject ?? "Notification",
    body: n.message,
    kind: notifKind(n.subject, n.message),
    unread: n.status === "PENDING",
  };
}

// ── Recovery / Policy types ───────────────────────────────────────────────

interface ApiRecoveryAction {
  id: number;
  action_type: string;
  status: string;
  details: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  executed_at: string | null;
}

interface ApiAlternative {
  // backend field names (from scoring/amadeus services)
  flight_number?: string;
  airline?: string;
  origin?: string;
  destination?: string;
  total_price_usd?: number;
  extra_cost_usd?: number;
  total_score?: number;
  on_time_percentage?: number;
  stops?: number;
  departure_datetime?: string;
  arrival_datetime?: string;
  cabin_class?: string;
  // legacy / airlabs field names kept for fallback
  flight_iata?: string;
  airline_name?: string;
  airline_iata?: string;
  dep_iata?: string;
  arr_iata?: string;
  price_est?: number;
  score?: number;
}

export interface ApiRecoveryPlan {
  id: number;
  trip_id: number;
  status: string; // ANALYZING | PLAN_READY | AWAITING_APPROVAL | EXECUTING | COMPLETED | FAILED
  policy_decision: string | null;
  total_extra_cost: number;
  reasoning: string | null;
  selected_flight: ApiAlternative[] | null;
  actions: ApiRecoveryAction[];
}

export interface PolicyData {
  autoSpendLimit: number;
  approvalSpendLimit: number;
  preferredCabin: string; // ECONOMY | PREMIUM_ECONOMY | BUSINESS
  seatPreference: string; // WINDOW | AISLE | MIDDLE | null
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useTrips(): Trip[] {
  const { user } = useAuth();
  const { data } = useQuery<ApiTrip[]>({
    queryKey: ["trips", user?.id],
    queryFn: async () => {
      const res = await apiFetch(`/api/trips/`);
      if (!res.ok) throw new Error(`Failed to load trips (${res.status})`);
      return res.json() as Promise<ApiTrip[]>;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
  // Mock data only covers the loading/error gap — a real empty list (data === [])
  // from a signed-in user is shown as-is, not masked with fake trips.
  if (data === undefined) return TRIPS as unknown as Trip[];
  return data.map(mapApiTrip);
}

export function useRecovery(): { plan: ApiRecoveryPlan; tripId: string } | null {
  const trips = useTrips();
  // Show recovery for any trip that is actively recovering OR was recently recovered
  const activeTripId = trips.find(
    (t) => t.status === "Rerouted" || /^\d+$/.test(t.id)
  )?.id;
  const isRealId = !!activeTripId && /^\d+$/.test(activeTripId);

  const { data } = useQuery<ApiRecoveryPlan | null>({
    queryKey: ["recovery", activeTripId],
    queryFn: async () => {
      const res = await apiFetch(`/api/recovery/${activeTripId}`);
      if (!res.ok) return null;
      return res.json() as Promise<ApiRecoveryPlan>;
    },
    enabled: isRealId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // WebSocket handles real-time; this is a fallback if the connection drops
      if (status === "ANALYZING" || status === "PLAN_READY" || status === "EXECUTING") return 30_000;
      return false;
    },
  });

  if (!data || !activeTripId) return null;
  return { plan: data, tripId: activeTripId };
}

export function usePolicy(): PolicyData | null {
  const { user } = useAuth();

  const { data: policy } = useQuery({
    queryKey: ["policy", user?.id],
    queryFn: async () => {
      const res = await apiFetch(`/api/policies/`);
      if (!res.ok) return null;
      return res.json() as Promise<{ auto_spend_limit: number; approval_spend_limit: number; allowed_cabins: string[] }>;
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: prefs } = useQuery({
    queryKey: ["preferences", user?.id],
    queryFn: async () => {
      const res = await apiFetch(`/api/policies/preferences`);
      if (!res.ok) return null;
      return res.json() as Promise<{ preferred_cabin: string; seat_preference: string | null }>;
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  if (!policy) return null;
  return {
    autoSpendLimit: policy.auto_spend_limit,
    approvalSpendLimit: policy.approval_spend_limit,
    preferredCabin: prefs?.preferred_cabin ?? policy.allowed_cabins?.[0] ?? "ECONOMY",
    seatPreference: prefs?.seat_preference ?? "WINDOW",
  };
}

// ── Hotel Reservations ────────────────────────────────────────────────────

export interface HotelReservationItem {
  id: number;
  trip_id: number;
  property_name: string;
  city: string;
  hotel_email: string | null;
  check_in_date: string;
  check_out_date: string;
  original_check_in_date: string | null;
  original_check_out_date: string | null;
  booking_reference: string | null;
  status: string;
  notification_status: "PENDING" | "NOTIFIED" | "FAILED";
  notified_at: string | null;
}

export function useHotelReservations(): HotelReservationItem[] {
  const { user } = useAuth();
  const { data } = useQuery<HotelReservationItem[]>({
    queryKey: ["hotel-reservations", user?.id],
    queryFn: async () => {
      const res = await apiFetch(`/api/hotels/`);
      if (!res.ok) return [];
      return res.json() as Promise<HotelReservationItem[]>;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
  return data ?? [];
}

export function useNotifications(): NotificationItem[] {
  const { user } = useAuth();
  const { data } = useQuery<ApiNotification[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await apiFetch(`/api/notifications/`);
      if (!res.ok) throw new Error(`Failed to load notifications (${res.status})`);
      return res.json() as Promise<ApiNotification[]>;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
  // Mock data only covers the loading/error gap — a real empty list from a
  // signed-in user is shown as-is, not masked with fake notifications.
  if (data === undefined) {
    return NOTIFICATIONS.map((n) => ({
      id: n.id,
      group: n.group as NotificationItem["group"],
      time: n.time,
      title: n.title,
      body: n.body,
      kind: n.kind as NotificationItem["kind"],
      unread: n.unread,
    }));
  }
  return data.map(mapApiNotif);
}
