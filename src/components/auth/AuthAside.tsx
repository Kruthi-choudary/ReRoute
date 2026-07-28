import { motion } from "framer-motion";

const DEFAULT_BADGES = [
  "Secure Google Authentication",
  "End-to-End Encrypted",
  "Trusted by Global Travelers",
];

export interface AuthAsideProps {
  title?: string;
  subtitle?: string;
  badges?: string[];
}

/** Rough continental plates — abstract, not geographic data. */
const LANDMASSES = [
  "M6 20 L22 16 L31 22 L28 33 L20 42 L14 40 L9 30 Z",
  "M24 46 L31 44 L36 54 L33 66 L28 70 L25 60 Z",
  "M44 18 L57 14 L62 22 L57 30 L49 33 L44 27 Z",
  "M45 34 L58 33 L63 44 L57 56 L50 57 L44 46 Z",
  "M62 18 L86 14 L94 26 L88 40 L74 44 L64 34 Z",
  "M82 62 L94 60 L96 71 L86 76 L80 70 Z",
];

const FLIGHT_PATH = "M14 44 Q 40 8 62 26 T 92 22";
const PINS = [
  { x: 14, y: 44 },
  { x: 62, y: 26 },
  { x: 92, y: 22 },
];

function Cloud({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <motion.g
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: [x - 3, x + 3, x - 3], opacity: 0.9 }}
      transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <g transform={`translate(0 ${y}) scale(${s})`} fill="rgba(255,255,255,0.85)">
        <ellipse cx="6" cy="4" rx="6" ry="3" />
        <ellipse cx="11" cy="3" rx="4.5" ry="3.2" />
        <ellipse cx="15" cy="4.4" rx="5" ry="2.6" />
      </g>
    </motion.g>
  );
}

/**
 * Premium travel-inspired left panel: drifting clouds, dotted world map,
 * an animated flight path with a plane, pulsing destination pins and
 * floating boarding-pass / passport / luggage vignettes.
 */
export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#eaf1ff_0%,#f6f9ff_45%,#eef6ff_100%)] lg:flex lg:w-[55%]">
      {/* map + sky layer */}
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="auth-dots" width="0.9" height="0.9" patternUnits="userSpaceOnUse">
            <circle cx="0.28" cy="0.28" r="0.13" fill="rgba(15,23,42,0.12)" />
          </pattern>
          <linearGradient id="auth-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        <g transform="translate(0 6)">
          {LANDMASSES.map((d, i) => (
            <path key={i} d={d} fill="url(#auth-dots)" stroke="rgba(15,23,42,0.06)" strokeWidth="0.12" />
          ))}
        </g>

        {/* curved flight path */}
        <motion.path
          d={FLIGHT_PATH}
          fill="none"
          stroke="url(#auth-route)"
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeDasharray="1.6 1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
        />

        {/* airport pins */}
        {PINS.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={0.8}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="0.14"
              initial={{ r: 0.8, opacity: 0.5 }}
              animate={{ r: [0.8, 2.2], opacity: [0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
            />
            <circle cx={p.x} cy={p.y} r={0.62} fill="var(--primary)" />
            <circle cx={p.x} cy={p.y} r={0.24} fill="#fff" />
          </g>
        ))}

        {/* plane travelling the path */}
        <g>
          <path d="M0 0 l2.2 0.9 -2.2 0.9 0.55 -0.9 z" fill="var(--foreground)" opacity="0.85">
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={FLIGHT_PATH} />
          </path>
        </g>

        <Cloud x={10} y={10} s={0.5} delay={0} />
        <Cloud x={70} y={54} s={0.7} delay={3} />
        <Cloud x={38} y={68} s={0.45} delay={6} />
      </svg>

      {/* floating travel vignettes */}
      <FloatingCards />

      {/* centre content */}
      <div className="relative z-10 flex w-full flex-col justify-center px-14 py-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] soft-pulse" />
            ReRoute AI · Autonomous travel recovery
          </span>

          <h1 className="mt-7 max-w-[13ch] text-5xl font-semibold leading-[1.05] tracking-tight text-foreground xl:text-6xl">
            Your Journey Starts Here.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Sign in once. We'll monitor every flight, detect disruptions, and
            recover your journey automatically.
          </p>

          <ul className="mt-10 flex max-w-md flex-wrap gap-2.5">
            {BADGES.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/85 px-3.5 py-2 text-[13px] font-medium text-foreground shadow-soft backdrop-blur"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden>
                  <path
                    d="M3 8.5 L6.4 12 L13 4.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </aside>
  );
}

function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* boarding pass */}
      <motion.div
        className="absolute right-10 top-14 w-64 rounded-[22px] border border-border/70 bg-card/95 p-4 shadow-float backdrop-blur"
        initial={{ opacity: 0, y: 20, rotate: -3 }}
        animate={{ opacity: 1, y: [0, -10, 0], rotate: -3 }}
        transition={{ opacity: { duration: 0.8 }, y: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          <span>Boarding pass</span>
          <span className="text-[var(--success)]">Recovered</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold leading-none">JFK</p>
            <p className="mt-1 text-[11px] text-muted-foreground">10:45</p>
          </div>
          <svg viewBox="0 0 40 12" className="h-3 w-16 text-primary" aria-hidden>
            <path d="M0 6 H30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M30 2 l8 4 -8 4 2-4z" fill="currentColor" />
          </svg>
          <div className="text-right">
            <p className="text-2xl font-semibold leading-none">LHR</p>
            <p className="mt-1 text-[11px] text-muted-foreground">22:10</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-border pt-3">
          <div className="grid grid-cols-6 gap-[2px]">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="h-4 w-[2px] rounded-sm bg-foreground/70" style={{ opacity: i % 3 ? 0.8 : 0.35 }} />
            ))}
          </div>
          <p className="ml-auto text-[11px] text-muted-foreground">Seat 4A</p>
        </div>
      </motion.div>

      {/* passport */}
      <motion.div
        className="absolute bottom-24 right-24 w-40 rounded-[20px] border border-border/70 bg-[#1e3a8a] p-4 text-white shadow-float"
        initial={{ opacity: 0, rotate: 6 }}
        animate={{ opacity: 1, rotate: 6, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 0.2 }, y: { duration: 11, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2 py-2">
          <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-90" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.4 9 H20.6 M3.4 15 H20.6" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">Passport</p>
        </div>
      </motion.div>

      {/* luggage */}
      <motion.div
        className="absolute bottom-16 left-16 flex w-36 items-center gap-3 rounded-[20px] border border-border/70 bg-card/95 p-3.5 shadow-float backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 0.35 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" aria-hidden>
          <path d="M9 5 V3 h6 v2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="4" y="5" width="16" height="14" rx="3" fill="currentColor" opacity="0.12" />
          <rect x="4" y="5" width="16" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9.5 8.5 V15.5 M14.5 8.5 V15.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-xs font-semibold">Bags tracked</p>
          <p className="text-[11px] text-muted-foreground">2 checked</p>
        </div>
      </motion.div>
    </div>
  );
}
