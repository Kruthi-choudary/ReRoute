import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { NAV_ITEMS, TRIPS } from "@/lib/travel-data";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a page, trip or action…" />
      <CommandList>
        <CommandEmpty>Nothing matched.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((n) => (
            <CommandItem key={n.to} value={n.label} onSelect={() => go(n.to)}>
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Trips">
          {TRIPS.map((t) => (
            <CommandItem key={t.id} value={`${t.city} ${t.flight}`} onSelect={() => go(`/trips/${t.id}`)}>
              {t.city} · {t.flight}
              <span className="ml-auto text-xs text-muted-foreground">{t.date}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
