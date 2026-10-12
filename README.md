# ReRoute AI — Frontend

**Live:** https://re-route-sandy.vercel.app

This is the dashboard for ReRoute AI — a system that watches a trip, detects when a flight is disrupted, and recovers the whole itinerary (flight, hotel, transfer) on its own, under a spend policy the traveller controls. The backend (`reroute_ai`) does the actual work; this is where you watch it happen and approve or reject what it decides.

## What's actually here

- **Dashboard** — live map, trip protection status, the active recovery timeline if one's running
- **Recovery Center** — the core of the product. Shows the 5-stage pipeline (disruption detected → impact analysis → search alternatives → policy check → execute & notify) running live over a WebSocket, the AI's scored candidate flights side by side, its plain-language reasoning for the pick, and an Approve/Reject flow when the cost needs sign-off
- **Trips** — the traveller's itineraries as boarding-pass-style cards
- **Hotels** — reservations, including ones the system auto-adjusted after a delay
- **Notifications** — the trail of what the system told the traveller and when
- **Settings** — the spend-policy controls (auto-approve threshold, preferred cabin) that directly drive what the backend's policy engine decides

Dashboard, Recovery Center, Trips, Hotels, and Notifications are all backed by real API calls and a real WebSocket connection — if an account has zero trips, it genuinely shows zero trips rather than filling in something fake to look populated. (History and Profile are decorative magazine-style pages — a travel timeline and loyalty badges — not wired to real data; they're there for visual polish, not part of the functional demo.)

## Try it live

1. Go to https://re-route-sandy.vercel.app and sign up with any email
2. Open **Recovery Center** → click **Simulate disruption**
3. This seeds a real trip server-side and injects a 165-minute delay into the real backend pipeline — watch it run: impact analysis → alternatives scored → policy check → **Awaiting approval** (the AI's pick costs more than your default auto-approve limit, so it waits for you)
4. Click **Approve** — it actually rebooks the flight, notifies the hotel, reschedules the transfer if needed, and marks the trip recovered
5. Click **Reset demo** (top-right once a run completes) to run it again

First load can take ~50s if the backend's been idle — it's on a free tier that spins down when unused, not a bug.

## Stack

- TanStack Start + React 19 + Vite, server-rendered
- Tailwind CSS v4, Radix UI primitives, Framer Motion for the live pipeline animations
- TanStack Query for data fetching + cache invalidation driven by WebSocket events (approve a recovery and every dependent screen updates without a refresh)

## Setup

```bash
npm install
npm run dev   # http://localhost:8080 (or 8081 if in use)
```

Requires the backend running at the URL set in `.env` (copy from `.env.example`). Start the backend first — see [`reroute_ai`](https://github.com/Kruthi-choudary/reroute-ai)'s README for the full architecture writeup.
