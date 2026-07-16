# Trailhead

A standalone React app for finding nearby treks on a map and generating a
QR-backed group safety card before you go. No custom backend server —
just a static frontend plus (optionally) a free Supabase project.

## What it does

- **Find treks** — Google Places (New) surfaces named hiking areas/parks
  near you; OpenStreetMap's Overpass API overlays real trail geometry on
  top, free and with no API key.
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
cp .env.example .env
```

Fill in `.env`:

1. **`VITE_GOOGLE_MAPS_API_KEY`** (required) — in Google Cloud Console,
   enable "Places API (New)" and "Maps JavaScript API", create a key, and
   restrict it to your site's HTTP referrer. As of March 2025 there's no
   flat $200/month credit anymore — Places (New) gets 5,000 free calls/month
   on the Pro tier, so keep an eye on usage if you expect real traffic.
2. **`VITE_SUPABASE_URL`** / **`VITE_SUPABASE_ANON_KEY`** (optional) —
   without these, the app runs in **local-only mode**: safety cards are
   saved in `localStorage`, including photos as base64. That's fine for
   solo use on one device, but a QR scanned on someone else's phone won't
   resolve. Add a free Supabase project (see `supabase/schema.sql` for the
   tables + storage bucket to create) to get real shareable links.

```bash
npm run dev
```

## Deploying

`npm run build` outputs a static `dist/` folder — deploy it anywhere
(Netlify, Vercel, GitHub Pages, Cloudflare Pages). The app uses
`HashRouter` (URLs look like `/#/permit/abc123`) specifically so it needs
**no server-side rewrite rules** — it'll work on GitHub Pages or any
plain static host out of the box. If you'd rather have clean URLs
(`/permit/abc123`) and you're deploying to Netlify/Vercel, swap
`HashRouter` for `BrowserRouter` in `src/main.jsx` and add that host's
SPA-fallback rewrite rule.

## Project structure

```
src/
  lib/
    googlePlaces.js   — Places API (New) searchNearby wrapper
    overpass.js        — OpenStreetMap trail geometry fetcher
    supabaseClient.js   — null if env vars aren't set
    permitStore.js      — Supabase-or-localStorage data layer
  components/
    TrekMap.jsx         — Google map + hiking markers + trail overlays
    TrekkerRow.jsx       — one trekker's form fields + photo picker
    QRCode.jsx           — renders + downloads the QR
  pages/
    HomePage.jsx         — map + nearby treks list
    NewPermitPage.jsx     — the safety-card form
    PermitViewPage.jsx    — what the QR code opens
```

## Extending it

- Swap `localStorage` for a real login so people can see their past
  safety cards across devices even without a link.
- Add an offline PDF export (the print stylesheet in `index.css` is a
  starting point — `window.print()` already works from the permit page).
- Cache Places/Overpass responses (e.g. in Supabase) if you expect
  enough traffic to worry about the free-tier call limits.
