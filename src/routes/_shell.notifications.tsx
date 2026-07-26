import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Check, Clock, ExternalLink, Inbox } from "lucide-react";
import { Panel, PageHeader, Eyebrow, Reveal, Pill } from "@/components/app/primitives";
import { NOTIFICATIONS } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

type Kind = "alert" | "success" | "info" | "warning";

const FILTERS = [
  { id: "all", label: "All", match: () => true },
  { id: "disruptions", label: "Disruptions", match: (k: Kind) => k === "alert" || k === "warning" },
  { id: "recovery", label: "Recovery", match: (k: Kind) => k === "success" },
  { id: "documents", label: "Documents", match: (k: Kind) => k === "info" },
];

const KIND_COLOR: Record<Kind, string> = {
  alert: "var(--danger)",
  success: "var(--success)",
  info: "var(--primary)",
  warning: "var(--warning)",
};

const GROUP_ORDER = ["Today", "Yesterday", "Earlier"] as const;

const SPARK = [3, 5, 2, 6, 4, 8, 5, 7, 3, 6, 9, 4];

function Notifications() {
  const [filter, setFilter] = useState("all");
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [snoozed, setSnoozed] = useState<Record<string, boolean>>({});

  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, disruptions: 0, recovery: 0, documents: 0 };
    for (const n of NOTIFICATIONS) {
      if (read[n.id] || n.unread === false) continue;
      counts.all++;
      for (const f of FILTERS) if (f.id !== "all" && f.match(n.kind as Kind)) counts[f.id]++;
    }
    return counts;
  }, [read]);

  const activeFilter = FILTERS.find((f) => f.id === filter)!;

  const visible = NOTIFICATIONS.filter((n) => !snoozed[n.id] && activeFilter.match(n.kind as Kind));

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: visible.filter((n) => n.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        lede="Every disruption, recovery step and document update ReRoute AI has handled on your behalf, in one continuous stream."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* left rail */}
        <Panel className="h-fit lg:sticky lg:top-24" padded>
          <Eyebrow className="mb-4">Filters</Eyebrow>
          <div className="space-y-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                  filter === f.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <span>{f.label}</span>
                {unreadCounts[f.id] > 0 && (
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                      filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15 text-foreground",
                    )}
                  >
                    {unreadCounts[f.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-border/60 pt-5">
            <Eyebrow className="mb-3">Activity, 12 days</Eyebrow>
            <svg viewBox="0 0 120 36" className="h-9 w-full">
              <polyline
                points={SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 120},${36 - v * 3.4}`).join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {SPARK.map((v, i) => (
                <circle key={i} cx={(i / (SPARK.length - 1)) * 120} cy={36 - v * 3.4} r="1.4" fill="var(--primary)" />
              ))}
            </svg>
            <p className="mt-2 text-[11px] text-muted-foreground">Peaks track live disruption windows.</p>
          </div>
        </Panel>

        {/* main pane */}
        <Panel padded={false} hover={false} className="overflow-hidden">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground">Nothing here yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                No {activeFilter.label.toLowerCase()} notifications right now — ReRoute AI will surface them the moment something changes.
              </p>
            </div>
          ) : (
            grouped.map((g, gi) => (
              <div key={g.group}>
                <div className="sticky top-0 z-10 border-b border-border/60 bg-card/95 px-6 py-2.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {g.group}
                  </p>
                </div>
                <ul>
                  <AnimatePresence initial={false}>
                    {g.items.map((n, i) => {
                      const isRead = read[n.id] || !n.unread;
                      return (
                        <motion.li
                          key={n.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (gi * 3 + i) * 0.03 }}
                          className="group relative flex gap-4 border-b border-border/40 px-6 py-4 last:border-b-0 hover:bg-muted/40"
                        >
                          <div className="flex w-10 flex-col items-center pt-1">
                            <span className="text-[11px] tabular-nums text-muted-foreground">{n.time}</span>
                            <AnimatePresence>
                              {!isRead && (
                                <motion.span
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="mt-1.5 h-2 w-2 rounded-full"
                                  style={{ background: KIND_COLOR[n.kind as Kind] }}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm", isRead ? "font-medium text-foreground/80" : "font-semibold text-foreground")}>
                              {n.title}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => setRead((r) => ({ ...r, [n.id]: true }))}
                              title="Mark as read"
                              className="rounded-full border border-border/60 bg-card p-2 text-muted-foreground hover:text-primary"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setSnoozed((s) => ({ ...s, [n.id]: true }))}
                              title="Snooze"
                              className="rounded-full border border-border/60 bg-card p-2 text-muted-foreground hover:text-primary"
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                            <button
                              title="Open trip"
                              className="rounded-full border border-border/60 bg-card p-2 text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </div>
            ))
          )}
        </Panel>
      </div>

      <Reveal>
        <Panel className="flex flex-wrap items-center justify-between gap-4" padded>
          <div>
            <Eyebrow className="mb-1">Delivery</Eyebrow>
            <p className="text-sm text-muted-foreground">Push, email and wallet updates stay in sync across every device.</p>
          </div>
          <Pill tone="primary">All channels connected</Pill>
        </Panel>
      </Reveal>
    </div>
  );
}

export const Route = createFileRoute("/_shell/notifications")({
  component: Notifications,
  head: () => ({
    meta: [
      { title: "Notifications · ReRoute AI" },
      { name: "description", content: "Every disruption, recovery step and document update in one live inbox." },
      { property: "og:title", content: "Notifications · ReRoute AI" },
      { property: "og:description", content: "A dense, grouped inbox of autonomous travel-recovery activity." },
    ],
  }),
});
