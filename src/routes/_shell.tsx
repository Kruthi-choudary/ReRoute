import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "@/components/app/AppSidebar";
import { TopBar } from "@/components/app/TopBar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { NAV_ITEMS } from "@/lib/travel-data";
import { useAuth, rememberRedirect } from "@/lib/auth";

export const Route = createFileRoute("/_shell")({
  ssr: false,
  component: ShellLayout,
});

function ShellLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      rememberRedirect(pathname);
      navigate({ to: "/login", replace: true });
    }
  }, [loading, session, pathname, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" aria-label="Loading" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      <div className="md:pl-[76px]">
        <TopBar onOpenCommand={() => setCmdOpen(true)} />

        {/* mobile nav */}
        <div className="mx-auto max-w-[1400px] overflow-x-auto px-4 pt-4 md:hidden">
          <div className="flex gap-2">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="whitespace-nowrap rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground"
                activeProps={{ className: "border-primary/40 text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 md:px-8 md:pt-10"
          >
            {/* Required: child routes render here. */}
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
