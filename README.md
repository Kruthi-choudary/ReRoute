# ReRoute AI — Frontend

React 19 + TanStack Start (Vite) dashboard for the ReRoute AI travel disruption concierge. Talks to the FastAPI backend in the sibling [`reroute_ai`](https://github.com/Kruthi-choudary/reroute-ai) repo — see that repo's README for architecture and API details.

**Live:** https://re-route-sandy.vercel.app

## Try the demo

1. Sign up with any email (no verification required)
2. Go to **Recovery Center**
3. Click **Simulate disruption** — this seeds a real trip and injects a 165-minute delay into a real backend pipeline (nothing's mocked past this point)
4. Watch it run live over a WebSocket: impact analysis → alternative flights scored → policy check → **Awaiting approval**
5. Click **Approve** — it rebooks the flight, notifies the hotel, and marks the trip recovered
6. Click **Reset demo** (top-right once a run completes) to try it again

First load may take ~50s if the backend's been idle — it's on a free tier that spins down, not a bug.

## Stack

- TanStack Start + React 19 + Vite
- Tailwind CSS v4, Radix UI primitives, Framer Motion
- TanStack Query for data fetching, Zod for validation

## Setup

```bash
npm install
npm run dev   # http://localhost:8080 (or 8081 if in use)
```

Requires the backend running at the URL set in `.env` (copy from `.env.example`). Start the backend first — see `reroute_ai/README.md`.
