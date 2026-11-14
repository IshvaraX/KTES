import { forwardRef, useEffect, useId, useState } from "react";
import { TRAILS } from "./lib/trails";
import { hasMapKey, searchPlaces } from "./lib/maptiler";

function localMatches(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return TRAILS.filter((t) => t.name.toLowerCase().includes(needle) || t.region.toLowerCase().includes(needle))
    .slice(0, 4)
    .map((t) => ({ key: `ktes-${t.id}`, kind: "trail", trail: t, name: t.name, detail: `KTES trail, ${t.region}` }));
}

const TrekSearch = forwardRef(function TrekSearch({ value, onChange, onPick, ...inputProps }, ref) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [remote, setRemote] = useState([]);
  const [searching, setSearching] = useState(false);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    if (!typed || !hasMapKey || value.trim().length < 3) {
      setRemote([]);
      setSearching(false);
      return;
    }
    const ctrl = new AbortController();
    setSearching(true);
    const t = setTimeout(() => {
      searchPlaces(value.trim(), { signal: ctrl.signal })
        .then((places) =>
          setRemote(places.map((p) => ({ key: `mt-${p.id}`, kind: "place", place: p, name: p.name, detail: p.place })))
        )
        .catch((err) => err.name !== "AbortError" && setRemote([]))
        .finally(() => !ctrl.signal.aborted && setSearching(false));
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value, typed]);

  const local = typed ? localMatches(value) : [];
  const localNames = new Set(local.map((o) => o.name.toLowerCase()));
  const options = [...local, ...remote.filter((o) => !localNames.has(o.name.toLowerCase()))];
  const showList = open && value.trim().length > 0 && (options.length > 0 || searching || value.trim().length >= 3);

  function pick(option) {
    setTyped(false);
    setOpen(false);
    setActive(-1);
    onPick(option);
  }

  function onKeyDown(e) {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && active >= 0 && options[active]) {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        {...inputProps}
        ref={ref}
        className="field"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setTyped(true);
          setOpen(true);
          setActive(-1);
          onChange(e.target.value);
        }}
        onFocus={() => typed && setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-[14px] border border-shola/15 bg-paper py-1 shadow-[0_16px_40px_-16px_rgba(23,51,23,0.35)]"
        >
          {options.map((o, i) => (
            <li
              key={o.key}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3.5 py-2.5 ${i === active ? "bg-mist" : ""}`}
            >
              <span className={`block font-medium ${o.trail?.category === "waterfall" ? "font-serif italic" : ""}`}>{o.name}</span>
              <span className="block truncate text-sm text-granite">{o.detail}</span>
            </li>
          ))}
          {searching && <li className="px-3.5 py-2.5 text-sm text-granite">Searching places near Bangalore…</li>}
          {!searching && options.length === 0 && (
            <li className="px-3.5 py-2.5 text-sm text-granite">
              No matching places. Keep the name as typed, then drop a pin below.
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

export default TrekSearch;
