import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Panel, PageHeader, Eyebrow, Pill, Reveal } from "@/components/app/primitives";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Plane, Armchair, Award, CreditCard, ShieldAlert, Lock, Bell, Gauge, Moon, Plus, Check,
} from "lucide-react";

export const Route = createFileRoute("/_shell/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — ReRoute AI" },
      { name: "description", content: "Tune travel preferences, loyalty programs, payments, privacy and autonomous recovery rules for ReRoute AI." },
      { property: "og:title", content: "Settings — ReRoute AI" },
      { property: "og:description", content: "Configure how ReRoute AI recovers your trips automatically." },
    ],
  }),
});

type Section = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const SECTIONS: Section[] = [
  { id: "travel", label: "Travel preferences", icon: Plane },
  { id: "loyalty", label: "Loyalty programs", icon: Award },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "emergency", label: "Emergency", icon: ShieldAlert },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "rules", label: "Notification rules", icon: Bell },
  { id: "auto", label: "Auto approval", icon: Gauge },
  { id: "appearance", label: "Appearance", icon: Moon },
];

function Row({
  title,
  desc,
  control,
}: {
  title: string;
  desc?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {desc ? <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border/60 bg-muted p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            value === o ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === o && (
            <motion.span layoutId="seg-active" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
          )}
          <span className="relative z-10">{o}</span>
        </button>
      ))}
    </div>
  );
}

const LOYALTY = [
  { name: "United MileagePlus", tier: "Premier Gold", pct: 62, color: "var(--primary)" },
  { name: "Marriott Bonvoy", tier: "Titanium Elite", pct: 88, color: "var(--success)" },
  { name: "Hertz Gold Plus", tier: "President's Circle", pct: 35, color: "var(--warning)" },
];

const CARDS = [
  { name: "Amex Platinum", last4: "1004", hue: "from-[#1a1a1a] to-[#3a3a3a]" },
  { name: "Chase Sapphire", last4: "5521", hue: "from-[#1e3a5f] to-[#0f1b3d]" },
  { name: "Apple Cash", last4: "9042", hue: "from-[#8b8b8b] to-[#4a4a4a]" },
];

const RULES = [
  { id: 1, cond: "delay > 45 min", action: "auto-rebook next available", on: true },
  { id: 2, cond: "cancellation confirmed", action: "notify + hold hotel", on: true },
  { id: 3, cond: "gate change", action: "push notification only", on: true },
  { id: 4, cond: "fare drop > $50", action: "auto rebook if refundable", on: false },
];

function SettingsPage() {
  const [seat, setSeat] = useState("Window");
  const [cabin, setCabin] = useState("Business");
  const [threshold, setThreshold] = useState([650]);
  const [dark, setDark] = useState(false);
  const [rules, setRules] = useState(RULES);
  const [active, setActive] = useState("travel");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Control center"
        title="Settings"
        lede="Tune how ReRoute AI negotiates, rebooks, and protects your trips — while you stay in control of every threshold."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-28 space-y-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => refs.current[s.id]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="relative flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="settings-active-indicator"
                      className="absolute inset-0 rounded-2xl bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className={cn("relative z-10 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("relative z-10 font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div id="travel" ref={(el) => { refs.current.travel = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Travel preferences</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Seat, cabin & airline defaults</h2>
                <Row title="Preferred seat" desc="Used when rebooking automatically." control={<Segmented options={["Window", "Aisle", "Middle"]} value={seat} onChange={setSeat} />} />
                <Row title="Preferred cabin" desc="ReRoute will try to match or upgrade." control={<Segmented options={["Economy", "Premium", "Business"]} value={cabin} onChange={setCabin} />} />
                <Row title="Preferred airline alliance" desc="Star Alliance, oneworld, SkyTeam" control={<Pill tone="primary">Star Alliance</Pill>} />
                <Row title="Extra legroom priority" desc="Prefer exit row / bulkhead when available" control={<Switch defaultChecked />} />
                <Row title="Allow overnight layovers" desc="If it saves recovery time by 3+ hours" control={<Switch />} />
              </Panel>
            </Reveal>
          </div>

          <div id="loyalty" ref={(el) => { refs.current.loyalty = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Loyalty programs</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Linked memberships</h2>
                <div className="space-y-5">
                  {LOYALTY.map((l) => (
                    <div key={l.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{l.name}</span>
                        <span className="text-xs text-muted-foreground">{l.tier}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: l.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${l.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus className="h-3.5 w-3.5" /> Link another program
                </button>
              </Panel>
            </Reveal>
          </div>

          <div id="payment" ref={(el) => { refs.current.payment = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Payment</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Methods for rebooking & fees</h2>
                <div className="flex flex-wrap gap-4">
                  {CARDS.map((c) => (
                    <motion.div
                      key={c.last4}
                      whileHover={{ y: -4, rotate: -1 }}
                      className={cn("relative h-28 w-44 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-background shadow-soft", c.hue)}
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] opacity-70">ReRoute Pay</p>
                      <p className="mt-6 font-mono text-sm tracking-widest">•••• {c.last4}</p>
                      <p className="mt-1 text-xs opacity-80">{c.name}</p>
                    </motion.div>
                  ))}
                  <button className="flex h-28 w-44 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
                    <Plus className="h-5 w-5" />
                    <span className="text-xs font-medium">Add method</span>
                  </button>
                </div>
                <Row title="Default reimbursement account" desc="For EU261 & delay compensation" control={<Pill tone="muted">Chase Sapphire •• 5521</Pill>} />
              </Panel>
            </Reveal>
          </div>

          <div id="emergency" ref={(el) => { refs.current.emergency = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Emergency</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Contacts notified on major disruption</h2>
                {[
                  { name: "Elena Voss", rel: "Spouse", phone: "+1 (415) 555-0142" },
                  { name: "Marcus Chen", rel: "Assistant", phone: "+1 (628) 555-0193" },
                ].map((c) => (
                  <Row
                    key={c.name}
                    title={c.name}
                    desc={`${c.rel} · ${c.phone}`}
                    control={<Switch defaultChecked />}
                  />
                ))}
                <button className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus className="h-3.5 w-3.5" /> Add contact
                </button>
              </Panel>
            </Reveal>
          </div>

          <div id="privacy" ref={(el) => { refs.current.privacy = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Privacy</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Data sharing & visibility</h2>
                <Row title="Share itinerary with travel companions" control={<Switch defaultChecked />} />
                <Row title="Allow airline partners to see rebooking history" control={<Switch />} />
                <Row title="Anonymous benchmarking for delay predictions" desc="Helps improve model accuracy across the network" control={<Switch defaultChecked />} />
                <Row title="Location access for airport proximity alerts" control={<Switch defaultChecked />} />
              </Panel>
            </Reveal>
          </div>

          <div id="rules" ref={(el) => { refs.current.rules = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Notification rules</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Automation rule builder</h2>
                <div className="space-y-3">
                  {rules.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">If</span>
                        <Pill tone="warning">{r.cond}</Pill>
                        <span className="text-muted-foreground">→</span>
                        <Pill tone="primary">{r.action}</Pill>
                      </div>
                      <Switch
                        checked={r.on}
                        onCheckedChange={(v) => setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, on: v } : x)))}
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus className="h-3.5 w-3.5" /> New rule
                </button>
              </Panel>
            </Reveal>
          </div>

          <div id="auto" ref={(el) => { refs.current.auto = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Auto approval</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Spend threshold for autonomous action</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  ReRoute AI will rebook and pay automatically for options at or below this cost difference. Anything above requires your approval.
                </p>
                <div className="flex items-center gap-6">
                  <Slider value={threshold} onValueChange={setThreshold} max={2000} step={10} className="flex-1" />
                  <div className="w-24 shrink-0 rounded-2xl bg-primary/10 px-3 py-2 text-center">
                    <span className="text-lg font-semibold tabular-nums text-primary">${threshold[0]}</span>
                  </div>
                </div>
                <Row
                  title="Require confirmation above threshold"
                  desc="You'll get a push notification with 10 minutes to respond"
                  control={<Switch defaultChecked />}
                />
              </Panel>
            </Reveal>
          </div>

          <div id="appearance" ref={(el) => { refs.current.appearance = el; }}>
            <Reveal>
              <Panel>
                <Eyebrow className="mb-1">Appearance</Eyebrow>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Theme preview</h2>
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark mode</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Visual preview only — interface stays in light mode.</p>
                  </div>
                  <Switch checked={dark} onCheckedChange={setDark} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className={cn("rounded-2xl border border-border/60 p-4 transition-all", !dark && "ring-2 ring-primary")}>
                    <div className="mb-3 h-16 rounded-lg bg-gradient-to-br from-white to-slate-100 shadow-inner" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Light</span>
                      {!dark && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </div>
                  <div className={cn("rounded-2xl border border-border/60 p-4 transition-all", dark && "ring-2 ring-primary")}>
                    <div className="mb-3 h-16 rounded-lg bg-gradient-to-br from-[#1c1c22] to-[#0a0a0d] shadow-inner" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Dark</span>
                      {dark && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </div>
                </div>
              </Panel>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
