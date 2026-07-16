# Trailhead

A standalone React app for finding nearby treks on a map and generating a
QR-backed group safety card before you go. No custom backend server —
just a static frontend that runs entirely in the browser.

## What it does

- **Find treks** — OpenStreetMap's Overpass API surfaces named hiking
  areas and real trail geometry near you, free and with no API key.
- **Create a safety card** — a form for the group leader, trekkers
  (name, age, phone, photo), and trek dates/location.
- **Get a QR code** — each safety card gets a unique link and a QR code
  that opens it. Scan it to see the full group + trek details.

This is deliberately **not** framed as a legal trekking permit — in a lot
of regions (reserve forests, restricted areas) an official permit still
has to come from the local forest department or administration. Treat
this as something you leave with family, a guide, or a homestay, not a
substitute for that.

## Setup

```bash
npm install
npm run dev
```

No API keys or environment variables required. The app uses:
- **Leaflet + OpenStreetMap** for the map (works well in India and globally)
- **Overpass API** for hiking areas and trail data

## Deploying

`npm run build` outputs a static `dist/` folder — deploy it anywhere
(Netlify, Vercel, GitHub Pages, Cloudflare Pages). The app uses
`HashRouter` (URLs look like `/#/permit/abc123`) specifically so it needs
**no server-side rewrite rules** — it'll work on GitHub Pages or any
plain static host out of the box.

## Project structure

```
src/
  lib/
    overpass.js        — OpenStreetMap trail and hiking area fetcher
    permitStore.js     — localStorage data layer
  components/
    TrekMap.jsx         — Leaflet map + hiking markers + trail overlays
    TrekkerRow.jsx       — one trekker's form fields + photo picker
    QRCode.jsx           — renders + downloads the QR
  pages/
    HomePage.jsx         — map + nearby treks list
    NewPermitPage.jsx     — the safety-card form
    PermitViewPage.jsx    — what the QR code opens
```
