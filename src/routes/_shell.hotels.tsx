import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PageHeader, Eyebrow, Pill, Reveal } from "@/components/app/primitives";
import { WorldMap } from "@/components/app/WorldMap";
import { AIRPORTS } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

type Hotel = {
  id: string;
  name: string;
  city: string;
  nearAirport: string;
  distanceKm: number;
  pricePerNight: number;
  refundable: boolean;
  rating: number;
  hue: string;
  amenities: ("wifi" | "pool" | "gym" | "breakfast" | "parking")[];
  height: number;
};

const HOTELS: Hotel[] = [
  { id: "h1", name: "Widder Hotel", city: "Zurich", nearAirport: "ZRH", distanceKm: 11, pricePerNight: 620, refundable: true, rating: 4.8, hue: "from-[#1e3a5f] to-[#0f1b3d]", amenities: ["wifi", "gym", "breakfast"], height: 380 },
  { id: "h2", name: "Burj Al Nour", city: "Dubai", nearAirport: "DXB", distanceKm: 8, pricePerNight: 410, refundable: false, rating: 4.6, hue: "from-[#8b5e34] to-[#3b2415]", amenities: ["wifi", "pool", "gym", "parking"], height: 300 },
  { id: "h3", name: "Sakura Tower", city: "Tokyo", nearAirport: "HND", distanceKm: 14, pricePerNight: 280, refundable: true, rating: 4.5, hue: "from-[#5b2b45] to-[#20101c]", amenities: ["wifi", "breakfast"], height: 340 },
  { id: "h4", name: "Marina Bay Loft", city: "Singapore", nearAirport: "SIN", distanceKm: 19, pricePerNight: 350, refundable: true, rating: 4.7, hue: "from-[#134e4a] to-[#052e2b]", amenities: ["wifi", "pool", "parking"], height: 260 },
  { id: "h5", name: "Le Marais Suites", city: "Paris", nearAirport: "CDG", distanceKm: 24, pricePerNight: 290, refundable: false, rating: 4.3, hue: "from-[#4a1d3d] to-[#1a0a17]", amenities: ["wifi", "breakfast", "gym"], height: 320 },
  { id: "h6", name: "Harbourline Hotel", city: "Sydney", nearAirport: "SYD", distanceKm: 9, pricePerNight: 240, refundable: true, rating: 4.4, hue: "from-[#0f3d3a] to-[#04201e]", amenities: ["wifi", "pool"], height: 300 },
  { id: "h7", name: "Ipanema Lights", city: "São Paulo", nearAirport: "GRU", distanceKm: 27, pricePerNight: 180, refundable: true, rating: 4.1, hue: "from-[#5a3410] to-[#241205]", amenities: ["wifi", "parking", "breakfast"], height: 260 },
  { id: "h8", name: "The Kensington", city: "London", nearAirport: "LHR", distanceKm: 22, pricePerNight: 470, refundable: false, rating: 4.9, hue: "from-[#22304a] to-[#0b1120]", amenities: ["wifi", "gym", "breakfast", "parking"], height: 360 },
];

const AMENITY_ICON: Record<string, string> = { wifi: "📶", pool: "🏊", gym: "🏋", breakfast: "🥐", parking: "🅿️" };

function Grain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
      <filter id="grain-hotels"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" /></filter>
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

function HotelTile({ hotel, index, onSelect }: { hotel: Hotel; index: number; onSelect: (h: Hotel) => void }) {
  return (
    <motion.div
      layout
      layoutId={`hotel-${hotel.id}`}
      onClick={() => onSelect(hotel)}
      whileHover="hover"
      className="group relative mb-6 cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br shadow-soft"
      style={{ height: hotel.height }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", hotel.hue)} />
      <Grain />
      <Architecture seed={index + 2} />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <Eyebrow className="text-background/70">{hotel.city}</Eyebrow>
          <Pill className="bg-background/15 text-background backdrop-blur">★ {hotel.rating}</Pill>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-background">{hotel.name}</h3>
      </div>

      <motion.div
        variants={{ hover: { y: 0, opacity: 1 }, initial: { y: 20, opacity: 0 } }}
        initial="initial"
        className="absolute inset-x-3 bottom-3 rounded-2xl border border-border/60 bg-card/95 p-4 opacity-0 shadow-float backdrop-blur-xl transition-opacity group-hover:opacity-100"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">${hotel.pricePerNight}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
          <Pill tone={hotel.refundable ? "success" : "muted"}>{hotel.refundable ? "Refundable" : "Non-refundable"}</Pill>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{hotel.amenities.map((a) => AMENITY_ICON[a]).join(" ")}</span>
          <span>{hotel.distanceKm} km to {hotel.nearAirport}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const Route = createFileRoute("/_shell/hotels")({
  component: HotelsPage,
  head: () => ({
    meta: [
      { title: "Hotels · ReRoute AI" },
      { name: "description", content: "Every held-and-protected stay, laid out like a design mood board." },
      { property: "og:title", content: "Hotels · ReRoute AI" },
      { property: "og:description", content: "Browse hotel holds with live rebooking protection across your trips." },
    ],
  }),
});

function HotelsPage() {
  const [maxPrice, setMaxPrice] = useState(700);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(30);
  const [selected, setSelected] = useState<Hotel | null>(null);

  const filtered = useMemo(
    () =>
      HOTELS.filter(
        (h) => h.pricePerNight <= maxPrice && h.distanceKm <= maxDistance && (!refundableOnly || h.refundable),
      ),
    [maxPrice, refundableOnly, maxDistance],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stays"
        title="Every hotel hold, laid out like a mood board."
        lede="Hotel protection travels with your itinerary — check-in windows extend automatically when a flight shifts."
      />

      <div className="sticky top-2 z-30 flex flex-wrap items-center gap-3 rounded-full border border-border/60 bg-card/80 px-4 py-2.5 shadow-soft backdrop-blur-xl">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Filters</span>
        <label className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-xs">
          Max ${maxPrice}
          <input type="range" min={100} max={700} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-primary" />
        </label>
        <label className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-xs">
          Within {maxDistance}km
          <input type="range" min={5} max={30} value={maxDistance} onChange={(e) => setMaxDistance(+e.target.value)} className="accent-primary" />
        </label>
        <button
          onClick={() => setRefundableOnly((r) => !r)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            refundableOnly ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground",
          )}
        >
          Refundable only
        </button>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} stays</span>
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <Reveal className="mb-6 break-inside-avoid">
          <div className="h-[420px] overflow-hidden rounded-3xl border border-border/60 shadow-soft">
            <WorldMap compact className="h-full" />
          </div>
        </Reveal>
        {filtered.map((h, i) => (
          <Reveal key={h.id} delay={i * 0.04}>
            <HotelTile hotel={h} index={i} onSelect={setSelected} />
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={`hotel-${selected.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-float"
          >
            <div className={cn("relative h-28 bg-gradient-to-br", selected.hue)}>
              <Grain />
              <Architecture seed={9} />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className="text-lg font-semibold text-foreground">{selected.name}</p>
              <p className="text-xs text-muted-foreground">{selected.city} · {selected.distanceKm} km from {selected.nearAirport}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xl font-semibold text-foreground">${selected.pricePerNight}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
                <Pill tone={selected.refundable ? "success" : "muted"}>{selected.refundable ? "Refundable" : "Non-refundable"}</Pill>
              </div>
              <button className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                Confirm booking
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
