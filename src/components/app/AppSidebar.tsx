import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3, BedDouble, Bell, Bot, History, IdCard, LayoutDashboard,
  Plane, Settings, Workflow, Radar,
} from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/travel-data";
import { LiveDot } from "@/components/app/primitives";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Plane, Workflow, BedDouble, Bell, BarChart3, Bot, History, IdCard, Settings,
};

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      initial={false}
      animate={{ width: open ? 244 : 76 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-y-0 left-0 z-50 hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-card/80 backdrop-blur-xl md:flex"
    >
      <div>
        <Link to="/" className="flex h-20 items-center gap-3 px-[26px]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radar className="h-3.5 w-3.5" />
          </span>
          <motion.span
            animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap text-sm font-semibold tracking-tight"
          >
            ReRoute AI
          </motion.span>
        </Link>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative flex h-11 items-center gap-3 rounded-2xl px-[14px]"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-2xl bg-primary/10"
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <motion.span
                  animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
                  transition={{ duration: 0.28 }}
                  className={cn(
                    "relative z-10 whitespace-nowrap text-[13px] font-medium",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl px-[10px] py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
            AK
          </div>
          <motion.div animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.28 }} className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-tight">Aya Kessler</p>
            <p className="truncate text-[11px] text-muted-foreground">Platinum · 84k mi</p>
          </motion.div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/50 px-[13px] py-2.5">
          <LiveDot />
          <motion.div animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.28 }} className="min-w-0">
            <p className="whitespace-nowrap text-[11px] font-medium leading-tight">Monitoring 4 journeys</p>
            <p className="whitespace-nowrap text-[10px] text-muted-foreground">Agent online · 42ms</p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
