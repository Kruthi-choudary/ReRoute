import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Plane,
  Bot,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  Hotel,
  CalendarClock,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Panel, Eyebrow, CountUp, Ring, Pill, Reveal, LiveDot } from "@/components/app/primitives";
import { WorldMap } from "@/components/app/WorldMap";
import { type Trip } from "@/lib/travel-data";
import { useTrips, useNotifications, useRecovery, type ApiRecoveryPlan } from "@/lib/queries";
import { useRecoverySocket } from "@/lib/useRecoverySocket";

export const Route = createFileRoute("/_shell/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Command Center — ReRoute AI" },
      { name: "description", content: "Live airspace, AI recovery status and upcoming trips in one autonomous command center." },
      { property: "og:title", content: "Command Center — ReRoute AI" },
      { property: "og:description", content: "Real-time disruption intelligence for every trip you're running." },
    ],
  }),
});

function RecoveryTimeline({ plan }: { plan: ApiRecoveryPlan }) {
  const actions = plan.actions;
  const total = actions.length;
  const done = actions.filter((a) => a.status === "COMPLETED").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const newFlight = plan.selected_flight?.[0];
  const flightLabel = newFlight
    ? `${newFlight.origin ?? newFlight.dep_iata ?? "—"} → ${newFlight.destination ?? newFlight.arr_iata ?? "—"} · ${newFlight.flight_number ?? newFlight.flight_iata ?? "—"}`
    : "Recovery in progress";

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <Eyebrow>Travel recovery timeline</Eyebrow>
        <Pill tone={plan.status === "COMPLETED" ? "success" : "warning"}>
          <Bot className="h-3 w-3" /> {flightLabel}
        </Pill>
      </div>
      <div className="relative mt-8 flex items-center justify-between px-2">
        <div className="absolute left-2 right-2 top-4 h-[2px] bg-border/70" />
        <motion.div
          className="absolute left-2 top-4 h-[2px] bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {actions.map((a, i) => {
          const state = a.status === "COMPLETED" ? "done" : a.status === "IN_PROGRESS" ? "running" : "pending";
          const label = a.action_type.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const time = a.executed_at ? new Date(a.executed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
          return (
            <div key={a.id} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / actions.length}%` }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 18 }}
                className={
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold " +
                  (state === "done"
                    ? "border-primary bg-primary text-primary-foreground"
                    : state === "running"
                    ? "border-[var(--warning)] bg-card text-[var(--warning)]"
                    : "border-border bg-card text-muted-foreground")
                }
              >
                {state === "running" ? (
                  <motion.span className="h-2 w-2 rounded-full bg-[var(--warning)]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                ) : i + 1}
              </motion.div>
              <p className="mt-3 max-w-[110px] text-center text-[11px] font-medium text-foreground">{label}</p>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">{time}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function NoDisruptionTimeline() {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <Eyebrow>Travel recovery timeline</Eyebrow>
        <Pill tone="success"><LiveDot tone="success" /> All clear</Pill>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <ShieldCheck className="h-8 w-8 text-[var(--success)]/60" />
        <p className="text-sm font-medium text-foreground">No disruptions detected</p>
        <p className="text-xs text-muted-foreground">When a recovery runs, the full action timeline will appear here.</p>
      </div>
    </Panel>
  );
}

const QUICK_ACTIONS = [
  { icon: Search, label: "Find flight", to: "/trips" as const },
  { icon: Hotel, label: "Hold hotel", to: "/hotels" as const },
  { icon: ShieldCheck, label: "File claim", to: "/recovery" as const },
  { icon: CalendarClock, label: "Reschedule", to: "/recovery" as const },
];

function Dashboard() {
  const trips = useTrips();
  const notifications = useNotifications();
  const recovery = useRecovery();
  const trip = trips[0];
  const realTrip = trips.find((t) => /^\d+$/.test(t.id));
  useRecoverySocket(realTrip?.id ?? null);

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-2">Command center</Eyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Good morning. Everything's under control.
            </h1>
          </div>
          <Pill tone="success">
            <LiveDot tone="success" /> All trips protected
          </Pill>
        </div>
      </Reveal>

      <div className="grid grid-cols-12 gap-5">
        {/* Live map — huge */}
        <Reveal delay={0.05} className="col-span-12 lg:col-span-8">
          <Panel padded={false} className="h-[440px]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
              <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border/60 bg-card/85 px-4 py-2 shadow-soft backdrop-blur-xl">
                <LiveDot tone="success" />
                <span className="text-sm font-semibold">Live airspace</span>
              </div>
              <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-border/60 bg-card/85 px-4 py-2 text-[11px] shadow-soft backdrop-blur-xl">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Active</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Rerouted</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" /> Storm</span>
              </div>
            </div>
            <WorldMap className="h-full" />
          </Panel>
        </Reveal>

        {/* Trip protection rail */}
        <Reveal delay={0.1} className="col-span-12 lg:col-span-4">
          <Panel className="flex h-[440px] flex-col">
            <div className="flex items-center justify-between">
              <Eyebrow>Trip protection</Eyebrow>
              <LiveDot tone="success" />
            </div>
            <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-4">
              <Ring value={100} size={140} stroke={12} tone="success" label="100%" sub="protected" />
              <p className="text-center text-sm text-muted-foreground">
                All your trips are monitored in real time. Disruptions trigger automatic recovery — no action needed.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Trips tracked</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  <CountUp to={trips.length} />
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Auto-recovery</p>
                <p className="mt-1 text-xl font-semibold text-foreground">On</p>
              </div>
            </div>
          </Panel>
        </Reveal>

        {/* Recovery timeline — wide */}
        <Reveal delay={0.12} className="col-span-12">
          {recovery?.plan ? <RecoveryTimeline plan={recovery.plan} /> : <NoDisruptionTimeline />}
        </Reveal>

        {/* Quick actions */}
        <Reveal delay={0.14} className="col-span-12 md:col-span-4">
          <Panel className="h-full">
            <Eyebrow>Quick actions</Eyebrow>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-4 transition-all hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-soft active:scale-95"
                >
                  <a.icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">{a.label}</span>
                </Link>
              ))}
            </div>
          </Panel>
        </Reveal>

        {/* Weather */}
        <Reveal delay={0.16} className="col-span-12 md:col-span-4">
          <Panel className="relative h-full overflow-hidden">
            <Eyebrow>Destination weather</Eyebrow>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Zurich, Switzerland
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-5xl font-semibold tracking-tight text-foreground">
                <CountUp to={19} suffix="°" />
              </p>
              <RainCloud />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Light drizzle · feels like 17°</p>
          </Panel>
        </Reveal>

        {/* Boarding pass */}
        <Reveal delay={0.18} className="col-span-12 md:col-span-4">
          {trip ? <BoardingPass trip={trip} /> : <NoTripsPanel />}
        </Reveal>

        {/* Upcoming flights */}
        <Reveal delay={0.2} className="col-span-12 lg:col-span-7">
          <Panel>
            <div className="flex items-center justify-between">
              <Eyebrow>Upcoming flights</Eyebrow>
              <Pill tone="muted"><Plane className="h-3 w-3" /> {trips.length} planned</Pill>
            </div>
            <div className="mt-5 space-y-3">
              {trips.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No trips yet — add one to start autonomous protection.
                </p>
              )}
              {trips.slice(0, 3).map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.hue} text-background`}>
                      <Plane className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.from} <ChevronRight className="inline h-3 w-3 text-muted-foreground" /> {t.to}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{t.flight} · {t.carrier} · {t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground">T-{t.countdownHours}h</span>
                    <Pill tone={t.status === "Rerouted" ? "warning" : t.status === "Boarding" ? "primary" : (t.status === "Delayed" || t.status === "Action Required") ? "danger" : t.status === "Recovered" ? "success" : "muted"}>
                      {t.status}
                    </Pill>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        </Reveal>

        {/* Notifications */}
        <Reveal delay={0.22} className="col-span-12 lg:col-span-5">
          <Panel>
            <div className="flex items-center justify-between">
              <Eyebrow>Recent notifications</Eyebrow>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-5 space-y-4">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + (n.unread ? "bg-primary" : "bg-border")} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}

function RainCloud() {
  return (
    <svg width="88" height="70" viewBox="0 0 88 70" fill="none">
      <motion.ellipse
        cx="44" cy="30" rx="30" ry="18"
        fill="var(--muted)"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {[18, 34, 50, 66].map((x, i) => (
        <motion.line
          key={x}
          x1={x} y1={50} x2={x - 6} y2={64}
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function NoTripsPanel() {
  return (
    <Panel className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <Plane className="h-6 w-6 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold text-foreground">No trips yet</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Add a trip to see your boarding pass here.</p>
      </div>
    </Panel>
  );
}

function BoardingPass({ trip: t }: { trip: Trip }) {
  return (
    <Panel className="h-full" padded={false}>
      <div className={`relative overflow-hidden rounded-t-3xl bg-gradient-to-br ${t.hue} p-5 text-background`}>
        <Eyebrow className="text-background/70">Boarding pass</Eyebrow>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-tight">{t.from}</p>
            <p className="text-[11px] text-background/70">{t.depart}</p>
          </div>
          <Plane className="h-5 w-5 rotate-90 text-background/70" />
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight">{t.to}</p>
            <p className="text-[11px] text-background/70">{t.arrive}</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-dashed border-border/60 px-5 py-4">
        <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background" />
        <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background" />
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-[11px]">
            <div><p className="text-muted-foreground">Gate</p><p className="font-semibold text-foreground">{t.gate}</p></div>
            <div><p className="text-muted-foreground">Seat</p><p className="font-semibold text-foreground">{t.seat}</p></div>
            <div><p className="text-muted-foreground">Flight</p><p className="font-semibold text-foreground">{t.flight}</p></div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
            <QrCode className="h-7 w-7" />
          </div>
        </div>
      </div>
    </Panel>
  );
}
