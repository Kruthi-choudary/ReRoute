import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Panel, PageHeader, Eyebrow, CountUp, Reveal, Pill } from "@/components/app/primitives";
import { WorldMap } from "@/components/app/WorldMap";
import { AIRPORTS } from "@/lib/travel-data";

const TREND = [
  { m: "Feb", recovered: 62 },
  { m: "Mar", recovered: 71 },
  { m: "Apr", recovered: 68 },
  { m: "May", recovered: 79 },
  { m: "Jun", recovered: 85 },
  { m: "Jul", recovered: 92 },
];

const QUARTERS = [
  { q: "Q1", amount: 18400 },
  { q: "Q2", amount: 26200 },
  { q: "Q3", amount: 31900 },
  { q: "Q4", amount: 24100 },
];

const FUNNEL = [
  { label: "Disruption detected", value: 1240 },
  { label: "Alternatives modeled", value: 1108 },
  { label: "Auto-rebooked", value: 964 },
  { label: "Fully recovered", value: 892 },
];

const COUNTRIES = [
  { name: "United States", pct: 34 },
  { name: "United Kingdom", pct: 21 },
  { name: "Japan", pct: 16 },
  { name: "Switzerland", pct: 12 },
  { name: "Singapore", pct: 9 },
  { name: "UAE", pct: 8 },
];

const DONUT = [
  { name: "Domestic", value: 38, color: "var(--primary)" },
  { name: "Long-haul", value: 41, color: "var(--accent)" },
  { name: "Regional", value: 21, color: "var(--success)" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function heat(d: number, h: number) {
  const base = Math.sin((h / 24) * Math.PI * 2 + d) * 0.5 + 0.5;
  const rush = h >= 16 && h <= 20 ? 0.3 : 0;
  const weekend = d >= 5 ? -0.15 : 0;
  return Math.min(1, Math.max(0, base * 0.7 + rush + weekend));
}

function KpiBlock({ value, prefix, suffix, label, decimals, spark }: { value: number; prefix?: string; suffix?: string; label: string; decimals?: number; spark: number[] }) {
  return (
    <div className="flex-1">
      <Eyebrow className="mb-2">{label}</Eyebrow>
      <CountUp
        to={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        className="block text-[13vw] font-semibold leading-[0.9] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
      />
      <svg viewBox="0 0 100 24" className="mt-4 h-6 w-full max-w-[220px]">
        <polyline
          points={spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${24 - v * 2.1}`).join(" ")}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function Analytics() {
  const [hoverCell, setHoverCell] = useState<{ d: number; h: number } | null>(null);
  const maxFunnel = FUNNEL[0].value;

  const grid = useMemo(() => DAYS.map((_, d) => Array.from({ length: 24 }, (_, h) => heat(d, h))), []);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Command deck"
        title="Analytics"
        lede="A cinematic view into how autonomously ReRoute AI is protecting time, money and itineraries at global scale."
      />

      {/* massive KPIs */}
      <Reveal>
        <Panel className="flex flex-col gap-10 md:flex-row md:items-end" padded>
          <KpiBlock value={482300} prefix="$" label="Money saved, lifetime" spark={[4, 6, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12]} />
          <KpiBlock value={9840} suffix="h" label="Hours recovered" spark={[3, 5, 4, 6, 5, 7, 8, 7, 9, 8, 10, 9]} />
          <KpiBlock value={2116} label="Disruptions handled" spark={[6, 5, 7, 6, 8, 7, 9, 8, 9, 10, 9, 11]} />
        </Panel>
      </Reveal>

      {/* bento */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <Reveal className="lg:col-span-4" delay={0.05}>
          <Panel className="h-full" padded>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Eyebrow className="mb-1">Recovery trend</Eyebrow>
                <p className="text-lg font-semibold text-foreground">Recovery rate, last 6 months</p>
              </div>
              <Pill tone="success">+11.4%</Pill>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }}
                  />
                  <Area type="monotone" dataKey="recovered" stroke="var(--primary)" strokeWidth={2.5} fill="url(#trendFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.1}>
          <Panel className="h-full" padded>
            <Eyebrow className="mb-1">Savings by quarter</Eyebrow>
            <p className="mb-4 text-lg font-semibold text-foreground">Compensation recovered</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={QUARTERS}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="q" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Bar dataKey="amount" fill="var(--accent)" radius={[8, 8, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.1}>
          <Panel className="h-full" padded>
            <Eyebrow className="mb-1">Recovery funnel</Eyebrow>
            <p className="mb-6 text-lg font-semibold text-foreground">From disruption to resolution</p>
            <div className="space-y-2">
              {FUNNEL.map((f, i) => {
                const widthPct = 30 + (f.value / maxFunnel) * 70;
                return (
                  <div key={f.label} className="flex items-center gap-3">
                    <svg width="100%" viewBox="0 0 100 22" className="h-6 flex-1">
                      <motion.polygon
                        initial={{ opacity: 0, scaleX: 0.5 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.12 }}
                        style={{ transformOrigin: "50% 50%" }}
                        points={`${50 - widthPct / 2},2 ${50 + widthPct / 2},2 ${50 + widthPct / 2 - 5},20 ${50 - widthPct / 2 + 5},20`}
                        fill={`color-mix(in oklab, var(--primary) ${100 - i * 15}%, var(--accent))`}
                      />
                    </svg>
                    <span className="w-40 shrink-0 text-right text-xs text-muted-foreground">{f.label}</span>
                    <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">{f.value}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.15}>
          <Panel className="h-full" padded>
            <Eyebrow className="mb-1">Delay prediction</Eyebrow>
            <p className="mb-4 text-lg font-semibold text-foreground">Risk heatmap, week pattern</p>
            <div className="grid grid-cols-24 gap-[2px]" style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}>
              {grid.map((row, d) =>
                row.map((v, h) => (
                  <div
                    key={`${d}-${h}`}
                    onMouseEnter={() => setHoverCell({ d, h })}
                    onMouseLeave={() => setHoverCell(null)}
                    className="aspect-square rounded-[2px]"
                    style={{ background: `color-mix(in oklab, var(--danger) ${Math.round(v * 90)}%, var(--muted))` }}
                  />
                )),
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{DAYS[0]}–{DAYS[6]} × 24h</span>
              <span>
                {hoverCell
                  ? `${DAYS[hoverCell.d]} ${hoverCell.h}:00 · risk ${Math.round(grid[hoverCell.d][hoverCell.h] * 100)}%`
                  : "Hover a cell for detail"}
              </span>
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.2}>
          <Panel className="h-full" padded>
            <Eyebrow className="mb-1">Country distribution</Eyebrow>
            <p className="mb-4 text-lg font-semibold text-foreground">Where trips originate</p>
            <div className="space-y-3">
              {COUNTRIES.map((c, i) => (
                <div key={c.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-muted-foreground">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.25}>
          <Panel className="flex h-full flex-col items-center justify-center" padded>
            <Eyebrow className="mb-1 self-start">Flight distribution</Eyebrow>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DONUT} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3}>
                    {DONUT.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-[11px] text-muted-foreground">
              {DONUT.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-6" delay={0.3}>
          <Panel padded={false} className="overflow-hidden">
            <div className="h-[380px]">
              <WorldMap compact />
            </div>
            <div className="border-t border-border/60 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Live network across {AIRPORTS.length} monitored hubs — congestion and reroute activity update continuously as ReRoute AI rebalances the network.
              </p>
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_shell/analytics")({
  component: Analytics,
  head: () => ({
    meta: [
      { title: "Analytics · ReRoute AI" },
      { name: "description", content: "Cinematic enterprise analytics on savings, recovery speed and network risk." },
      { property: "og:title", content: "Analytics · ReRoute AI" },
      { property: "og:description", content: "Money saved, hours recovered and disruption trends at a glance." },
    ],
  }),
});
