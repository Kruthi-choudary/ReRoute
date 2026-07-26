import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Panel, PageHeader, Eyebrow, CountUp, Reveal, Pill } from "@/components/app/primitives";
import { WorldMap } from "@/components/app/WorldMap";

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021];

type YearChapter = {
  year: number;
  flights: number;
  miles: number;
  countries: number;
  hotels: number;
  trips: { city: string; country: string; note: string; month: string }[];
  stamps: string[];
};

const CHAPTERS: YearChapter[] = [
  {
    year: 2026,
    flights: 9,
    miles: 48200,
    countries: 5,
    hotels: 7,
    trips: [
      { city: "Zurich", country: "Switzerland", note: "Rebooked mid-storm, zero cost impact", month: "Aug" },
      { city: "Dubai", country: "UAE", note: "Business upgrade auto-applied", month: "Aug" },
      { city: "Tokyo", country: "Japan", note: "Late-arrival hotel held automatically", month: "Sep" },
    ],
    stamps: ["ZRH", "DXB", "HND"],
  },
  {
    year: 2025,
    flights: 14,
    miles: 71300,
    countries: 7,
    hotels: 11,
    trips: [
      { city: "Singapore", country: "Singapore", note: "Monsoon reroute saved 6 hours", month: "Mar" },
      { city: "Sydney", country: "Australia", note: "First status-match upgrade", month: "Jun" },
      { city: "São Paulo", country: "Brazil", note: "EU261 compensation credited", month: "Nov" },
    ],
    stamps: ["SIN", "SYD", "GRU"],
  },
  {
    year: 2024,
    flights: 11,
    miles: 58900,
    countries: 6,
    hotels: 9,
    trips: [
      { city: "London", country: "United Kingdom", note: "Gate change handled silently", month: "Feb" },
      { city: "Paris", country: "France", note: "Rail-air combo optimized", month: "Jul" },
    ],
    stamps: ["LHR", "CDG"],
  },
  {
    year: 2023,
    flights: 8,
    miles: 39400,
    countries: 4,
    hotels: 6,
    trips: [
      { city: "San Francisco", country: "United States", note: "First trip on ReRoute AI", month: "May" },
      { city: "New York", country: "United States", note: "Weather hold, auto rebook", month: "Oct" },
    ],
    stamps: ["SFO", "JFK"],
  },
  {
    year: 2022,
    flights: 5,
    miles: 21200,
    countries: 3,
    hotels: 4,
    trips: [{ city: "Zurich", country: "Switzerland", note: "Winter conference circuit", month: "Jan" }],
    stamps: ["ZRH"],
  },
  {
    year: 2021,
    flights: 2,
    miles: 9800,
    countries: 2,
    hotels: 2,
    trips: [{ city: "London", country: "United Kingdom", note: "First international trip back", month: "Sep" }],
    stamps: ["LHR"],
  },
];

const ALL_COUNTRIES = Array.from(new Set(CHAPTERS.flatMap((c) => c.trips.map((t) => t.country)))).sort();

function StampBadge({ code, rotate }: { code: string; rotate: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 20 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 14 }}
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/5 text-primary"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest">{code}</span>
      <span className="text-[8px] text-primary/70">Visited</span>
    </motion.div>
  );
}

function YearChapterBlock({ chapter }: { chapter: YearChapter }) {
  return (
    <div id={`year-${chapter.year}`} className="scroll-mt-28">
      <Reveal>
        <div className="mb-6 flex items-baseline gap-4">
          <span className="text-6xl font-semibold tracking-tighter text-foreground md:text-7xl">{chapter.year}</span>
          <Pill tone="primary">{chapter.trips.length} trips logged</Pill>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        {/* timeline spine */}
        <Panel padded={false} className="overflow-hidden">
          <ul className="relative py-2">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: "top" }}
              className="absolute left-[27px] top-2 bottom-2 w-px bg-border"
            />
            {chapter.trips.map((t, i) => (
              <motion.li
                key={t.city + i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex gap-4 px-6 py-4"
              >
                <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.month} {chapter.year}</p>
                  <p className="text-sm font-semibold text-foreground">{t.city}, {t.country}</p>
                  <p className="text-sm text-muted-foreground">{t.note}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </Panel>

        {/* stats + stamps */}
        <Panel className="flex w-full flex-col gap-6 md:w-64" padded>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Flights", value: chapter.flights },
              { label: "Miles", value: chapter.miles },
              { label: "Countries", value: chapter.countries },
              { label: "Hotels", value: chapter.hotels },
            ].map((s) => (
              <div key={s.label}>
                <CountUp to={s.value} className="block text-2xl font-semibold tracking-tight text-foreground" />
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div>
            <Eyebrow className="mb-2">Passport stamps</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {chapter.stamps.map((code, i) => (
                <StampBadge key={code} code={code} rotate={(i % 2 === 0 ? -1 : 1) * (8 + i * 4)} />
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function History() {
  const [active, setActive] = useState(2026);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Travel history"
        title="Six years, one continuous journey"
        lede="Every trip ReRoute AI has protected, organized into a scrollable timeline of chapters, stamps and stats."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[72px_1fr]">
        {/* year scrubber */}
        <div className="hidden lg:sticky lg:top-24 lg:flex lg:h-fit lg:flex-col lg:items-center lg:gap-4">
          {YEARS.map((y) => (
            <a
              key={y}
              href={`#year-${y}`}
              onClick={() => setActive(y)}
              className={cnYear(active === y)}
            >
              {String(y).slice(2)}
            </a>
          ))}
        </div>

        <div className="space-y-16">
          {CHAPTERS.map((c) => (
            <YearChapterBlock key={c.year} chapter={c} />
          ))}
        </div>
      </div>

      <Reveal>
        <Panel padded={false} className="overflow-hidden">
          <div className="h-[380px]">
            <WorldMap compact />
          </div>
          <div className="border-t border-border/60 px-6 py-4">
            <Eyebrow className="mb-1">Countries visited</Eyebrow>
            <p className="text-sm text-muted-foreground">{ALL_COUNTRIES.join(" · ")}</p>
          </div>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel className="flex flex-wrap items-center justify-around gap-8 text-center" padded>
          {[
            { label: "Total flights", value: CHAPTERS.reduce((a, c) => a + c.flights, 0) },
            { label: "Total miles", value: CHAPTERS.reduce((a, c) => a + c.miles, 0) },
            { label: "Countries visited", value: ALL_COUNTRIES.length },
            { label: "Nights in hotels", value: CHAPTERS.reduce((a, c) => a + c.hotels, 0) * 3 },
          ].map((s) => (
            <div key={s.label}>
              <CountUp to={s.value} className="block text-3xl font-semibold tracking-tight text-foreground" />
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </Panel>
      </Reveal>
    </div>
  );
}

function cnYear(active: boolean) {
  return [
    "flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
    active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground hover:border-primary/40",
  ].join(" ");
}

export const Route = createFileRoute("/_shell/history")({
  component: History,
  head: () => ({
    meta: [
      { title: "Travel History · ReRoute AI" },
      { name: "description", content: "A year-by-year timeline of trips, stamps and stats protected by ReRoute AI." },
      { property: "og:title", content: "Travel History · ReRoute AI" },
      { property: "og:description", content: "Six years of journeys, rendered as an interactive vertical timeline." },
    ],
  }),
});
