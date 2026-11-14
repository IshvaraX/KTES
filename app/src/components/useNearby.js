import { useCallback, useEffect, useRef, useState } from "react";
import { NEAR_MAX_KM, createScanner, findPlacesNear, nearestStation } from "./lib/nearby";

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(Object.assign(new Error("unsupported"), { code: "unsupported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  });
}

export default function useNearby() {
  const [phase, setPhase] = useState("idle");
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [stations, setStations] = useState({});
  const run = useRef(0);
  const scanner = useRef(null);
  const queue = useRef([]);
  const looked = useRef(new Set());
  const working = useRef(false);

  const pump = useCallback(async () => {
    if (working.current) return;
    working.current = true;
    while (queue.current.length) {
      const id = run.current;
      const p = queue.current.shift();
      if (looked.current.has(p.key)) continue;
      looked.current.add(p.key);
      let station = null;
      try {
        station = await nearestStation(scanner.current, p);
      } catch (err) {
        console.error(err);
      }
      if (run.current !== id) continue;
      setStations((prev) => ({ ...prev, [p.key]: station }));
    }
    working.current = false;
  }, []);

  const lookupStations = useCallback(
    (list) => {
      if (!scanner.current) return;
      queue.current = list.filter((p) => !looked.current.has(p.key));
      pump();
    },
    [pump]
  );

  const start = useCallback(
    async (radiusKm) => {
      const id = ++run.current;
      const alive = () => run.current === id;
      queue.current = [];
      looked.current = new Set();
      setPhase("asking");
      setPlaces([]);
      setStations({});
      let here;
      try {
        here = await getPosition();
      } catch (err) {
        if (alive()) setPhase(err.code === 1 ? "denied" : err.code === "unsupported" ? "unsupported" : "unavailable");
        return;
      }
      if (!alive()) return;
      setUser(here);
      setPhase("searching");
      try {
        scanner.current ??= await createScanner();
        const found = await findPlacesNear(scanner.current, here, NEAR_MAX_KM);
        if (!alive()) return;
        setPlaces(found);
        setPhase(found.length ? "results" : "empty");
        queue.current = found.filter((p) => p.km <= radiusKm);
        pump();
      } catch (err) {
        console.error(err);
        if (alive()) setPhase("failed");
      }
    },
    [pump]
  );

  useEffect(
    () => () => {
      run.current++;
      scanner.current?.destroy();
      scanner.current = null;
    },
    []
  );

  return { phase, user, places, stations, start, lookupStations };
}
