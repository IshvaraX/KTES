import { useEffect, useState } from "react";
import { OFFICIAL_BOOKING_URL } from "./lib/trails";

const STORAGE_KEY = "ktes-notice-dismissed";

function wasDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    return;
  }
}

export default function NoticeBar() {
  const [open, setOpen] = useState(() => !wasDismissed());

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      remember();
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    remember();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside
      aria-label="About this site"
      className="notice-in fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-[20px] bg-pine px-5 py-4 text-[0.9375rem] leading-relaxed text-mist shadow-[0_18px_50px_-18px_rgba(23,51,23,0.6)] sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-center sm:gap-6 sm:px-6"
    >
      <p className="flex-1">
        KTES is an independent guide made by trekkers, not a government website. Trek plans made here aren't permits. Book
        official treks on{" "}
        <a href={OFFICIAL_BOOKING_URL} target="_blank" rel="noreferrer" className="font-semibold text-glow underline underline-offset-2">
          Aranya Vihaara
        </a>
        .
      </p>
      <button type="button" onClick={close} className="btn self-start bg-glow text-pine hover:bg-leaf sm:self-auto">
        Got it
      </button>
    </aside>
  );
}
