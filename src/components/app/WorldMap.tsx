import { motion } from "framer-motion";
import { useState } from "react";
import { AIRPORTS, ROUTES, STORMS, airport } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

/**
 * Stylised equirectangular world map with animated routes, storms and
 * airport congestion. Coordinates are normalised 0-100 in travel-data.
 */
export function WorldMap({
  className,
  interactive = true,
  compact = false,
}: {
  className?: string;
  interactive?: boolean;
  compact?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const arc = (fromCode: string, toCode: string) => {
    const a = airport(fromCode);
    const b = airport(toCode);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * 0.18 - 3;
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-3xl bg-[#f2f6fb]", className)}>
      <motion.svg
        viewBox="0 0 100 62"
        className="h-full w-full"
        animate={{ scale: zoom }}
        transition={{ type: "spring", stiffness: 160, damping: 24 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="wm-dots" width="0.9" height="0.9" patternUnits="userSpaceOnUse">
            <circle cx="0.28" cy="0.28" r="0.14" fill="rgba(15,23,42,0.13)" />
          </pattern>
          <linearGradient id="wm-active" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        {/* landmass silhouettes as dotted plates */}
        <g>
          {LANDMASSES.map((d, i) => (
            <path key={i} d={d} fill="url(#wm-dots)" stroke="rgba(15,23,42,0.07)" strokeWidth="0.12" />
          ))}
        </g>

        {/* storms */}
        {STORMS.map((s) => (
          <g key={s.id}>
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="rgba(220,38,38,0.08)"
              animate={{ cx: [s.x, s.x + 2.4, s.x], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={s.r * 0.45}
              fill="rgba(220,38,38,0.18)"
              animate={{ cx: [s.x, s.x + 2.4, s.x] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        ))}

        {/* routes */}
        {ROUTES.map((r, i) => {
          const active = r.status === "active";
          const rerouted = r.status === "rerouted";
          return (
            <g key={r.id}>
              <motion.path
                d={arc(r.from, r.to)}
                fill="none"
                stroke={active ? "url(#wm-active)" : rerouted ? "var(--accent)" : "rgba(15,23,42,0.18)"}
                strokeWidth={active ? 0.42 : 0.26}
                strokeDasharray={rerouted ? "1.2 1" : undefined}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.18, ease: "easeInOut" }}
              />
              {active && (
                <motion.circle r="0.55" fill="var(--primary)">
                  <animateMotion dur="7s" repeatCount="indefinite" path={arc(r.from, r.to)} />
                </motion.circle>
              )}
            </g>
          );
        })}

        {/* airports */}
        {AIRPORTS.map((a) => (
          <g
            key={a.code}
            onMouseEnter={() => interactive && setHover(a.code)}
            onMouseLeave={() => interactive && setHover(null)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          >
            <circle cx={a.x} cy={a.y} r={1.6} fill="transparent" />
            <circle
              cx={a.x}
              cy={a.y}
              r={0.42 + a.congestion * 0.4}
              fill={a.congestion > 0.6 ? "var(--warning)" : "var(--foreground)"}
              opacity={0.85}
            />
            {a.congestion > 0.6 && (
              <motion.circle
                cx={a.x}
                cy={a.y}
                r={1}
                fill="none"
                stroke="var(--warning)"
                strokeWidth="0.12"
                animate={{ r: [0.7, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 2.6, repeat: Infinity }}
              />
            )}
          </g>
        ))}
      </motion.svg>

      {/* hover card */}
      {hover && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-float backdrop-blur-xl">
          <p className="text-sm font-semibold">{airport(hover).code} · {airport(hover).city}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Congestion {Math.round(airport(hover).congestion * 100)}% · avg delay {airport(hover).delayMin} min
          </p>
        </div>
      )}

      {interactive && !compact && (
        <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/85 shadow-soft backdrop-blur-xl">
          <button
            className="h-9 w-9 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(2)))}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className="h-9 w-9 border-t border-border/60 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      )}
    </div>
  );
}

/** Rough continental plates — deliberately abstract, not geographic data. */
const LANDMASSES = [
  "M6 20 L22 16 L31 22 L28 33 L20 42 L14 40 L9 30 Z",
  "M24 46 L31 44 L36 54 L33 66 L28 70 L25 60 Z",
  "M44 18 L57 14 L62 22 L57 30 L49 33 L44 27 Z",
  "M45 34 L58 33 L63 44 L57 56 L50 57 L44 46 Z",
  "M62 18 L86 14 L94 26 L88 40 L74 44 L64 34 Z",
  "M82 62 L94 60 L96 71 L86 76 L80 70 Z",
];
