import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Plane, Radar, Sparkles, Bell, ShieldCheck, Hotel, Car, Ticket,
  ArrowRight, Play, Check, CloudLightning, MapPin, ChevronDown,
  Globe2, LineChart, Headphones, Building2, Lock, Zap, Menu, X,
} from "lucide-react";
import heroPlane from "@/assets/hero-plane.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "ReRoute AI — Travel Without Interruptions" },
      { name: "description", content: "Autonomous travel concierge that reroutes flights, hotels and transfers the moment a disruption occurs." },
      { property: "og:title", content: "ReRoute AI — Travel Without Interruptions" },
      { property: "og:description", content: "Autonomous flight recovery. Your journey never stops." },
    ],
  }),
});

/* ----------------------------- NAV ----------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Features", "Solutions", "Enterprise", "Pricing", "Support"];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/75 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
            <Plane className="h-4 w-4 -rotate-45" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">ReRoute<span className="text-primary">.ai</span></span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-secondary transition hover:text-foreground">{l}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-sm font-medium text-secondary transition hover:text-foreground">Login</a>
          <a href="#cta" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white/95 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => <a key={l} href={`#${l.toLowerCase()}`} className="text-sm">{l}</a>)}
              <a href="#cta" className="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background">Get Started</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------- HERO ANIMATION ------------------------- */
/** Airplane travels a flight path. Route reroutes mid-flight. Loops every ~15s. */
function FlightPath() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  // phase 0: initial, 1: original route drawn, 2: disruption detected, 3: rerouted
  useEffect(() => {
    let mounted = true;
    const run = () => {
      const seq: Array<[0 | 1 | 2 | 3, number]> = [
        [0, 300], [1, 3200], [2, 1600], [3, 6000],
      ];
      let acc = 0;
      seq.forEach(([p, dur]) => {
        acc += dur;
        setTimeout(() => mounted && setPhase(p), acc - dur);
      });
      setTimeout(() => mounted && run(), 15000);
    };
    run();
    return () => { mounted = false; };
  }, []);

  // path coords in viewBox 800 x 500
  const originalPath = "M -40 380 C 160 320, 340 300, 520 240 S 780 120, 860 80";
  const reroutePath  = "M -40 380 C 160 320, 300 340, 420 300 S 620 140, 860 40";

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="routeBlue" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="routeRed" x1="0" x2="1">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Original white trail */}
        <motion.path
          d={originalPath}
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: phase >= 1 ? 1 : 0,
            opacity: phase >= 3 ? 0 : phase >= 1 ? 0.9 : 0,
          }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />

        {/* Danger flash */}
        <motion.path
          d={originalPath}
          fill="none"
          stroke="url(#routeRed)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 2 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* New blue reroute */}
        <motion.path
          d={reroutePath}
          fill="none"
          stroke="url(#routeBlue)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: phase >= 3 ? 1 : 0 }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
        />

        {/* Origin marker */}
        <circle cx="-10" cy="380" r="4" fill="#fff" />
        {/* Old destination */}
        <motion.g animate={{ opacity: phase >= 3 ? 0.3 : 1 }} transition={{ duration: 0.8 }}>
          <circle cx="820" cy="80" r="5" fill="#fff" />
          <circle cx="820" cy="80" r="10" fill="none" stroke="#fff" strokeOpacity="0.4" />
        </motion.g>
        {/* New destination */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ transformOrigin: "820px 40px" }}
        >
          <circle cx="820" cy="40" r="6" fill="#14B8A6" />
          <circle cx="820" cy="40" r="12" fill="none" stroke="#14B8A6" strokeOpacity="0.5" />
        </motion.g>
      </svg>

      {/* Disruption toast */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute left-1/2 top-24 -translate-x-1/2 rounded-full bg-danger/95 px-4 py-2 text-xs font-medium text-white shadow-[var(--shadow-float)] backdrop-blur"
          >
            <span className="inline-flex items-center gap-2">
              <CloudLightning className="h-3.5 w-3.5" />
              Flight Disruption Detected — Weather
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------- LIVE RECOVERY CARD --------------------- */
const RECOVERY_STEPS = [
  { icon: Radar,      label: "Monitoring Flight AI248",    tone: "muted" as const },
  { icon: CloudLightning, label: "Delay Detected",          tone: "danger" as const },
  { icon: Sparkles,   label: "Searching Alternatives",     tone: "warning" as const },
  { icon: Plane,      label: "New Flight Found",           tone: "success" as const },
  { icon: Hotel,      label: "Hotel Updated",              tone: "success" as const },
  { icon: Car,        label: "Taxi Rescheduled",           tone: "success" as const },
  { icon: Ticket,     label: "Boarding Pass Generated",    tone: "success" as const },
];

function RecoveryCard() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a >= RECOVERY_STEPS.length ? 1 : a + 1)), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="relative w-full max-w-sm rounded-[22px] border border-white/60 bg-white/85 p-5 shadow-[var(--shadow-float)] backdrop-blur-xl bob"
    >
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success soft-pulse" />
            Live Recovery
          </div>
          <div className="mt-1 text-[15px] font-semibold">HYD → JFK</div>
        </div>
        <div className="rounded-full bg-danger/10 px-2.5 py-1 text-[11px] font-medium text-danger">
          Cancelled
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {RECOVERY_STEPS.map((s, i) => {
          const done = i < active;
          const current = i === active - 1;
          const Icon = s.icon;
          return (
            <li
              key={s.label}
              className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-all ${
                current ? "bg-primary/[0.06]" : ""
              }`}
              style={{ opacity: i < active ? 1 : 0.35 }}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-lg ${
                  done && !current
                    ? "bg-success/10 text-success"
                    : current
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-secondary"
                }`}
              >
                {done && !current ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <span className={`text-[13px] ${current ? "font-medium text-foreground" : "text-secondary"}`}>
                {s.label}
              </span>
              {current && (
                <motion.span
                  className="ml-auto h-1 w-1 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-secondary">
        <span>Autonomous · No action needed</span>
        <span className="font-mono">ETA 09:42</span>
      </div>
    </motion.div>
  );
}

/* ------------------------- HERO SECTION ------------------------- */
function Hero() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const headlines = ["Your Journey Never Stops.", "Our AI Already Recovered It."];
  useEffect(() => {
    const id = setInterval(() => setHeadlineIdx((i) => (i + 1) % headlines.length), 4500);
    return () => clearInterval(id);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const planeY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden pt-16">
      {/* Backdrop */}
      <motion.div style={{ y: cloudY }} className="absolute inset-0 -z-10">
        <img
          src={heroPlane}
          alt="Aircraft above clouds at sunrise"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Warm wash to light theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </motion.div>

      {/* Flight path overlay */}
      <motion.div style={{ y: planeY }} className="absolute inset-0 z-0">
        <FlightPath />
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-medium text-secondary backdrop-blur"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent soft-pulse" />
            Autonomous Travel Concierge · v3
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            Travel Without <br className="hidden sm:block" />
            <span className="relative">
              Interruptions.
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
                <motion.path
                  d="M2 8 C 80 2, 200 2, 298 6"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 1.2 }}
                />
              </svg>
            </span>
          </motion.h1>

          <div className="mt-6 h-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            <AnimatePresence mode="wait">
              <motion.span
                key={headlineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                {headlines[headlineIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 max-w-xl text-[17px] leading-relaxed text-secondary"
          >
            Our AI continuously monitors flights worldwide and automatically reroutes your entire
            journey — flights, hotels, transfers — when disruptions occur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:shadow-[0_40px_100px_-30px_rgba(37,99,235,0.55)]"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white"
            >
              <Play className="h-3.5 w-3.5" /> Watch Live Recovery
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-secondary"
          >
            {[
              { i: ShieldCheck, t: "Trusted by 40k+ travelers" },
              { i: Radar,       t: "24/7 Monitoring" },
              { i: Zap,         t: "Automatic Rebooking" },
            ].map(({ i: Icon, t }) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-primary" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <div className="flex justify-center lg:justify-end">
          <RecoveryCard />
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-secondary"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}

/* ------------------------- HOW IT WORKS ------------------------- */
function How() {
  const items = [
    { i: Radar,   t: "Detect",   d: "Continuously monitor 150+ airlines and 40+ countries in real time." },
    { i: Sparkles,t: "Analyze",  d: "Evaluate thousands of alternatives across airlines, fares and connections instantly." },
    { i: Zap,     t: "Recover",  d: "Automatically rebook flights, hotels and ground transport — end to end." },
    { i: Bell,    t: "Notify",   d: "Keep travelers calmly informed with a single, human message." },
  ];
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionTitle>Four quiet steps.<br /><span className="text-secondary">One uninterrupted journey.</span></SectionTitle>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ i: Icon, t, d }, idx) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="group relative rounded-[22px] border border-border/80 bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
            >
              <div className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-secondary">Step {idx + 1}</div>
              <h3 className="mt-1 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-secondary">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------- JOURNEY TIMELINE --------------------- */
function Timeline() {
  const nodes = [
    { t: "Flight Booked",      d: "Passenger AI-248 · HYD → JFK",  icon: Ticket },
    { t: "Monitoring",         d: "Watching 12 signals in real time", icon: Radar },
    { t: "Delay Detected",     d: "Weather cell over ATL", icon: CloudLightning, tone: "warning" as const },
    { t: "Weather Analysis",   d: "ETA impact: 4h 20m", icon: Sparkles },
    { t: "AI Finds New Flight",d: "DL 108 via LHR, +$0 to traveler", icon: Plane, tone: "primary" as const },
    { t: "Hotel Updated",      d: "Marriott JFK · check-in shifted", icon: Hotel },
    { t: "Taxi Scheduled",     d: "Arrivals gate B · 22:14", icon: Car },
    { t: "Traveler Notified",  d: "Single calm message sent", icon: Bell, tone: "success" as const },
  ];
  return (
    <section className="relative bg-white py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionEyebrow>Anatomy of a recovery</SectionEyebrow>
        <SectionTitle>A journey that rerouted itself.</SectionTitle>
        <div className="relative mt-16">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-1/2" />
          <ul className="space-y-8">
            {nodes.map((n, i) => {
              const Icon = n.icon;
              const tone =
                n.tone === "warning" ? "bg-warning/10 text-warning border-warning/30" :
                n.tone === "success" ? "bg-success/10 text-success border-success/30" :
                n.tone === "primary" ? "bg-primary/10 text-primary border-primary/30" :
                "bg-muted text-foreground border-border";
              return (
                <motion.li
                  key={n.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex items-start gap-5 md:grid md:grid-cols-2 md:gap-10 ${i % 2 === 0 ? "" : "md:[&>div:first-child]:order-2 md:[&>div:last-child]:text-right"}`}
                >
                  <div className={`${i % 2 === 0 ? "md:text-right" : ""} md:pr-6`}>
                    <div className="ml-14 md:ml-0">
                      <div className="text-xs font-semibold uppercase tracking-widest text-secondary">T + {String(i * 3).padStart(2, "0")}:00</div>
                      <h4 className="mt-1 text-lg font-semibold">{n.t}</h4>
                      <p className="mt-1 text-sm text-secondary">{n.d}</p>
                    </div>
                  </div>
                  <div className="absolute left-6 top-1 -translate-x-1/2 md:left-1/2">
                    <span className={`grid h-11 w-11 place-items-center rounded-full border-2 bg-background ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="hidden md:block" />
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------- DASHBOARD PREVIEW --------------------- */
function Dashboard() {
  const features = [
    { i: Plane,     t: "Autonomous Flight Recovery" },
    { i: Radar,     t: "Real-Time Flight Monitoring" },
    { i: Hotel,     t: "Hotel Management" },
    { i: Car,       t: "Airport Transfers" },
    { i: LineChart, t: "Travel Analytics" },
    { i: ShieldCheck, t: "Policy Compliance" },
    { i: Headphones,  t: "Emergency Assistance" },
  ];
  return (
    <section id="solutions" className="relative py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        {/* Left: fake dashboard */}
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[36px] bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent blur-2xl" />
          <div className="overflow-hidden rounded-[22px] border border-border bg-white shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="ml-3 text-[11px] text-secondary">app.reroute.ai / operations</span>
            </div>
            <div className="grid grid-cols-[220px_1fr]">
              <aside className="hidden border-r border-border bg-background/60 p-4 md:block">
                {["Overview", "Live Recoveries", "Travelers", "Airlines", "Analytics", "Policies"].map((s, i) => (
                  <div key={s} className={`mb-1 rounded-lg px-3 py-2 text-[13px] ${i === 1 ? "bg-primary/10 text-primary font-medium" : "text-secondary"}`}>{s}</div>
                ))}
              </aside>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-secondary">Active Recoveries</div>
                    <div className="text-2xl font-semibold">14 in progress</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success soft-pulse" /> All systems normal
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { t: "Rebooked today", v: "128", d: "+12%" },
                    { t: "Avg. resolution", v: "1m 42s", d: "-8s" },
                    { t: "Traveler NPS", v: "72", d: "+4" },
                  ].map((k) => (
                    <div key={k.t} className="rounded-xl border border-border p-3">
                      <div className="text-[11px] text-secondary">{k.t}</div>
                      <div className="mt-1 text-lg font-semibold">{k.v}</div>
                      <div className="text-[11px] text-success">{k.d}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-border">
                  {[
                    { c: "AI 248", r: "HYD → JFK", s: "Rerouted", tone: "success" },
                    { c: "BA 116", r: "LHR → JFK", s: "Monitoring", tone: "muted" },
                    { c: "EK 202", r: "DXB → JFK", s: "Weather risk", tone: "warning" },
                    { c: "AF 006", r: "CDG → JFK", s: "Rerouted", tone: "success" },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-[13px] ${i > 0 ? "border-t border-border" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-muted text-secondary"><Plane className="h-3.5 w-3.5" /></span>
                        <span className="font-medium">{r.c}</span>
                        <span className="text-secondary">{r.r}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        r.tone === "success" ? "bg-success/10 text-success"
                        : r.tone === "warning" ? "bg-warning/10 text-warning"
                        : "bg-muted text-secondary"
                      }`}>{r.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <SectionEyebrow>Operations Console</SectionEyebrow>
          <SectionTitle>Every recovery, in one calm view.</SectionTitle>
          <p className="mt-5 text-[16px] leading-relaxed text-secondary">
            Built for travel managers, mobility teams, and enterprises who need visibility without noise.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map(({ i: Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-[14px] transition hover:border-primary/40">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                {t}
              </li>
            ))}
          </ul>
          <a href="#cta" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:opacity-90">
            Explore Dashboard <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- STATS ------------------------- */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const dur = 1600;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(to * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.disconnect();
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
}
function Stats() {
  const stats = [
    { v: 500, s: "K+",  label: "Flights Monitored" },
    { v: 99.8, s: "%", label: "Recovery Success", dec: 1 },
    { v: 150, s: "+", label: "Airlines Supported" },
    { v: 40,  s: "+", label: "Countries" },
  ];
  return (
    <section className="relative bg-foreground py-24 text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-4xl font-semibold tracking-tight md:text-5xl">
              <Counter to={s.v} suffix={s.s} decimals={s.dec ?? 0} />
            </div>
            <div className="mt-2 text-sm text-background/60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- TESTIMONIALS ------------------------- */
const TESTIMONIALS = [
  { q: "Our storm cancellations used to derail entire itineraries. Now they're a footnote in the traveler's inbox.", n: "Amelia Whitfield", r: "Head of Global Mobility, Northwind", c: "United Kingdom" },
  { q: "It rebooked twelve executives in ninety seconds during the JFK ground stop. That's not software — that's an ally.", n: "Marcus Tan", r: "Director of Travel, Vantage Group", c: "Singapore" },
  { q: "The best product decision we made this year. Travelers stopped calling support because there was nothing to call about.", n: "Sofia Almeida", r: "COO, Meridian Consulting", c: "Portugal" },
];
function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="relative bg-white py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionEyebrow>Testimonials</SectionEyebrow>
        <SectionTitle>Quiet trust from loud industries.</SectionTitle>
        <div className="relative mt-14 h-64 md:h-56">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <blockquote className="text-[22px] font-medium leading-snug tracking-tight md:text-[26px]">
                &ldquo;{TESTIMONIALS[i].q}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                  {TESTIMONIALS[i].n.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{TESTIMONIALS[i].n}</div>
                  <div className="text-xs text-secondary">{TESTIMONIALS[i].r} · {TESTIMONIALS[i].c}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-foreground" : "w-1.5 bg-border"}`}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- FAQ ------------------------- */
function FAQ() {
  const items = [
    { q: "How does ReRoute AI detect a disruption?", a: "We ingest airline operations data, weather models, ATC advisories, and passenger context — usually flagging risk 20–90 minutes before an airline announces it." },
    { q: "What can it actually rebook?", a: "Flights on 150+ airlines, hotels via GDS partners, ground transfers, and boarding passes — all within policy and payment rails you already use." },
    { q: "Do travelers need to approve every change?", a: "You choose the autonomy level. Full autopilot for corporate policies, or one-tap approval on the traveler's phone." },
    { q: "Is it compliant with corporate policy?", a: "Policies are first-class. Every recovery is scored against fare class, carrier, budget and preferred vendor rules before it executes." },
    { q: "How is my data protected?", a: "SOC 2 Type II, ISO 27001, GDPR. PII is encrypted at rest and in transit; airline credentials are stored in a dedicated HSM." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionEyebrow>FAQ</SectionEyebrow>
          <SectionTitle>Answers, without turbulence.</SectionTitle>
          <p className="mt-4 text-secondary">Everything travel managers ask us in the first call.</p>
        </div>
        <div className="divide-y divide-border rounded-[22px] border border-border bg-card">
          {items.map((it, i) => (
            <div key={it.q} className="px-6">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="text-[15px] font-medium">{it.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-secondary">
                  <span className="block h-4 w-4 relative before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-8 text-[14px] leading-relaxed text-secondary">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- FINAL CTA ------------------------- */
function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-background to-accent/10" />
      <div className="absolute inset-0 -z-10 opacity-40" style={{
        backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(37,99,235,0.15), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(20,184,166,0.12), transparent 50%)"
      }} />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
        >
          Let AI handle travel disruptions <br className="hidden md:block" />
          before they become your problem.
        </motion.h2>
        <p className="mx-auto mt-5 max-w-xl text-secondary">
          Start free, or talk to us about enterprise deployments across your entire mobility programme.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5">
            Start Free <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-4 text-sm font-semibold text-foreground transition hover:bg-background">
            Book Demo
          </a>
        </div>
        <div className="mt-6 text-xs text-secondary">No credit card · Cancel anytime · SOC 2 Type II</div>
      </div>
    </section>
  );
}

/* ------------------------- FOOTER ------------------------- */
function Footer() {
  const cols = [
    { t: "Product",   l: ["Features", "Solutions", "Enterprise", "Pricing", "Changelog"] },
    { t: "Company",   l: ["About", "Careers", "Newsroom", "Contact"] },
    { t: "Resources", l: ["Docs", "API", "Status", "Support"] },
    { t: "Legal",     l: ["Privacy", "Terms", "Security", "DPA"] },
  ];
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="h-4 w-4 -rotate-45" />
            </span>
            <span className="text-[15px] font-semibold">ReRoute<span className="text-primary">.ai</span></span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-secondary">
            The autonomous travel concierge for people, teams and enterprises who can&rsquo;t afford to stop moving.
          </p>
          <div className="mt-6 flex items-center gap-3 text-secondary">
            {["LinkedIn", "GitHub", "Twitter"].map((s) => (
              <a key={s} href="#" className="rounded-full border border-border px-3 py-1 text-xs transition hover:text-foreground">{s}</a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.t}>
            <div className="text-xs font-semibold uppercase tracking-widest text-secondary">{c.t}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.l.map((x) => <li key={x}><a href="#" className="text-foreground/80 transition hover:text-foreground">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-secondary">
          <span>© {new Date().getFullYear()} ReRoute AI, Inc. All rights reserved.</span>
          <span className="inline-flex items-center gap-2"><Lock className="h-3 w-3" /> SOC 2 Type II · ISO 27001 · GDPR</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------- SHARED BITS ------------------------- */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-secondary">
      <span className="h-1 w-1 rounded-full bg-primary" /> {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
      {children}
    </h2>
  );
}

/* ------------------------- PAGE ------------------------- */
function Landing() {
  return (
    <div className="relative overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <How />
        <Timeline />
        <Dashboard />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
