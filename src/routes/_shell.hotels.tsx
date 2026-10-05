import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Hotel, CalendarDays, Mail, CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Panel, Eyebrow, PageHeader, Pill, Reveal, LiveDot } from "@/components/app/primitives";
import { WorldMap } from "@/components/app/WorldMap";
import { cn } from "@/lib/utils";
import { useHotelReservations, type HotelReservationItem } from "@/lib/queries";
import { useTrips } from "@/lib/queries";
import { useRecoverySocket } from "@/lib/useRecoverySocket";

export const Route = createFileRoute("/_shell/hotels")({
  component: HotelsPage,
  head: () => ({
    meta: [
      { title: "Hotel Reservations · ReRoute AI" },
      { name: "description", content: "Your hotel reservations, protected and updated automatically when flights shift." },
      { property: "og:title", content: "Hotel Reservations · ReRoute AI" },
      { property: "og:description", content: "Every hotel hold, monitored and adjusted in real time with your itinerary." },
    ],
  }),
});

// Deterministic gradient from city name — same city always gets same hue
const HUES = [
  "from-[#1e3a5f] to-[#0f1b3d]",
  "from-[#8b5e34] to-[#3b2415]",
  "from-[#5b2b45] to-[#20101c]",
  "from-[#134e4a] to-[#052e2b]",
  "from-[#1a3d2b] to-[#0a1f15]",
  "from-[#3d1a1a] to-[#1f0a0a]",
];

function hueFor(city: string): string {
  const n = city.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return HUES[n % HUES.length];
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function fmtNotifiedAt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function nights(checkin: string, checkout: string): number {
  return Math.max(1, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86_400_000));
}

function Grain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
      <filter id="grain-hotels">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-hotels)" />
    </svg>
  );
}

function Architecture({ seed }: { seed: number }) {
  const shapes = Array.from({ length: 5 }, (_, i) => ({
    x: 8 + i * 20,
    w: 10 + ((seed * (i + 2) * 13) % 10),
    h: 30 + ((seed * (i + 5) * 19) % 55),
  }));
  return (
    <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-70">
      {shapes.map((s, i) => (
        <rect key={i} x={s.x} y={90 - s.h} width={s.w} height={s.h} rx="1" fill="rgba(255,255,255,0.15)" />
      ))}
      <circle cx="50" cy="18" r="8" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "UPDATED")   return <Pill tone="warning">Updated</Pill>;
  if (status === "CANCELLED") return <Pill tone="muted">Cancelled</Pill>;
  return <Pill tone="success">Confirmed</Pill>;
}

function NotifBadge({ notifStatus, notifiedAt }: { notifStatus: string; notifiedAt: string | null }) {
  if (notifStatus === "NOTIFIED") {
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--success)]">
        <CheckCircle2 className="h-3 w-3" />
        Email sent {notifiedAt ? `· ${fmtNotifiedAt(notifiedAt)}` : ""}
      </span>
    );
  }
  if (notifStatus === "FAILED") {
    return <span className="text-[11px] text-[var(--danger)]">Notification failed</span>;
  }
  return (
    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
      <ShieldCheck className="h-3 w-3" /> Monitoring
    </span>
  );
}

function CheckInUpdate({ original, current }: { original: string | null; current: string }) {
  if (!original) return null;
  const origTime = fmtTime(original);
  const currTime = fmtTime(current);
  if (origTime === currTime) return null;
  return (
    <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-[var(--warning)]/10 px-2.5 py-1.5 text-[11px]">
      <Clock className="h-3 w-3 text-[var(--warning)]" />
      <span className="text-muted-foreground">Check-in updated</span>
      <span className="font-semibold text-foreground">{origTime}</span>
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
      <span className="font-semibold text-[var(--warning)]">{currTime}</span>
    </div>
  );
}

function ReservationCard({
  reservation,
  index,
  onSelect,
}: {
  reservation: HotelReservationItem;
  index: number;
  onSelect: (r: HotelReservationItem) => void;
}) {
  const hue = hueFor(reservation.city);
  const isUpdated = reservation.status === "UPDATED";
  const isNotified = reservation.notification_status === "NOTIFIED";

  return (
    <motion.div
      layout
      layoutId={`hotel-${reservation.id}`}
      onClick={() => onSelect(reservation)}
      whileHover="hover"
      className="group relative mb-6 cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br shadow-soft"
      style={{ height: 320 }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", hue)} />
      <Grain />
      <Architecture seed={index + 2} />

      <div className="relative flex h-full flex-col justify-between p-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <Eyebrow className="text-white/70">{reservation.city}</Eyebrow>
          <div className="flex flex-col items-end gap-1">
            {isUpdated && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--warning)]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--warning)] backdrop-blur">
                <Clock className="h-2.5 w-2.5" /> Updated
              </span>
            )}
            {isNotified && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-background backdrop-blur">
                <CheckCircle2 className="h-2.5 w-2.5" /> Notified
              </span>
            )}
          </div>
        </div>

        {/* Hotel name */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white/90">{reservation.property_name}</h3>
          <p className="mt-1 text-[11px] text-white/60">{reservation.booking_reference}</p>
        </div>
      </div>

      {/* Hover detail panel */}
      <motion.div
        variants={{ hover: { y: 0, opacity: 1 }, initial: { y: 20, opacity: 0 } }}
        initial="initial"
        className="absolute inset-x-3 bottom-3 rounded-2xl border border-border/60 bg-card/95 p-4 opacity-0 shadow-float backdrop-blur-xl transition-opacity group-hover:opacity-100"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-foreground">
              {fmtDate(reservation.check_in_date)} → {fmtDate(reservation.check_out_date)}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {nights(reservation.check_in_date, reservation.check_out_date)} nights
            </p>
          </div>
          <StatusPill status={reservation.status} />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <NotifBadge notifStatus={reservation.notification_status} notifiedAt={reservation.notified_at} />
        </div>

        <CheckInUpdate original={reservation.original_check_in_date} current={reservation.check_in_date} />
      </motion.div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-muted/20 px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
        <Hotel className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No reservations yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Hotel reservations appear here when trips are created.
        </p>
      </div>
    </div>
  );
}

function HotelsPage() {
  const reservations = useHotelReservations();
  const trips = useTrips();
  const realTripId = trips.find((t) => /^\d+$/.test(t.id))?.id;
  useRecoverySocket(realTripId ?? null);

  const [selected, setSelected] = useState<HotelReservationItem | null>(null);

  const notifiedCount = reservations.filter((r) => r.notification_status === "NOTIFIED").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Hotel Reservations"
        title="Every stay, protected in real time."
        lede="When your flight shifts, your hotel is automatically notified. No manual calls, no missed check-ins."
        actions={
          <Pill tone="success">
            <LiveDot tone="success" /> {reservations.length} reservation{reservations.length !== 1 ? "s" : ""} monitored
          </Pill>
        }
      />

      {/* Stats bar */}
      {reservations.length > 0 && (
        <Reveal delay={0.05}>
          <div className="grid grid-cols-3 gap-4">
            <Panel>
              <Eyebrow>Reservations</Eyebrow>
              <p className="mt-2 text-3xl font-semibold text-foreground">{reservations.length}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Across all trips</p>
            </Panel>
            <Panel>
              <Eyebrow>Hotels notified</Eyebrow>
              <p className="mt-2 text-3xl font-semibold text-foreground">{notifiedCount}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Emails dispatched</p>
            </Panel>
            <Panel>
              <Eyebrow>Protection</Eyebrow>
              <p className="mt-2 text-3xl font-semibold text-foreground">100%</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <LiveDot tone="success" /> All reservations covered
              </p>
            </Panel>
          </div>
        </Reveal>
      )}

      {/* Full-width map */}
      <Reveal>
        <div className="h-[380px] overflow-hidden rounded-3xl border border-border/60 shadow-soft">
          <WorldMap compact className="h-full" />
        </div>
      </Reveal>

      {/* Hotel cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reservations.length === 0 ? (
          <EmptyState />
        ) : (
          reservations.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05}>
              <ReservationCard reservation={r} index={i} onSelect={setSelected} />
            </Reveal>
          ))
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`hotel-${selected.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-6 right-6 z-50 w-[340px] overflow-hidden rounded-3xl border border-border/60 bg-card shadow-float"
            >
              {/* Card header */}
              <div className={cn("relative h-32 bg-gradient-to-br", hueFor(selected.city))}>
                <Grain />
                <Architecture seed={7} />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur transition-opacity hover:opacity-80"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">{selected.city}</p>
                  <p className="text-xl font-semibold text-white/90">{selected.property_name}</p>
                </div>
              </div>

              {/* Detail rows */}
              <div className="space-y-3 p-5">
                {/* Dates */}
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Stay</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {fmtDate(selected.check_in_date)} → {fmtDate(selected.check_out_date)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {nights(selected.check_in_date, selected.check_out_date)} nights
                    </p>
                  </div>
                </div>

                {/* Check-in time update */}
                <CheckInUpdate original={selected.original_check_in_date} current={selected.check_in_date} />

                {/* Booking reference */}
                <div className="rounded-xl bg-muted/50 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Booking reference</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">{selected.booking_reference ?? "—"}</p>
                </div>

                {/* Status row */}
                <div className="flex items-center justify-between">
                  <StatusPill status={selected.status} />
                  <NotifBadge notifStatus={selected.notification_status} notifiedAt={selected.notified_at} />
                </div>

                {/* Notification detail */}
                {selected.notification_status === "NOTIFIED" && (
                  <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/5 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--success)]">
                      <Mail className="h-3 w-3" /> Notification sent
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Late arrival notice dispatched to hotel at {fmtNotifiedAt(selected.notified_at)}.
                    </p>
                    {selected.hotel_email && (
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">{selected.hotel_email}</p>
                    )}
                  </div>
                )}

                {/* Demo note */}
                <p className="rounded-xl bg-muted/40 px-3 py-2 text-[10px] text-muted-foreground">
                  Reservation managed by ReRoute AI. Notifications are sent to a demo mailbox
                  in this portfolio build — no real hotels are contacted.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
