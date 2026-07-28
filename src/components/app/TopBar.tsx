import { Link } from "@tanstack/react-router";
import { Bell, Command, Plane, Search } from "lucide-react";
import { LiveDot } from "@/components/app/primitives";
import { useAuth } from "@/lib/auth";
import { useTrips } from "@/lib/queries";

function initials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { user } = useAuth();
  const trips = useTrips();
  const nextTrip = trips[0];
  const userInitials = user?.name ? initials(user.name) : "?";

  return (
    <div className="pointer-events-none sticky top-0 z-40 px-4 pt-4 md:px-8 md:pt-6">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-[1400px] items-center gap-3 rounded-3xl border border-border/60 bg-card/70 px-3 shadow-soft backdrop-blur-xl md:px-4">
        <button
          onClick={onOpenCommand}
          className="group flex h-10 flex-1 items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3.5 text-left transition-colors hover:border-primary/40"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">Search flights, hotels, documents…</span>
          <span className="ml-auto hidden items-center gap-1 rounded-lg border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
            <Command className="h-3 w-3" />K
          </span>
        </button>

        {nextTrip && (
          <Link
            to="/trips"
            className="hidden items-center gap-2.5 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2 transition-colors hover:border-primary/40 lg:flex"
          >
            <Plane className="h-4 w-4 text-primary" />
            <div className="leading-tight">
              <p className="text-[11px] text-muted-foreground">Next trip</p>
              <p className="text-[12px] font-medium">{nextTrip.from} → {nextTrip.to} · {nextTrip.flight}</p>
            </div>
            <LiveDot />
          </Link>
        )}

        <Link
          to="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 transition-colors hover:border-primary/40"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        <Link
          to="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-[11px] font-semibold text-background"
          aria-label="Profile"
        >
          {userInitials}
        </Link>
      </div>
    </div>
  );
}
