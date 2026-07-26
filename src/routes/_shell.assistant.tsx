import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, PageHeader, Eyebrow, Pill, Ring, Reveal } from "@/components/app/primitives";
import { Textarea } from "@/components/ui/textarea";
import { TRIPS } from "@/lib/travel-data";
import { cn } from "@/lib/utils";
import {
  Bot, Send, Paperclip, Mic, Sparkles, Plane, ArrowRight, FileText, BookOpen, Globe2,
} from "lucide-react";

export const Route = createFileRoute("/_shell/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "AI Assistant — ReRoute AI" },
      { name: "description", content: "Chat with ReRoute AI's autonomous recovery agent for live rebooking, hotel and compensation guidance." },
      { property: "og:title", content: "AI Assistant — ReRoute AI" },
      { property: "og:description", content: "Your always-on travel recovery co-pilot." },
    ],
  }),
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

const CANNED: string[] = [
  "I've checked your Zurich itinerary — UA 934 is holding a strong on-time forecast at 92%. Want me to lock in your seat preference for the return leg too?",
  "Based on current fare rules, rebooking onto LX 15 would cost $0 extra and save 45 minutes. I can execute this automatically if you approve.",
  "Your EU261 compensation claim for AF 456 is in progress — carriers typically respond within 5-7 business days. I'll notify you the moment it clears.",
  "Weather radar shows a storm cell approaching JFK in the next 6 hours. I've pre-computed 3 backup itineraries in case of cancellation.",
  "Done — I've held the Widder Hotel room until 2am and shifted your ZRH taxi pickup to 21:40 to match the new arrival time.",
];

const QUICK_PROMPTS = [
  "Will my Zurich flight be on time?",
  "Rebook me on the earliest alternative",
  "What's my compensation status?",
  "Add a hotel buffer night",
];

function TypingShimmer() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function Waveform() {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-primary"
          animate={{ height: [4, 16, 6, 20, 4] }}
          transition={{ duration: 0.9 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voice, setVoice] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = CANNED[replyIdx % CANNED.length];
      setReplyIdx((i) => i + 1);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    }, 1300 + Math.random() * 600);
  };

  const trip = TRIPS[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Always-on co-pilot"
        title="AI Assistant"
        lede="Ask anything about your itineraries — recovery status, compensation, weather risk, or preferences. ReRoute AI acts, not just answers."
        actions={<Pill tone="primary"><Sparkles className="h-3 w-3" /> Confidence-aware</Pill>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_34%]">
        <Panel padded={false} className="flex h-[640px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">ReRoute Agent</p>
              <p className="text-xs text-muted-foreground">Monitoring 4 active trips</p>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">How can I help with your trips?</p>
                  <p className="mt-1 text-xs text-muted-foreground">Try one of these to get started</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "user" ? (
                    <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-soft">
                      {m.text}
                    </div>
                  ) : (
                    <div className="flex max-w-[85%] items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{m.text}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <TypingShimmer />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/60 p-4">
            {voice && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-primary/5 px-4 py-2.5">
                <Waveform />
                <span className="text-xs font-medium text-primary">Listening…</span>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-3xl border border-border/60 bg-muted/40 p-2">
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask ReRoute AI…"
                rows={1}
                className="min-h-9 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <button
                onClick={() => setVoice((v) => !v)}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                  voice ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                onClick={() => send(input)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Reveal>
            <Panel>
              <Eyebrow className="mb-3">AI confidence</Eyebrow>
              <div className="flex items-center gap-5">
                <Ring value={92} size={92} sub="Confidence" />
                <div>
                  <p className="text-sm font-medium text-foreground">High certainty</p>
                  <p className="mt-1 text-xs text-muted-foreground">Based on 27 live data sources and historical recovery outcomes.</p>
                </div>
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.05}>
            <Panel>
              <Eyebrow className="mb-3">Flight summary</Eyebrow>
              <div className={cn("rounded-2xl bg-gradient-to-br p-4 text-background", trip.hue)}>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] opacity-80">{trip.flight}</span>
                  <Plane className="h-4 w-4 opacity-80" />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                  <span>{trip.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                  <span>{trip.to}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                  <span>{trip.depart} → {trip.arrive}</span>
                  <span>{trip.seat}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="warning">{trip.status}</Pill>
                <Pill tone="muted">{trip.carrier}</Pill>
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel>
              <Eyebrow className="mb-3">Suggested actions</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {["Confirm rebooking", "Extend hotel hold", "Notify companion", "File EU261 claim"].map((a) => (
                  <button
                    key={a}
                    onClick={() => send(a)}
                    className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.15}>
            <Panel>
              <Eyebrow className="mb-3">Sources & context</Eyebrow>
              <div className="space-y-3 text-sm">
                {[
                  { icon: FileText, label: "Fare rules · UA 934", meta: "Verified 2m ago" },
                  { icon: Globe2, label: "NOAA storm radar · JFK", meta: "Live feed" },
                  { icon: BookOpen, label: "EU261 policy database", meta: "Updated Jul 2026" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <s.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
