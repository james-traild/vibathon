## Traild Live Invoices Heatmap

An interactive real-time world map that visualizes invoice transactions streaming across global financial centers.

### Tech Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Leaflet** / **React-Leaflet** for the interactive map
- **Tailwind CSS 4** for styling
- **Server-Sent Events (SSE)** for real-time data streaming

### Key Features

**Live Data Feed** — A mock SSE endpoint (src/app/api/feed/route.ts) continuously generates invoice data points weighted towards G10 nations and major financial hubs (New York, London, Tokyo, Frankfurt, Paris, etc.) with a sprinkling of other global cities. Each point carries a lat/lng and a currency value between $100–$1M.

**Animated Map Markers** — Points appear with a water-drop ripple animation that scales with transaction value. Ripple rings expand outward in waves, then the dot fades from its value-coded color to a soft green. Colors range from cyan (<$100K) through purple, yellow, and orange to red (>$750K).

**Statistics Pill** — A floating overlay at the top of the map shows the current date, user timezone, running currency total, and invoice count — all updating live.

**Dark Mode** — System-preference-aware with a manual toggle. The map tiles swap between OpenStreetMap (light) and CartoDB Dark Matter (dark).

**Speed Control** — A 1×/10× toggle in the header for UAT/demo purposes, which adjusts the SSE interval server-side.

**Performance** — A rolling 100-point buffer ensures the map stays responsive. Icons are cached per-point so existing markers don't re-animate when new ones arrive.

### Architecture
- src/hooks/usePointsFeed.ts — SSE client hook shared between map and stats
- src/components/WorldMap.tsx — Leaflet map with ripple markers and dark-tile swapping
- src/components/StatsPill.tsx — Live stats overlay
- src/components/ThemeProvider.tsx — Context-based light/dark theme with localStorage persistence
- src/app/globals.css — Ripple keyframe animations driven by CSS custom properties