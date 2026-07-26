import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageHeader, Eyebrow, Pill, Reveal, LiveDot } from "@/components/app/primitives";
import { TRIPS, type Trip } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

function countdownLabel(hours: number) {
  const h = Math.floor(hours) % 24 === hours ? Math.floor(hours) : Math.floor(hours);
  const days = Math.floor(hours / 24);
  const remH = Math.floor(hours % 24);
  const mins = Math.floor((hours % 1) * 60) + 12;
  if (days > 0) return `${days}d ${remH}h`;
  return `${h}h ${mins}m`;
}

function statusTone(status: Trip["status"]) {
  switch (status) {
    case "On time": return "success" as const;
    case "Rerouted": return "warning" as const;
    case "Boarding": return "primary" as const;
    default: return "muted" as const;
  }
}

function CitySilhouette({ seed }: { seed: number }) {
  const bars = Array.from({ length: 9 }, (_, i) => {
    const h = 14 + ((seed * (i + 3) * 37) % 46);
    return { x: i * 11, h };
  });
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-70">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={60 - b.h} width={8} height={b.h} fill="rgba(255,255,255,0.14)" rx="1" />
      ))}
    </svg>
  );
}

function Grain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
      <filter id="grain-trips"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#grain-trips)" />
    </svg>
  );
}

function QRMatrix({ seed }: { seed: number }) {
  const size = 10;
  const cells = Array.from({ length: size * size }, (_, i) => ((seed * (i + 1) * 17) % 5) < 2);
  return (
    <div className="grid grid-cols-10 gap-[2px] rounded-lg bg-foreground p-2" style={{ width: 108 }}>
      {cells.map((on, i) => (
        <div key={i} className={cn("h-2 w-2 rounded-[1px]", on ? "bg-background" : "bg-foreground")} />
      ))}
    </div>
  );
}

function RouteStrip({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative flex items-center gap-2 text-background/90">
      <span className="text-sm font-semibold tracking-tight">{from}</span>
      <div className="relative h-px flex-1 overflow-hidden">
        <div className="absolute inset-0 border-t border-dashed border-background/40" />
        <motion.div
          className="absolute -top-[5px]"
          animate={{ left: ["0%", "88%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ✈
        </motion.div>
      </div>
      <span className="text-sm font-semibold tracking-tight">{to}</span>
    </div>
  );
}

function TripCard({ trip, index, span }: { trip: Trip; index: number; span: "tall" | "short" }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="mb-6 break-inside-avoid">
      <motion.div
        layout
        layoutId={`card-${trip.id}`}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ y: -6 }}
        transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
        className="cursor-pointer overflow-hidden rounded-3xl border border-border/60 shadow-soft hover:shadow-float"
      >
        <div className={cn("relative overflow-hidden bg-gradient-to-br p-6", trip.hue, span === "tall" ? "h-64" : "h-48")}>
          <Grain />
          <CitySilhouette seed={index + 3} />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <Eyebrow className="text-background/70">{trip.date}</Eyebrow>
                <h3 className="mt-1 text-3xl font-semibold tracking-tight text-background">{trip.city}</h3>
                <p className="text-xs tracking-[0.2em] text-background/60">{trip.code} · {trip.country}</p>
              </div>
              <Pill tone={statusTone(trip.status)} className="bg-background/15 text-background backdrop-blur">
                {trip.status}
              </Pill>
            </div>
            <div className="space-y-3">
              <RouteStrip from={trip.from} to={trip.to} />
              <div className="flex items-center justify-between text-background/85">
                <span className="rounded-full bg-background/15 px-2.5 py-1 text-[11px] backdrop-blur">
                  {trip.weather} · {trip.tempC}°C
                </span>
                <span className="font-mono text-sm font-semibold">{countdownLabel(trip.countdownHours)}</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card"
            >
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    ["Carrier", trip.carrier],
                    ["Flight", trip.flight],
                    ["Gate", trip.gate],
                    ["Seat", trip.seat],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-border/60 bg-muted/40 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="relative pl-4">
                  <div className="absolute left-1 top-1 h-[calc(100%-8px)] w-px bg-border" />
                  {[
                    { label: "Check-in", time: "2h before" },
                    { label: "Boarding", time: trip.gate + " · " + trip.depart },
                    { label: "Departure", time: trip.depart },
                    { label: "Arrival", time: trip.arrive },
                  ].map((s, i) => (
                    <div key={s.label} className="relative mb-3 pl-4 last:mb-0">
                      <span className="absolute -left-[3px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm font-medium text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.time}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Boarding pass</p>
                    <p className="mt-1 text-sm text-foreground">{trip.flight} · {trip.seat}</p>
                    <Link
                      to="/trips/$id"
                      params={{ id: trip.id }}
                      className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View trip →
                    </Link>
                  </div>
                  <QRMatrix seed={index + 5} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export const Route = createFileRoute("/_shell/trips/")({
  component: TripsPage,
  head: () => ({
    meta: [
      { title: "Trips · ReRoute AI" },
      { name: "description", content: "Your travel wallet — boarding passes that rebook themselves." },
      { property: "og:title", content: "Trips · ReRoute AI" },
      { property: "og:description", content: "A living wallet of every itinerary, self-healing in real time." },
    ],
  }),
});

function TripsPage() {
  const spans: ("tall" | "short")[] = ["tall", "short", "short", "tall"];
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Wallet"
        title="Every trip, one living pass."
        lede="Boarding passes that update themselves the moment weather, ATC, or a carrier changes the plan. Drag to browse what's next, tap any pass to open it."
        actions={
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 shadow-soft">
            <LiveDot tone="success" />
            <span className="text-xs font-medium text-muted-foreground">All passes synced</span>
          </div>
        }
      />

      <section>
        <Eyebrow className="mb-3">Next departures</Eyebrow>
        <motion.div
          className="flex cursor-grab gap-4 overflow-hidden active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -(TRIPS.length * 220), right: 0 }}
        >
          {TRIPS.map((t, i) => (
            <motion.div
              key={t.id}
              className={cn("relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-soft", t.hue)}
              whileHover={{ scale: 1.02 }}
            >
              <Grain />
              <CitySilhouette seed={i + 1} />
              <div className="relative flex h-full flex-col justify-between">
                <p className="text-xs tracking-[0.2em] text-background/70">{t.code}</p>
                <div>
                  <p className="text-xl font-semibold text-background">{t.city}</p>
                  <p className="font-mono text-xs text-background/80">{countdownLabel(t.countdownHours)} to departure</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="columns-1 gap-6 md:columns-2">
        {TRIPS.map((trip, i) => (
          <Reveal key={trip.id} delay={i * 0.06}>
            <TripCard trip={trip} index={i} span={spans[i % spans.length]} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
