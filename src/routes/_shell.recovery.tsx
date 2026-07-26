import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, Plane, DollarSign, Clock, Gauge } from "lucide-react";
import { Panel, Eyebrow, PageHeader, CountUp, Pill, Reveal, LiveDot } from "@/components/app/primitives";
import { RECOVERY_STEPS, type RecoveryStep } from "@/lib/travel-data";

export const Route = createFileRoute("/_shell/recovery")({
  component: RecoveryCenter,
  head: () => ({
    meta: [
      { title: "Recovery Center — ReRoute AI" },
      { name: "description", content: "Watch the autonomous recovery workflow decide, compare and rebook in real time." },
      { property: "og:title", content: "Recovery Center — ReRoute AI" },
      { property: "og:description", content: "A GitHub-Actions-style workflow view of how ReRoute AI recovers your trip." },
    ],
  }),
});

type Candidate = {
  id: string;
  carrier: string;
  flight: string;
  route: string;
  price: number;
  duration: string;
  reliability: number;
  chosen?: boolean;
};

const CANDIDATES: Candidate[] = [
  { id: "c1", carrier: "United", flight: "UA 934", route: "JFK → BRU → ZRH", price: 612, duration: "10h 05m", reliability: 94, chosen: true },
  { id: "c2", carrier: "Lufthansa", flight: "LH 402", route: "JFK → FRA → ZRH", price: 741, duration: "11h 20m", reliability: 91 },
  { id: "c3", carrier: "Swiss", flight: "LX 17", route: "JFK → ZRH (next day)", price: 590, duration: "8h 10m", reliability: 88 },
  { id: "c4", carrier: "Air France", flight: "AF 023", route: "JFK → CDG → ZRH", price: 668, duration: "12h 40m", reliability: 90 },
];

const FACTORS = [
  { label: "Price", value: 82, icon: DollarSign },
  { label: "Duration", value: 68, icon: Clock },
  { label: "Reliability", value: 94, icon: Gauge },
  { label: "Loyalty fit", value: 76, icon: Plane },
];

const LOGS = [
  { t: "09:42:01", msg: "LX 15 cancellation event received from carrier feed" },
  { t: "09:42:03", msg: "Recovery agent spawned · scanning inventory across 9 carriers" },
  { t: "09:42:07", msg: "27 candidate itineraries returned within fare-class rules" },
  { t: "09:42:12", msg: "Weighting engine scored candidates on price/duration/reliability/loyalty" },
  { t: "09:42:15", msg: "Selected UA 934 · confidence 96% · savings $380 vs. average" },
  { t: "09:42:18", msg: "Fare held, seat 3A assigned, PNR updated" },
  { t: "09:46:02", msg: "Downstream services notified: hotel + ground transport" },
];

function RecoveryCenter() {
  const [selected, setSelected] = useState<RecoveryStep>(RECOVERY_STEPS[3]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recovery Center"
        title="One cancellation. Zero manual work."
        lede="Follow the autonomous workflow node by node, then inspect exactly how the decision engine chose your replacement itinerary."
        actions={
          <Pill tone="success">
            <LiveDot tone="success" /> Recovery in progress
          </Pill>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        {/* LEFT: workflow */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <Panel>
              <Eyebrow>Workflow · LX 15 → UA 934</Eyebrow>
              <div className="relative mt-6 pl-4">
                <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-border/70" />
                <div className="space-y-1">
                  {RECOVERY_STEPS.map((s, i) => {
                    const isSelected = s.id === selected.id;
                    return (
                      <motion.button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        whileHover={{ x: 3 }}
                        className={
                          "relative flex w-full items-start gap-4 rounded-2xl px-3 py-3 text-left transition-colors " +
                          (isSelected ? "bg-primary/10" : "hover:bg-muted/50")
                        }
                      >
                        <span className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card">
                          {s.state === "done" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          {s.state === "running" && (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}>
                              <Loader2 className="h-4 w-4 text-[var(--warning)]" />
                            </motion.span>
                          )}
                          {s.state === "pending" && <CircleDashed className="h-4 w-4 text-muted-foreground" />}
                          {s.state === "running" && (
                            <motion.span
                              className="absolute inset-0 rounded-full border-2 border-[var(--warning)]"
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className={"text-sm font-semibold " + (isSelected ? "text-primary" : "text-foreground")}>
                              {i + 1}. {s.label}
                            </span>
                            <span className="shrink-0 text-[10px] text-muted-foreground">{s.duration}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{s.detail}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Panel>
          </Reveal>
        </div>

        {/* RIGHT: decision engine */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Panel>
                <Eyebrow>Decision engine · {selected.label}</Eyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  AI compared 27 flights
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{selected.detail}</p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Stat icon={DollarSign} label="Saved" value={<CountUp to={380} prefix="$" />} tone="success" />
                  <Stat icon={Clock} label="Faster" value={<CountUp to={2} suffix="h" />} tone="primary" />
                  <Stat icon={Gauge} label="Confidence" value={<CountUp to={96} suffix="%" />} tone="warning" />
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Candidate itineraries</Eyebrow>
                <div className="mt-5 space-y-3">
                  {CANDIDATES.map((c) => (
                    <div
                      key={c.id}
                      className={
                        "relative flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-all " +
                        (c.chosen
                          ? "border-primary/50 bg-primary/5 shadow-soft"
                          : "border-border/60 bg-muted/20 opacity-70")
                      }
                    >
                      {c.chosen && (
                        <motion.div
                          layoutId="chosen-arrow"
                          className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 rounded-[2px] bg-primary"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.carrier} · {c.flight}</p>
                        <p className="text-[11px] text-muted-foreground">{c.route} · {c.duration}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">${c.price}</span>
                        {c.chosen ? <Pill tone="primary">Selected</Pill> : <Pill tone="muted">{c.reliability}% on-time</Pill>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary">
                  <Plane className="h-4 w-4" /> UA 934 chosen — best blend of reliability and loyalty fit at a $380 discount.
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Factor weighting</Eyebrow>
                <div className="mt-5 space-y-4">
                  {FACTORS.map((f) => (
                    <div key={f.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <f.icon className="h-3.5 w-3.5 text-muted-foreground" /> {f.label}
                        </span>
                        <span className="text-muted-foreground">{f.value}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${f.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Agent log stream</Eyebrow>
                <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1 font-mono text-[11px]">
                  {LOGS.map((l, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="shrink-0 text-muted-foreground">{l.t}</span>
                      <span className="text-foreground/80">{l.msg}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  tone: "success" | "primary" | "warning";
}) {
  const toneClass =
    tone === "success" ? "text-[var(--success)]" : tone === "warning" ? "text-[var(--warning)]" : "text-primary";
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <Icon className={"h-4 w-4 " + toneClass} />
      <p className={"mt-2 text-2xl font-semibold tracking-tight " + toneClass}>{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  );
}
