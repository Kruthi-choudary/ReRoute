import { createFileRoute, Link } from "@tanstack/react-router";
import { useForceLightMode } from "@/lib/useTheme";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion, useScroll, useTransform, useMotionValue, useMotionValueEvent,
  AnimatePresence, useSpring, useMotionTemplate,
} from "framer-motion";
import {
  Plane, Radar, Sparkles, Bell, ShieldCheck, Hotel, Car, Ticket,
  ArrowRight, Play, Check, CloudLightning, ChevronDown,
  LineChart, Headphones, Lock, Zap, Menu, X, Wifi, QrCode,
} from "lucide-react";
import planeImg from "@/assets/plane-front.png";

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
  const links = [
    { label: "How it works", href: "#how" },
    { label: "Live demo",    href: "#solutions" },
    { label: "FAQ",          href: "#pricing" },
    { label: "Get started",  href: "#cta" },
  ];
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
            <a key={l.label} href={l.href} className="text-sm text-secondary transition hover:text-foreground">{l.label}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-medium text-secondary transition hover:text-foreground">Login</Link>
          <Link to="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white/95 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => <a key={l.label} href={l.href} className="text-sm">{l.label}</a>)}
              <Link to="/signup" className="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------- HERO ANIMATION ------------------------- */
/** Airplane travels a flight path. Route reroutes mid-flight. Loops every ~15s. */
/* ============================== HERO ============================== */

/**
 * Scroll-driven hero. The section is 500vh tall; a sticky inner viewport
 * pins to the screen while an SVG path animates a plane image along a
 * flight route that reroutes mid-journey.
 */

// Path space uses viewBox 1000 x 700, aligned to full-viewport SVG.
// Kept on the right half of the stage so it doesn't cross the headline.
const ORIGINAL_PATH =
  "M 380 640 C 500 600, 600 560, 680 500 S 900 380, 1080 300";
const REROUTE_PATH =
  "M 380 640 C 500 600, 600 560, 680 500 C 740 470, 780 400, 760 320 " +
  "C 740 220, 880 140, 1080 40";

const CITIES: { name: string; code: string; x: number; y: number }[] = [
  { name: "Hyderabad", code: "HYD", x: 380,  y: 640 },
  { name: "Dubai",     code: "DXB", x: 580,  y: 550 },
  { name: "London",    code: "LHR", x: 740,  y: 460 },
  { name: "New York",  code: "JFK", x: 1040, y: 50  },
];


const RECOVERY_ITEMS = [
  { icon: Plane,  label: "New Flight Booked" },
  { icon: Hotel,  label: "Hotel Updated" },
  { icon: Car,    label: "Airport Transfer Confirmed" },
  { icon: Ticket, label: "Boarding Pass Ready" },
];

const CHECKLIST = [
  "24/7 Flight Monitoring",
  "Automatic Rebooking",
  "Hotel Recovery",
  "Real-time Notifications",
];

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 80" className={className} style={style} aria-hidden>
      <path
        d="M20 60 C 10 60, 4 44, 22 40 C 22 24, 48 20, 56 34 C 66 22, 96 24, 100 42 C 118 34, 142 42, 142 56 C 166 52, 180 68, 168 76 L 24 76 C 12 76, 10 66, 20 60 Z"
        fill="white"
        opacity="0.85"
      />
    </svg>
  );
}

function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const origRef = useRef<SVGPathElement>(null);
  const rerRef = useRef<SVGPathElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5 });

  const planeX = useMotionValue(380);
  const planeY = useMotionValue(640);
  const planeRot = useMotionValue(0);
  const planeShake = useMotionValue(0);
  const [phase, setPhase] = useState(0);
  // phase 0 idle, 1 flying, 2 pins, 3 disruption, 4 rerouted, 5 destination

  useMotionValueEvent(p, "change", (v) => {
    const orig = origRef.current;
    const rer = rerRef.current;
    if (!orig || !rer) return;

    // Choose active path. Before 0.55 follow original; after 0.55 follow reroute.
    let path: SVGPathElement;
    let t: number;
    if (v < 0.55) {
      path = orig;
      // idle for 0..0.05, then move 0.05..0.55 -> t 0..0.55
      t = Math.max(0, (v - 0.05) / 1); // stays under 0.55
    } else {
      path = rer;
      // continue smoothly: at v=0.55 start at 0.55, at v=1 reach 1
      t = 0.55 + (v - 0.55) * (1 / 0.45);
    }
    t = Math.min(0.99, Math.max(0.001, t));

    const total = path.getTotalLength();
    const pt = path.getPointAtLength(total * t);
    const ahead = path.getPointAtLength(Math.min(total, total * t + 1.5));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

    planeX.set(pt.x);
    planeY.set(pt.y);
    // slight bank/tilt following tangent (image faces forward already)
    planeRot.set(angle * 0.35);

    // shake in disruption band
    if (v > 0.42 && v < 0.55) {
      planeShake.set(Math.sin(v * 240) * 4);
    } else {
      planeShake.set(0);
    }

    let ph = 0;
    if (v > 0.02) ph = 1;
    if (v > 0.22) ph = 2;
    if (v > 0.42) ph = 3;
    if (v > 0.58) ph = 4;
    if (v > 0.85) ph = 5;
    setPhase(ph);
  });

  // Contrail progress: dash offset for two paths
  const origDraw = useTransform(p, [0.05, 0.55], [0, 1]);
  const rerDraw = useTransform(p, [0.55, 0.9], [0, 1]);
  const origFade = useTransform(p, [0.42, 0.6], [1, 0.15]);

  const headlineLine2 = useMemo(() => {
    if (phase >= 5) return "Recovery.";
    if (phase >= 3) return "Disruption.";
    return "Interruptions.";
  }, [phase]);

  const cloudsY = useTransform(p, [0, 1], ["0%", "-30%"]);
  const cloudsY2 = useTransform(p, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={wrapperRef} className="relative w-full" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Sky gradient backdrop */}
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(180deg, #FFF6EA 0%, #FFEFD8 18%, #F5F0FF 55%, #F8FAFC 100%)",
          }}
        />
        {/* Warm sun glow */}
        <div
          className="absolute -z-10"
          style={{
            top: "-10%", right: "-10%", width: "60vw", height: "60vw",
            background:
              "radial-gradient(closest-side, rgba(255,190,120,0.55), rgba(255,190,120,0) 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* Parallax clouds */}
        <motion.div style={{ y: cloudsY }} className="absolute inset-0 -z-10">
          <Cloud className="absolute w-[26vw] drift-slower" style={{ top: "18%", left: "-4%" }} />
          <Cloud className="absolute w-[18vw] drift-slow" style={{ top: "62%", left: "22%", opacity: 0.7 }} />
          <Cloud className="absolute w-[22vw] drift-slower" style={{ top: "38%", right: "6%", opacity: 0.9 }} />
        </motion.div>
        <motion.div style={{ y: cloudsY2 }} className="absolute inset-0 -z-10">
          <Cloud className="absolute w-[14vw] drift-slow" style={{ top: "78%", left: "58%", opacity: 0.6 }} />
          <Cloud className="absolute w-[16vw] drift-slower" style={{ top: "8%", left: "48%", opacity: 0.5 }} />
        </motion.div>

        {/* Flight canvas SVG (full-hero) */}
        <svg
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="trail" x1="0" x2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="trailRed" x1="0" x2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Original contrail — turns red on disruption, fades on reroute */}
          <motion.path
            ref={origRef}
            d={ORIGINAL_PATH}
            fill="none"
            stroke={phase >= 3 && phase < 5 ? "url(#trailRed)" : "url(#trail)"}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={1}
            style={{
              pathLength: origDraw,
              opacity: origFade,
            }}
          />
          {/* Reroute path */}
          <motion.path
            ref={rerRef}
            d={REROUTE_PATH}
            fill="none"
            stroke="url(#trail)"
            strokeWidth={3.2}
            strokeLinecap="round"
            pathLength={1}
            style={{ pathLength: rerDraw }}
          />

          {/* City pins */}
          {CITIES.map((c, i) => (
            <motion.g
              key={c.code}
              initial={false}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                scale: phase >= 2 ? 1 : 0.6,
              }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            >
              <circle cx={c.x} cy={c.y} r={14} fill="white" fillOpacity="0.6" />
              <circle cx={c.x} cy={c.y} r={5} fill="#2563EB" />
              <text
                x={c.x + 12}
                y={c.y - 10}
                fontSize="11"
                fontWeight="600"
                fill="#0F172A"
                fontFamily="Inter, sans-serif"
              >
                {c.code}
              </text>
            </motion.g>
          ))}

          {/* Destination glow at NY */}
          <motion.g
            animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0.4 }}
            style={{ transformOrigin: "1000px 60px" }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <circle cx={1000} cy={60} r={22} fill="#14B8A6" fillOpacity="0.18" />
            <circle cx={1000} cy={60} r={9} fill="#14B8A6" />
          </motion.g>
        </svg>

        {/* Plane image — positioned by JS-driven motion values in SVG coords.
            We compute % of container from 1000x700 viewBox by using CSS calc
            through motion transforms. Simpler: place inside a full-bleed
            container that also uses viewBox math via percentage. */}
        <PlaneOnPath x={planeX} y={planeY} rot={planeRot} shake={planeShake} />

        {/* Left column: text */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pt-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-[11px] font-medium text-secondary backdrop-blur"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent soft-pulse" />
              Autonomous Travel Concierge · Live
            </motion.div>

            <h1 className="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              <span className="block">Travel Without</span>
              <span className="relative block h-[1.05em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={headlineLine2}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    {headlineLine2}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-secondary">
              Our autonomous AI continuously monitors your flights, predicts disruptions,
              automatically reroutes flights, updates hotels and reschedules airport
              transfers — keeping your journey moving without any manual action.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white hover:-translate-y-0.5"
              >
                <Play className="h-3.5 w-3.5" /> Watch Live Demo
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-secondary">
              {CHECKLIST.map((c) => (
                <li key={c} className="inline-flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disruption toast */}
        <AnimatePresence>
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute left-1/2 top-24 z-20 -translate-x-1/2 rounded-full bg-danger/95 px-4 py-2 text-xs font-medium text-white shadow-[var(--shadow-float)] backdrop-blur"
            >
              <span className="inline-flex items-center gap-2">
                <CloudLightning className="h-3.5 w-3.5" />
                Flight Disruption Detected — Storm over LHR
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recovery cards — right side, appear after reroute */}
        <div className="pointer-events-none absolute inset-y-0 right-4 z-10 hidden w-[320px] items-center md:flex">
          <div className="w-full space-y-2.5">
            {RECOVERY_ITEMS.map((it, i) => {
              const Icon = it.icon;
              const visible = phase >= 4;
              return (
                <motion.div
                  key={it.label}
                  initial={false}
                  animate={{
                    opacity: visible ? 1 : 0,
                    y: visible ? 0 : 20,
                  }}
                  transition={{ delay: visible ? 0.12 * i : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-[var(--shadow-float)] backdrop-blur-xl"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold">{it.label}</div>
                    <div className="flex items-center gap-1 text-[11px] text-secondary">
                      <Icon className="h-3 w-3" /> Auto-recovered · No action
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-secondary"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>

        {/* Progress rail */}
        <div className="absolute right-6 top-1/2 z-20 hidden h-40 w-[2px] -translate-y-1/2 rounded-full bg-border/70 lg:block">
          <motion.div
            className="w-full origin-top rounded-full bg-primary"
            style={{ scaleY: p, height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the plane image at the given SVG viewBox coordinates by placing it
 * inside a matching 1000x700 stage that scales to the viewport.
 */
function PlaneOnPath({
  x, y, rot, shake,
}: {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  rot: ReturnType<typeof useMotionValue<number>>;
  shake: ReturnType<typeof useMotionValue<number>>;
}) {
  // Convert SVG (0..1000, 0..700) coords to CSS % of container.
  // SVG uses xMidYMid slice, matching how we draw the paths; using percentages
  // approximates well for wide viewports.
  const left = useTransform(x, (v) => `${(v / 1000) * 100}%`);
  const top = useTransform(y, (v) => `${(v / 700) * 100}%`);
  const rotate = useTransform([rot, shake] as const, ([r, s]: number[]) => r + s * 0.4);
  const xShake = useTransform(shake, (s) => s);

  return (
    <motion.div
      className="pointer-events-none absolute z-[5]"
      style={{ left, top, x: "-50%", y: "-58%" }}
    >
      <motion.div style={{ rotate, x: xShake }} className="will-change-transform bob">
        <img
          src={planeImg}
          alt=""
          width={1600}
          height={1200}
          className="w-[30vw] max-w-[460px] min-w-[240px] select-none drop-shadow-[0_30px_40px_rgba(15,23,42,0.25)]"
          draggable={false}
        />
      </motion.div>
    </motion.div>
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
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="w-full text-center text-xs italic text-secondary/50 tracking-wide">"Built for the traveller who can't afford a missed connection, a stranded layover, or a silent airline — ReRoute AI moves before you have to."</p>
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="h-4 w-4 -rotate-45" />
            </span>
            <span className="text-[15px] font-semibold">ReRoute<span className="text-primary">.ai</span></span>
          </div>
          <span className="text-xs text-secondary">© {new Date().getFullYear()} ReRoute AI</span>
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
  useForceLightMode();
  return (
    <div className="relative">
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
