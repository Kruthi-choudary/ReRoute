import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Panel, Eyebrow, Pill, Reveal } from "@/components/app/primitives";
import { TRIPS } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

const ITINERARY = [
  { title: "Depart home", detail: "Car service to airport, 3h before departure", time: "T-3h" },
  { title: "Check-in & security", detail: "Priority lane, TSA PreCheck eligible", time: "T-2h" },
  { title: "Lounge", detail: "Polaris/First lounge access, light dining", time: "T-1h" },
  { title: "Boarding", detail: "Group 1 boarding via jet bridge", time: "T-30m" },
  { title: "In flight", detail: "Wifi + entertainment, meal service twice", time: "Enroute" },
  { title: "Arrival & transfer", detail: "Private transfer waiting curbside", time: "Landing" },
];

const DOCS = ["Passport (valid to 2031)", "Visa — not required", "Travel insurance policy #RA-88291", "Vaccination record"];
const CONTACTS = [
  { name: "ReRoute Concierge", phone: "+1 800 555 0134" },
  { name: "Local embassy", phone: "+41 44 123 4567" },
  { name: "Hotel front desk", phone: "+41 44 999 2201" },
];
const FORECAST = [
  { day: "Today", temp: 19, icon: "🌧" },
  { day: "Tomorrow", temp: 22, icon: "⛅" },
  { day: "Wed", temp: 24, icon: "☀" },
  { day: "Thu", temp: 20, icon: "🌦" },
];

function Grain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
      <filter id="grain-detail"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" /></filter>
      <rect width="100%" height="100%" filter="url(#grain-detail)" />
    </svg>
  );
}

function Skyline() {
  const bars = Array.from({ length: 14 }, (_, i) => 20 + ((i * 53) % 60));
  return (
    <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60">
      {bars.map((h, i) => (
        <rect key={i} x={i * 14.3} y={70 - h} width={11} height={h} fill="rgba(255,255,255,0.16)" />
      ))}
    </svg>
  );
}

export const Route = createFileRoute("/_shell/trips/$id")({
  component: TripDetailPage,
  head: () => ({
    meta: [
      { title: "Trip Details · ReRoute AI" },
      { name: "description", content: "Full itinerary, hotel, transfers and documents for this trip." },
      { property: "og:title", content: "Trip Details · ReRoute AI" },
      { property: "og:description", content: "The complete magazine-style briefing for a single journey." },
    ],
  }),
});

function TripDetailPage() {
  const { id } = Route.useParams();
  const trip = TRIPS.find((t) => t.id === id) ?? TRIPS[0];
  const [rate, setRate] = useState(50);
  const [openLeg, setOpenLeg] = useState<number | null>(1);

  const localCurrency = trip.country === "Switzerland" ? "CHF" : trip.country === "Japan" ? "¥" : trip.country === "United Arab Emirates" ? "AED" : "S$";
  const fx = trip.country === "Switzerland" ? 0.88 : trip.country === "Japan" ? 149 : trip.country === "United Arab Emirates" ? 3.67 : 1.34;
  const usd = rate;
  const converted = (usd * fx).toFixed(2);

  return (
    <div className="space-y-14">
      <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        ← Back to trips
      </Link>

      <div className={cn("relative -mt-2 overflow-hidden rounded-3xl bg-gradient-to-br p-10 md:p-16", trip.hue)}>
        <Grain />
        <Skyline />
        <div className="relative">
          <Eyebrow className="text-background/70">{trip.date} · {trip.country}</Eyebrow>
          <h1 className="mt-2 text-6xl font-semibold tracking-tight text-background md:text-8xl">{trip.city}</h1>
          <p className="mt-3 max-w-md text-background/80">
            {trip.from} → {trip.to} aboard {trip.carrier} {trip.flight}, arriving {trip.arrive} local time.
          </p>
        </div>
        <div className="relative mt-10 flex flex-wrap gap-3">
          {[
            ["Flight", trip.flight],
            ["Gate", trip.gate],
            ["Seat", trip.seat],
            ["Terminal", "T4"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-background/20 bg-background/10 px-5 py-3 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-background/60">{k}</p>
              <p className="text-lg font-semibold text-background">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Panel padded className="p-8">
            <Eyebrow className="mb-4">Itinerary</Eyebrow>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-border" />
              {ITINERARY.map((leg, i) => (
                <motion.div
                  key={leg.title}
                  className="relative mb-5 cursor-pointer pl-6 last:mb-0"
                  onMouseEnter={() => setOpenLeg(i)}
                  layout
                >
                  <motion.span
                    className={cn("absolute -left-[1px] top-1 h-3 w-3 rounded-full border-2 border-background", openLeg === i ? "bg-primary" : "bg-muted-foreground/40")}
                    layout
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-foreground">{leg.title}</p>
                    <span className="text-xs font-mono text-muted-foreground">{leg.time}</span>
                  </div>
                  <motion.p
                    initial={false}
                    animate={{ height: openLeg === i ? "auto" : 0, opacity: openLeg === i ? 1 : 0 }}
                    className="overflow-hidden text-sm text-muted-foreground"
                  >
                    {leg.detail}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Panel padded className="p-6">
              <Eyebrow className="mb-2">Stay</Eyebrow>
              <p className="text-xl font-semibold text-foreground">Widder Hotel</p>
              <p className="mt-1 text-sm text-muted-foreground">Late check-in held to 02:00, room upgraded to suite.</p>
              <Pill tone="success" className="mt-3">Confirmed</Pill>
            </Panel>
          </Reveal>
          <Reveal delay={0.1}>
            <Panel padded className="p-6">
              <Eyebrow className="mb-2">Transfer</Eyebrow>
              <p className="text-xl font-semibold text-foreground">Private taxi</p>
              <p className="mt-1 text-sm text-muted-foreground">Pickup shifted to 21:40 to match new arrival.</p>
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel padded className="p-6">
              <Eyebrow className="mb-2">Insurance</Eyebrow>
              <p className="text-xl font-semibold text-foreground">Full protection</p>
              <p className="mt-1 text-sm text-muted-foreground">Policy #RA-88291 covers delay, medical, baggage.</p>
            </Panel>
          </Reveal>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Reveal className="md:col-span-1">
          <Panel padded className="p-6">
            <Eyebrow className="mb-3">Travel documents</Eyebrow>
            <ul className="space-y-2">
              {DOCS.map((d) => (
                <li key={d} className="text-sm text-foreground">· {d}</li>
              ))}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={0.05} className="md:col-span-1">
          <Panel padded className="p-6">
            <Eyebrow className="mb-3">Emergency contacts</Eyebrow>
            <ul className="space-y-3">
              {CONTACTS.map((c) => (
                <li key={c.name} className="flex justify-between text-sm">
                  <span className="text-foreground">{c.name}</span>
                  <span className="text-muted-foreground">{c.phone}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-1">
          <Panel padded className="p-6">
            <Eyebrow className="mb-3">Currency converter</Eyebrow>
            <p className="text-2xl font-semibold text-foreground">${usd} → {converted} {localCurrency}</p>
            <input
              type="range"
              min={1}
              max={500}
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
              className="mt-4 w-full accent-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">Static reference rate for planning only.</p>
          </Panel>
        </Reveal>
      </div>

      <Reveal>
        <blockquote className="border-l-4 border-primary py-2 pl-6 text-2xl font-medium italic leading-snug text-foreground md:text-3xl">
          "ReRoute rebooked the whole trip before I'd even seen the cancellation email."
        </blockquote>
      </Reveal>

      <Reveal>
        <Panel padded className="p-6">
          <Eyebrow className="mb-4">Local forecast</Eyebrow>
          <div className="flex flex-wrap gap-4">
            {FORECAST.map((f) => (
              <div key={f.day} className="flex min-w-[100px] flex-1 flex-col items-center rounded-2xl border border-border/60 bg-muted/30 p-4">
                <span className="text-2xl">{f.icon}</span>
                <p className="mt-1 text-sm font-medium text-foreground">{f.day}</p>
                <p className="text-xs text-muted-foreground">{f.temp}°C</p>
              </div>
            ))}
          </div>
        </Panel>
      </Reveal>
    </div>
  );
}
