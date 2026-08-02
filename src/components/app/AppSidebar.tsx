import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3, BedDouble, Bell, Bot, History, IdCard, LayoutDashboard,
  Plane, Settings, Workflow, Radar, LogOut,
} from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/travel-data";
import { LiveDot } from "@/components/app/primitives";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Plane, Workflow, BedDouble, Bell, BarChart3, Bot, History, IdCard, Settings,
};

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name ?? "Traveler";
  const userInitials = displayName.split(" ").map((w: string) => w[0] ?? "").join("").slice(0, 2).toUpperCase();

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
        <Link
          to="/profile"
          className="mb-3 flex items-center gap-3 rounded-2xl px-[10px] py-2 transition-colors hover:bg-muted/50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
            {userInitials}
          </div>
          <motion.div animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.28 }} className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-tight">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">Protected traveler</p>
          </motion.div>
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/50 px-[13px] py-2.5">
          <LiveDot />
          <motion.div animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.28 }} className="min-w-0 flex-1">
            <p className="whitespace-nowrap text-[11px] font-medium leading-tight">Monitoring active</p>
            <p className="whitespace-nowrap text-[10px] text-muted-foreground">Agent online · all clear</p>
          </motion.div>
          <motion.button
            animate={{ opacity: open ? 1 : 0, width: open ? "auto" : "0px" }}
            transition={{ duration: 0.28 }}
            onClick={() => { signOut(); void navigate({ to: "/login", replace: true }); }}
            className="shrink-0 overflow-hidden rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
