import raw from "../trails.json";
import { BANGALORE, distanceKm, pinLink } from "./maptiler";

const seen = new Set();

export const TRAILS = raw
  .filter((t) => !seen.has(t.id) && seen.add(t.id))
  .map((t) => {
    const match = t.accessibility.match(/^([^(]+?)\s*(?:\((.*)\))?$/);
    return {
      ...t,
      level: match ? match[1].trim() : t.accessibility,
      access: match && match[2] ? match[2] : "",
      elevationM: parseInt(t.elevation.replace(/\D/g, ""), 10),
      fromCityKm: Math.round(distanceKm(BANGALORE, t)),
    };
  });

export const CATEGORY_LABEL = {
  trek: "Trek",
  waterfall: "Waterfall",
  "hidden-gem": "Hidden gem",
};

export const OFFICIAL_BOOKING_URL = "https://aranyavihaara.karnataka.gov.in/";

export function mapsSearchLink(trail) {
  return pinLink(trail);
}