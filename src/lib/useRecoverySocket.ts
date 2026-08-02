import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const WS_BASE = BASE.replace(/^https/, "wss").replace(/^http/, "ws");
const TOKEN_KEY = "reroute_token";

const RECOVERY_EVENTS = new Set([
  "RECOVERY_STARTED",
  "IMPACT_ANALYZED",
  "SEARCHING_ALTERNATIVES",
  "ALTERNATIVES_SCORED",
  "POLICY_CHECK",
  "AUTO_EXECUTING",
  "AWAITING_APPROVAL",
  "ESCALATED",
  "ACTION_STARTED",
  "ACTION_COMPLETED",
  "TRIP_RECOVERED",
]);

export function useRecoverySocket(tripId: string | null | undefined) {
  const qc = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    if (!tripId) return;
    activeRef.current = true;

    function connect() {
      if (!activeRef.current) return;

      const token = localStorage.getItem(TOKEN_KEY) ?? "";
      const ws = new WebSocket(`${WS_BASE}/ws/${tripId}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        let payload: { event: string; [k: string]: unknown };
        try {
          payload = JSON.parse(e.data as string);
        } catch {
          return;
        }

        const { event } = payload;

        if (RECOVERY_EVENTS.has(event)) {
          void qc.invalidateQueries({ queryKey: ["recovery"] });
        }

        if (event === "TRIP_STATUS" || event === "TRIP_RECOVERED") {
          void qc.invalidateQueries({ queryKey: ["trips"] });
        }

        if (event === "TRIP_RESET") {
          void qc.invalidateQueries({ queryKey: ["recovery"] });
          void qc.invalidateQueries({ queryKey: ["trips"] });
          void qc.invalidateQueries({ queryKey: ["hotel-reservations"] });
        }

        if (event === "ACTION_COMPLETED" && (payload as { type?: string }).type === "MODIFY_HOTEL") {
          void qc.invalidateQueries({ queryKey: ["hotel-reservations"] });
        }

        if (event === "TRIP_RECOVERED") {
          void qc.invalidateQueries({ queryKey: ["hotel-reservations"] });
        }

        if (event === "AWAITING_APPROVAL") {
          toast.info("Recovery plan ready — your approval is needed.", {
            duration: 10_000,
            action: { label: "Review", onClick: () => window.location.assign("/recovery") },
          });
        }

        if (event === "TRIP_RECOVERED") {
          void qc.invalidateQueries({ queryKey: ["notifications"] });
          toast.success("Trip recovered successfully.");
        }

        if (event === "ESCALATED") {
          toast.warning("Recovery needs your attention.", {
            duration: 10_000,
            action: { label: "Review", onClick: () => window.location.assign("/recovery") },
          });
        }
      };

      ws.onclose = () => {
        if (activeRef.current) {
          reconnectRef.current = setTimeout(connect, 3_000);
        }
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      activeRef.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [tripId, qc]);
}
