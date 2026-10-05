# ReRoute AI — Frontend

React 19 + TanStack Start (Vite) dashboard for the ReRoute AI travel disruption concierge. Talks to the FastAPI backend in the sibling [`reroute_ai`](../reroute_ai) repo — see that repo's README for architecture, setup, and the demo flow.

> **Status:** local prototype, not deployed.

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
