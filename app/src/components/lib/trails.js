import raw from "../trails.json";

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
    };
  });

export const CATEGORY_LABEL = {
  trek: "Trek",
  waterfall: "Waterfall",
  "hidden-gem": "Hidden gem",
};

export function mapsSearchLink(trail) {
  const q = `${trail.name}, ${trail.region}, Karnataka`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
