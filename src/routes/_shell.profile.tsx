import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Panel, PageHeader, Eyebrow, Pill, Ring, CountUp, Reveal } from "@/components/app/primitives";
import { cn } from "@/lib/utils";
import {
  Award, Leaf, Globe2, Plane, Star, Zap, Shield, Crown, MapPin, Gem,
} from "lucide-react";

export const Route = createFileRoute("/_shell/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — ReRoute AI" },
      { name: "description", content: "Your ReRoute AI travel passport — miles, carbon saved, countries visited, achievements and membership benefits." },
      { property: "og:title", content: "Profile — ReRoute AI" },
      { property: "og:description", content: "A passport-style view of your travel identity and lifetime stats." },
    ],
  }),
});

const BADGES = [
  { id: 1, label: "Storm Dodger", icon: Zap, shape: "rounded-full", tone: "warning" as const },
  { id: 2, label: "Century Flyer", icon: Plane, shape: "rounded-2xl rotate-3", tone: "primary" as const },
  { id: 3, label: "Carbon Conscious", icon: Leaf, shape: "rounded-full", tone: "success" as const },
  { id: 4, label: "Globe Trotter", icon: Globe2, shape: "rounded-2xl -rotate-3", tone: "primary" as const },
  { id: 5, label: "Elite Status", icon: Crown, shape: "rounded-full", tone: "warning" as const },
  { id: 6, label: "5-Star Recovery", icon: Star, shape: "rounded-2xl rotate-2", tone: "success" as const },
  { id: 7, label: "Shielded", icon: Shield, shape: "rounded-full", tone: "muted" as const },
  { id: 8, label: "Rare Route", icon: Gem, shape: "rounded-2xl -rotate-2", tone: "primary" as const },
];

const STAMPS = [
  { code: "ZRH", date: "AUG 2026" },
  { code: "DXB", date: "AUG 2026" },
  { code: "HND", date: "SEP 2026" },
  { code: "SIN", date: "OCT 2026" },
  { code: "LHR", date: "JUN 2026" },
  { code: "GRU", date: "MAY 2026" },
];

const BENEFITS = [
  "Priority autonomous rebooking on all carriers",
  "Zero-fee cancellations within recovery windows",
  "Dedicated human escalation line",
  "Complimentary lounge access on rerouted itineraries",
  "Carbon offset applied automatically to every trip",
];

function toneColor(tone: "primary" | "success" | "warning" | "muted") {
  return tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : tone === "primary" ? "var(--primary)" : "var(--muted-foreground)";
}

function ProfilePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Travel identity"
        title="Profile"
        lede="Your ReRoute AI passport — a lifetime record of miles flown, disruptions recovered, and carbon saved."
      />

      {/* Passport spread */}
      <div className="overflow-hidden rounded-3xl border border-border/60 shadow-float">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left photo page */}
          <div className="relative border-b border-border/60 bg-card p-8 md:border-b-0 md:border-r">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">ReRoute AI · Travel Document</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Type / P &nbsp; Code / RRA</p>
              </div>
              <Pill tone="primary"><Crown className="h-3 w-3" /> Titanium</Pill>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-semibold tracking-tight text-primary shadow-inner">
                EV
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-semibold tracking-tight text-foreground">Elena Voss</p>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Member since 2019</p>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Nationality: United States</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <div>
                <p className="text-[9px] tracking-[0.2em]">Document No.</p>
                <p className="text-foreground">RR-2941-887</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em]">Expiry</p>
                <p className="text-foreground">12 / 2029</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em]">Home hub</p>
                <p className="text-foreground">SFO</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em]">Status</p>
                <p className="text-foreground">Active</p>
              </div>
            </div>

            {/* MRZ strip */}
            <div className="mt-8 space-y-1 rounded-xl bg-muted/50 p-3 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-muted-foreground">
              <p>P&lt;RRAVOSS&lt;&lt;ELENA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              <p>RR29418879USA9008122F2912083&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</p>
            </div>
          </div>

          {/* Right stats page */}
          <div className="relative bg-card p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Lifetime record</p>
            <div className="mt-5 flex items-center gap-6">
              <Ring value={81} size={110} sub="Travel score" />
              <div className="grid flex-1 grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp to={184200} />
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Miles flown</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp to={41} />
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Countries visited</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-[var(--success)]">
                    <CountUp to={2.4} decimals={1} suffix="t" />
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Carbon saved</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp to={57} />
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Disruptions recovered</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Passport stamps</p>
              <div className="flex flex-wrap gap-3">
                {STAMPS.map((s, i) => (
                  <motion.div
                    key={s.code}
                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: (i % 2 === 0 ? -6 : 6) }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, type: "spring", bounce: 0.4 }}
                    className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/40 text-center"
                  >
                    <MapPin className="h-3 w-3 text-primary/70" />
                    <span className="font-mono text-[10px] font-semibold text-primary/80">{s.code}</span>
                    <span className="font-mono text-[7px] text-muted-foreground">{s.date}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <Reveal>
        <Panel>
          <Eyebrow className="mb-4">Achievements</Eyebrow>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {BADGES.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", bounce: 0.45 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={cn("flex h-16 w-16 items-center justify-center border-2 shadow-soft", b.shape)}
                  style={{ borderColor: toneColor(b.tone), background: `color-mix(in oklab, ${toneColor(b.tone)} 10%, transparent)` }}
                >
                  <b.icon className="h-6 w-6" style={{ color: toneColor(b.tone) }} />
                </div>
                <span className="text-xs font-medium text-foreground">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </Panel>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <Panel>
            <Eyebrow className="mb-3 flex items-center gap-2"><Award className="h-3.5 w-3.5" /> Membership benefits</Eyebrow>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 border-b border-border/60 pb-3 text-sm text-foreground last:border-b-0 last:pb-0">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel className="bg-gradient-to-br from-[#0f1b3d] to-[#1e3a5f] text-background">
            <Eyebrow className="mb-4 text-background/70">Lifetime stats band</Eyebrow>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={312} suffix="h" /></p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-background/60">Time saved by AI</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={9820} prefix="$" /></p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-background/60">Compensation recovered</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={98} suffix="%" /></p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-background/60">On-time recovery rate</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={7} /></p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-background/60">Years as a member</p>
              </div>
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
