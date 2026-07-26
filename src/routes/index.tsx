import { createFileRoute } from "@tanstack/react-router";
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

/* ============================== HERO ============================== */
/**
 * A five-act cinematic hero. A 600vh outer wrapper drives a sticky 100vh stage.
 * Acts:
 *   0.00–0.10  Emergence     : clouds part, plane fades through the mist
 *   0.10–0.35  Flight         : plane climbs, contrail draws
 *   0.35–0.55  Storm          : lightning flash, path turns red, plane shudders
 *   0.55–0.85  Reroute        : new curved path, plane banks, recovery items land
 *   0.85–1.00  Signature      : "ReRoute AI" resolves
 */

const ORIGINAL_PATH =
  "M 260 660 C 420 620, 560 560, 660 480 S 900 340, 1100 240";
const REROUTE_PATH =
  "M 260 660 C 420 620, 560 560, 660 480 " +
  "C 720 440, 720 340, 660 260 " +
  "C 620 200, 780 130, 1100 60";

const CITIES: { name: string; code: string; x: number; y: number }[] = [
  { name: "Hyderabad", code: "HYD", x: 260,  y: 660 },
  { name: "Dubai",     code: "DXB", x: 620,  y: 500 },
  { name: "London",    code: "LHR", x: 720,  y: 400 },
  { name: "New York",  code: "JFK", x: 1100, y: 60  },
];

const RECOVERY_ITEMS = [
  { icon: Plane,  label: "Flight Rebooked",         detail: "DL 108 · via LHR" },
  { icon: Hotel,  label: "Hotel Updated",           detail: "Marriott JFK · late check-in" },
  { icon: Car,    label: "Airport Transfer Rearranged", detail: "Arrivals · Gate B · 22:14" },
  { icon: Ticket, label: "Boarding Pass Generated", detail: "Seat 3A · Business" },
];

const HERO_HEADLINES = [
  { key: "freely",   line1: "Travel",        line2: "Freely.",           tint: "primary" as const },
  { key: "storm",    line1: "Unexpected",    line2: "Happens.",          tint: "danger"  as const },
  { key: "fixed",    line1: "We Already",    line2: "Fixed It.",         tint: "accent"  as const },
  { key: "brand",    line1: "ReRoute AI.",   line2: "Autonomous.",       tint: "primary" as const },
];

/** Soft, layered cloud primitive with configurable feathering. */
function Puff({ className, style, opacity = 0.9 }: { className?: string; style?: React.CSSProperties; opacity?: number }) {
  return (
    <svg viewBox="0 0 400 160" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`pg-${opacity}`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity={opacity} />
          <stop offset="70%" stopColor="white" stopOpacity={opacity * 0.7} />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="90" rx="180" ry="55" fill={`url(#pg-${opacity})`} />
      <ellipse cx="130" cy="70" rx="80"  ry="40" fill={`url(#pg-${opacity})`} />
      <ellipse cx="270" cy="70" rx="90"  ry="42" fill={`url(#pg-${opacity})`} />
    </svg>
  );
}

/** Tiny drifting particles for atmospheric depth. */
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        dur: 6 + Math.random() * 8,
        delay: Math.random() * 6,
        o: 0.25 + Math.random() * 0.35,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 -z-[5]">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, opacity: d.o, filter: "blur(0.5px)" }}
          animate={{ y: [0, -18, 0], opacity: [d.o, d.o * 1.6, d.o] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const origRef = useRef<SVGPathElement>(null);
  const rerRef = useRef<SVGPathElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5 });

  // Cursor parallax (very subtle depth).
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const cloudsCX = useTransform(mx, [-1, 1], [12, -12]);
  const cloudsCY = useTransform(my, [-1, 1], [6, -6]);
  const sunCX = useTransform(mx, [-1, 1], [-24, 24]);
  const sunCY = useTransform(my, [-1, 1], [-12, 12]);
  const planeCX = useTransform(mx, [-1, 1], [-8, 8]);
  const planeCY = useTransform(my, [-1, 1], [-6, 6]);

  const planeX = useMotionValue(260);
  const planeY = useMotionValue(660);
  const planeRot = useMotionValue(0);
  const planeShake = useMotionValue(0);
  const [phase, setPhase] = useState(0);
  // 0 emergence · 1 flight · 2 storm approach · 3 storm hit · 4 reroute · 5 destination · 6 signature
  const [lightning, setLightning] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    const orig = origRef.current;
    const rer = rerRef.current;
    if (!orig || !rer) return;

    let path: SVGPathElement;
    let t: number;
    if (v < 0.55) {
      path = orig;
      t = Math.max(0, (v - 0.08) / 0.94);
    } else {
      path = rer;
      t = 0.55 + (v - 0.55) * (1 / 0.42);
    }
    t = Math.min(0.99, Math.max(0.001, t));

    const total = path.getTotalLength();
    const pt = path.getPointAtLength(total * t);
    const ahead = path.getPointAtLength(Math.min(total, total * t + 1.5));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

    planeX.set(pt.x);
    planeY.set(pt.y);
    planeRot.set(angle * 0.4);

    if (v > 0.4 && v < 0.56) {
      planeShake.set(Math.sin(v * 260) * 5);
    } else {
      planeShake.set(0);
    }

    let ph = 0;
    if (v > 0.10) ph = 1;
    if (v > 0.32) ph = 2;
    if (v > 0.40) ph = 3;
    if (v > 0.56) ph = 4;
    if (v > 0.82) ph = 5;
    if (v > 0.93) ph = 6;
    setPhase(ph);
  });

  // Lightning flash trigger when entering storm.
  useEffect(() => {
    if (phase === 3) {
      setLightning(1);
      const t1 = setTimeout(() => setLightning(0), 140);
      const t2 = setTimeout(() => setLightning(1), 380);
      const t3 = setTimeout(() => setLightning(0), 520);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [phase]);

  const origDraw = useTransform(p, [0.10, 0.55], [0, 1]);
  const rerDraw = useTransform(p, [0.56, 0.9], [0, 1]);
  const origFade = useTransform(p, [0.40, 0.60], [1, 0.12]);

  // Sky darkens during storm, brightens on reroute.
  const skyDark = useTransform(p, [0.32, 0.46, 0.58, 0.85], [0, 0.55, 0.2, 0]);
  const skyOverlay = useMotionTemplate`rgba(15, 23, 42, ${skyDark})`;

  // Which headline to show (chained to acts).
  const headline = useMemo(() => {
    if (phase >= 6) return HERO_HEADLINES[3];
    if (phase >= 4) return HERO_HEADLINES[2];
    if (phase >= 2) return HERO_HEADLINES[1];
    return HERO_HEADLINES[0];
  }, [phase]);

  // Reveal the plane on emergence.
  const planeReveal = useTransform(p, [0, 0.10], [0, 1]);
  const planeBlur = useTransform(p, [0, 0.10], [12, 0]);
  const planeFilter = useMotionTemplate`blur(${planeBlur}px)`;

  // Text act key so we know when to show "scroll" hint.
  const showScrollHint = phase < 1;

  return (
    <section ref={wrapperRef} className="relative w-full" style={{ height: "600vh" }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base sky */}
        <div
          className="absolute inset-0 -z-30"
          style={{
            background:
              "linear-gradient(180deg, #FFEFD9 0%, #FFE0BF 12%, #F7E9FF 40%, #E8F0FF 68%, #F8FAFC 100%)",
          }}
        />

        {/* Storm overlay — darkens sky during disruption */}
        <motion.div className="absolute inset-0 -z-20" style={{ backgroundColor: skyOverlay }} />

        {/* Lightning flash */}
        <AnimatePresence>
          {lightning === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="pointer-events-none absolute inset-0 -z-10 bg-white mix-blend-screen"
            />
          )}
        </AnimatePresence>

        {/* Warm sun glow — parallaxes with cursor */}
        <motion.div
          className="absolute -z-20"
          style={{
            top: "-14%", right: "-8%", width: "70vw", height: "70vw",
            x: sunCX, y: sunCY,
            background:
              "radial-gradient(closest-side, rgba(255,200,140,0.65), rgba(255,200,140,0) 68%)",
            filter: "blur(2px)",
          }}
        />
        {/* God rays */}
        <div
          className="absolute inset-0 -z-20 mix-blend-soft-light opacity-70"
          style={{
            background:
              "conic-gradient(from 210deg at 80% 0%, transparent 0deg, rgba(255,236,200,0.35) 20deg, transparent 40deg, rgba(255,236,200,0.25) 60deg, transparent 90deg)",
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 70%)",
          }}
        />

        <Particles />

        {/* Parallax cloud fields */}
        <motion.div style={{ x: cloudsCX, y: cloudsCY }} className="absolute inset-0 -z-10">
          <Puff className="absolute w-[38vw] drift-slower" style={{ top: "10%", left: "-6%" }} />
          <Puff className="absolute w-[26vw] drift-slow"   style={{ top: "62%", left: "18%" }} opacity={0.75} />
          <Puff className="absolute w-[30vw] drift-slower" style={{ top: "34%", right: "-4%" }} opacity={0.85} />
          <Puff className="absolute w-[22vw] drift-slow"   style={{ top: "78%", right: "18%" }} opacity={0.6} />
        </motion.div>
        <motion.div
          style={{ x: useTransform(mx, [-1, 1], [24, -24]), y: useTransform(my, [-1, 1], [12, -12]) }}
          className="absolute inset-0 -z-[8]"
        >
          <Puff className="absolute w-[46vw] drift-slow"   style={{ top: "-6%", left: "22%" }} opacity={0.55} />
          <Puff className="absolute w-[32vw] drift-slower" style={{ top: "82%", left: "-10%" }} opacity={0.5} />
        </motion.div>

        {/* Flight canvas */}
        <svg
          viewBox="0 0 1200 720"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="trail" x1="0" x2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="trailRed" x1="0" x2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="trailNew" x1="0" x2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
            </linearGradient>
          </defs>

          <motion.path
            ref={origRef}
            d={ORIGINAL_PATH}
            fill="none"
            stroke={phase >= 3 && phase < 5 ? "url(#trailRed)" : "url(#trail)"}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={1}
            style={{ pathLength: origDraw, opacity: origFade }}
          />
          <motion.path
            ref={rerRef}
            d={REROUTE_PATH}
            fill="none"
            stroke="url(#trailNew)"
            strokeWidth={3.4}
            strokeLinecap="round"
            pathLength={1}
            style={{ pathLength: rerDraw }}
          />

          {/* Storm cell over the original destination — appears during storm */}
          <motion.g
            initial={false}
            animate={{ opacity: phase >= 2 && phase < 5 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <circle cx={980} cy={200} r={90} fill="#0F172A" fillOpacity="0.25" />
            <circle cx={1020} cy={180} r={70} fill="#0F172A" fillOpacity="0.35" />
            <circle cx={950} cy={240} r={60} fill="#0F172A" fillOpacity="0.28" />
          </motion.g>

          {/* City pins */}
          {CITIES.map((c, i) => (
            <motion.g
              key={c.code}
              initial={false}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                scale: phase >= 1 ? 1 : 0.6,
              }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            >
              <circle cx={c.x} cy={c.y} r={14} fill="white" fillOpacity="0.65" />
              <circle cx={c.x} cy={c.y} r={5} fill="#2563EB" />
              <text x={c.x + 12} y={c.y - 10} fontSize="11" fontWeight="600" fill="#0F172A" fontFamily="Inter, sans-serif">
                {c.code}
              </text>
            </motion.g>
          ))}

          {/* New destination glow */}
          <motion.g
            animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0.4 }}
            style={{ transformOrigin: "1100px 60px" }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <circle cx={1100} cy={60} r={26} fill="#14B8A6" fillOpacity="0.18" />
            <circle cx={1100} cy={60} r={10} fill="#14B8A6" />
          </motion.g>
        </svg>

        {/* Plane */}
        <motion.div style={{ x: planeCX, y: planeCY }} className="absolute inset-0">
          <PlaneOnPath
            x={planeX} y={planeY} rot={planeRot} shake={planeShake}
            reveal={planeReveal} filter={planeFilter}
          />
        </motion.div>

        {/* Dynamic Island — Live Recovery panel (top center, expands with items) */}
        <DynamicIsland active={phase >= 4} />

        {/* Storm toast */}
        <AnimatePresence>
          {phase >= 2 && phase < 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.94 }}
              className="absolute left-1/2 top-[92px] z-30 -translate-x-1/2 rounded-full bg-danger/95 px-4 py-2 text-xs font-medium text-white shadow-[var(--shadow-float)] backdrop-blur"
            >
              <span className="inline-flex items-center gap-2">
                <CloudLightning className="h-3.5 w-3.5" /> Severe Weather Detected · Rerouting…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic morphing headline (bottom-left cluster) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-14 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-secondary backdrop-blur-xl"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent soft-pulse" />
              Autonomous Travel Concierge · Live
            </motion.div>

            <div className="relative">
              <h1 className="text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-foreground">
                <div className="relative overflow-hidden pb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={headline.key + "-1"}
                      initial={{ y: "100%", opacity: 0, filter: "blur(12px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-100%", opacity: 0, filter: "blur(12px)" }}
                      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                      className="block"
                    >
                      {headline.line1}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="relative overflow-hidden pb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={headline.key + "-2"}
                      initial={{ y: "100%", opacity: 0, filter: "blur(14px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-100%", opacity: 0, filter: "blur(14px)" }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                      className={`block bg-clip-text text-transparent ${
                        headline.tint === "danger"
                          ? "bg-gradient-to-r from-[#DC2626] to-[#F97316]"
                          : headline.tint === "accent"
                          ? "bg-gradient-to-r from-[#2563EB] to-[#14B8A6]"
                          : "bg-gradient-to-r from-[#0F172A] via-[#2563EB] to-[#14B8A6]"
                      }`}
                    >
                      {headline.line2}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="pointer-events-auto max-w-md text-[15px] leading-relaxed text-secondary">
                A quiet autopilot for turbulent journeys. We detect disruptions before they happen and
                rearrange every leg — flights, hotels, transfers — before you know something went wrong.
              </p>
              <div className="pointer-events-auto flex flex-wrap items-center gap-3">
                <a
                  href="#cta"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5"
                >
                  Start Your Journey <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:bg-white"
                >
                  <Play className="h-3.5 w-3.5" /> Watch the Story
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 2, repeat: Infinity }, opacity: { duration: 0.6 } }}
              className="absolute bottom-6 right-6 z-30 text-secondary"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll to fly</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress rail */}
        <div className="absolute right-6 top-1/2 z-20 hidden h-40 w-[2px] -translate-y-1/2 rounded-full bg-border/70 lg:block">
          <motion.div className="w-full origin-top rounded-full bg-primary" style={{ scaleY: p, height: "100%" }} />
        </div>
      </div>
    </section>
  );
}

/** Apple-style Dynamic Island that expands from a pill into the recovery panel. */
function DynamicIsland({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (!active) { setVisibleCount(0); return; }
    setVisibleCount(1);
    const iv = setInterval(() => {
      setVisibleCount((c) => (c >= RECOVERY_ITEMS.length ? c : c + 1));
    }, 900);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      className="absolute right-6 top-6 z-30 md:right-10 md:top-10"
    >
      <motion.div
        layout
        className="overflow-hidden rounded-[28px] border border-white/40 bg-[rgba(15,23,42,0.86)] text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] backdrop-blur-2xl"
        animate={{ width: active ? 340 : 220 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 px-5 py-3">
          <span className="relative grid h-6 w-6 place-items-center">
            <span className="absolute inset-0 rounded-full bg-success/25 soft-pulse" />
            <span className="h-2 w-2 rounded-full bg-success" />
          </span>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/60">Live Recovery</div>
            <div className="text-[13px] font-semibold">{active ? "Rerouting active" : "Monitoring flight"}</div>
          </div>
          <Sparkles className="h-4 w-4 text-white/70" />
        </div>
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-white/10"
            >
              <ul className="space-y-0">
                {RECOVERY_ITEMS.map((it, i) => {
                  const Icon = it.icon;
                  const on = i < visibleCount;
                  return (
                    <motion.li
                      key={it.label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: on ? 1 : 0.25, x: 0 }}
                      transition={{ duration: 0.5, delay: on ? 0.05 : 0 }}
                      className="flex items-center gap-3 px-5 py-3 text-[13px]"
                    >
                      <span className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${on ? "bg-success/20 text-success" : "bg-white/10 text-white/40"}`}>
                        {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                      </span>
                      <div className="flex-1">
                        <div className={`font-medium ${on ? "text-white" : "text-white/50"}`}>{it.label}</div>
                        <div className="text-[11px] text-white/50">{it.detail}</div>
                      </div>
                      <Icon className="h-3.5 w-3.5 text-white/40" />
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function PlaneOnPath({
  x, y, rot, shake, reveal, filter,
}: {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  rot: ReturnType<typeof useMotionValue<number>>;
  shake: ReturnType<typeof useMotionValue<number>>;
  reveal: ReturnType<typeof useTransform<number, number>>;
  filter: ReturnType<typeof useMotionTemplate>;
}) {
  // viewBox is 1200x720
  const left = useTransform(x, (v) => `${(v / 1200) * 100}%`);
  const top = useTransform(y, (v) => `${(v / 720) * 100}%`);
  const rotate = useTransform([rot, shake] as const, ([r, s]: number[]) => r + s * 0.4);
  const xShake = useTransform(shake, (s) => s);

  return (
    <motion.div
      className="pointer-events-none absolute z-[5]"
      style={{ left, top, x: "-50%", y: "-58%", opacity: reveal, filter }}
    >
      <motion.div style={{ rotate, x: xShake }} className="will-change-transform bob">
        <img
          src={planeImg}
          alt=""
          width={1600}
          height={1200}
          className="w-[32vw] max-w-[520px] min-w-[260px] select-none drop-shadow-[0_40px_50px_rgba(15,23,42,0.28)]"
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

/* ------------------------- TESTIMONIALS (BOARDING PASSES) ------------------------- */
const TESTIMONIALS = [
  { q: "Our storm cancellations used to derail entire itineraries. Now they're a footnote in the traveler's inbox.", n: "Amelia Whitfield", r: "Head of Global Mobility, Northwind", from: "LHR", to: "JFK", flight: "RR 248", seat: "3A", gate: "B12", date: "26 JUL", cls: "Business", c: "United Kingdom" },
  { q: "It rebooked twelve executives in ninety seconds during the JFK ground stop. That's not software — that's an ally.", n: "Marcus Tan", r: "Director of Travel, Vantage Group", from: "SIN", to: "SFO", flight: "RR 617", seat: "1F", gate: "A04", date: "12 AUG", cls: "First", c: "Singapore" },
  { q: "The best decision we made this year. Travelers stopped calling support because there was nothing to call about.", n: "Sofia Almeida", r: "COO, Meridian Consulting", from: "LIS", to: "DXB", flight: "RR 092", seat: "5C", gate: "C21", date: "03 SEP", cls: "Business", c: "Portugal" },
];

function BoardingPass({ t, rotate = 0 }: { t: typeof TESTIMONIALS[number]; rotate?: number }) {
  return (
    <motion.figure
      whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ rotate }}
      className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-border/70 bg-white shadow-[var(--shadow-float)]"
    >
      {/* Perforation */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-4 -translate-y-1/2">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
        <div className="mx-4 border-t border-dashed border-border" />
      </div>

      <div className="grid grid-cols-[1fr_120px]">
        {/* Left — quote */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-primary text-primary-foreground"><Plane className="h-2.5 w-2.5 -rotate-45" /></span>
            ReRoute AI · Boarding Pass
          </div>
          <div className="mt-5 flex items-end gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-secondary">From</div>
              <div className="text-3xl font-semibold tracking-tight">{t.from}</div>
            </div>
            <div className="mb-1 flex-1 items-center px-2 text-secondary">
              <div className="flex items-center gap-1">
                <span className="h-px flex-1 bg-border" />
                <Plane className="h-3 w-3 -rotate-45" />
                <span className="h-px flex-1 bg-border" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-secondary">To</div>
              <div className="text-3xl font-semibold tracking-tight">{t.to}</div>
            </div>
          </div>

          <blockquote className="mt-6 text-[14px] leading-relaxed text-foreground">
            &ldquo;{t.q}&rdquo;
          </blockquote>

          <div className="mt-6 grid grid-cols-4 gap-3 border-t border-dashed border-border pt-4 text-[10px] uppercase tracking-widest text-secondary">
            <div><div>Flight</div><div className="mt-0.5 text-[13px] font-semibold text-foreground normal-case tracking-normal">{t.flight}</div></div>
            <div><div>Seat</div><div className="mt-0.5 text-[13px] font-semibold text-foreground normal-case tracking-normal">{t.seat}</div></div>
            <div><div>Gate</div><div className="mt-0.5 text-[13px] font-semibold text-foreground normal-case tracking-normal">{t.gate}</div></div>
            <div><div>Date</div><div className="mt-0.5 text-[13px] font-semibold text-foreground normal-case tracking-normal">{t.date}</div></div>
          </div>

          <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-border pt-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-semibold text-white">
              {t.n.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="text-[13px] font-semibold">{t.n}</div>
              <div className="text-[11px] text-secondary">{t.r} · {t.c}</div>
            </div>
          </figcaption>
        </div>

        {/* Right — stub */}
        <div className="relative flex flex-col items-center justify-between bg-primary/5 p-5 text-center">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-secondary">Class</div>
            <div className="mt-1 text-[13px] font-semibold text-primary">{t.cls}</div>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-md bg-white text-secondary shadow-sm">
            <QrCode className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <div className="text-[9px] uppercase tracking-widest text-secondary" style={{ writingMode: "vertical-rl" }}>
            {t.flight} · {t.seat}
          </div>
        </div>
      </div>
    </motion.figure>
  );
}

function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-background py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <SectionTitle>Quiet trust from loud industries.</SectionTitle>
        </div>
        <div className="relative mt-16 flex flex-wrap items-center justify-center gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: [-2.5, 1.5, -1][i] }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={i === 1 ? "md:-mt-6" : ""}
            >
              <BoardingPass t={t} rotate={[-2.5, 1.5, -1][i]} />
            </motion.div>
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const planeScale = useTransform(scrollYProgress, [0.2, 0.7], [0.6, 2.6]);
  const planeY = useTransform(scrollYProgress, [0.2, 0.7], [80, -120]);
  const planeOpacity = useTransform(scrollYProgress, [0.2, 0.55, 0.75], [0, 1, 0]);
  const trailDraw = useTransform(scrollYProgress, [0.2, 0.65], [0, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1]);

  return (
    <section id="cta" ref={ref} className="relative overflow-hidden py-40">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 -z-20 opacity-50" style={{
        backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(37,99,235,0.18), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(20,184,166,0.14), transparent 55%)"
      }} />

      {/* Contrail that morphs into wordmark */}
      <svg viewBox="0 0 1200 400" className="absolute inset-x-0 top-1/2 -z-10 h-[400px] w-full -translate-y-1/2" aria-hidden>
        <defs>
          <linearGradient id="cta-trail" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="60%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 60 320 C 260 300, 460 220, 620 200 S 980 160, 1140 90"
          fill="none"
          stroke="url(#cta-trail)"
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          style={{ pathLength: trailDraw }}
        />
      </svg>

      {/* Plane flies toward viewer */}
      <motion.div
        style={{ scale: planeScale, y: planeY, opacity: planeOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      >
        <img
          src={planeImg}
          alt=""
          className="w-[26vw] max-w-[420px] min-w-[220px] select-none drop-shadow-[0_40px_60px_rgba(15,23,42,0.25)]"
          draggable={false}
        />
      </motion.div>

      {/* Logo reveal — contrail resolves into wordmark */}
      <motion.div
        style={{ opacity: logoOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[38%] z-10 text-center"
      >
        <div className="inline-flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <span className="text-3xl font-semibold tracking-tight md:text-4xl">
            ReRoute<span className="text-primary">.ai</span>
          </span>
        </div>
      </motion.div>

      <div className="relative z-20 mx-auto max-w-3xl px-6 pt-56 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
        >
          Travel should <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">never stop.</span>
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl text-secondary">
          Start free, or talk to us about enterprise deployments across your entire mobility programme.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5">
            Start Your Journey <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
