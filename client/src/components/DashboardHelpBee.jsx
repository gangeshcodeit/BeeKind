import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "beekind_dashboard_help_bee_dismissed";

/**
 * Same flying motion as login (`.floating-bee` / `floatBee` in index.css).
 * Sits in the dashboard header next to the level pill; chat card opens above the bee.
 */
export default function DashboardHelpBee() {
  const [bubbleOpen, setBubbleOpen] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setBubbleOpen(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = useCallback(() => {
    setBubbleOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const reopen = useCallback(() => {
    setBubbleOpen(true);
  }, []);

  return (
    <div className="relative inline-flex shrink-0 flex-col items-end self-end">
      {bubbleOpen && (
        <div
          className="absolute bottom-full right-0 z-10 mb-2 w-max max-w-[min(17rem,calc(100vw-3rem))] rounded-2xl border-2 border-[#f6d57e]/50 bg-emerald-950/95 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
          role="dialog"
          aria-label="Help from Bee"
        >
          <p className="text-sm font-extrabold text-lime-100">Need any help? 🌿</p>
          <p className="mt-1 text-xs leading-snug text-emerald-100/90">
            Ask Bee anything about your scenes, tasks, or the forest—friendly hints, no pressure.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/bee"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#f7d060] to-[#e8a820] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#2a1f0f] shadow hover:brightness-105"
            >
              Chat with Bee
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border border-emerald-600/60 bg-emerald-900/50 px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-800/60"
            >
              Not now
            </button>
          </div>
          <div
            className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#f6d57e]/50 bg-emerald-950/95"
            aria-hidden
          />
        </div>
      )}

      <div className="relative z-20 flex items-end gap-2">
        {!bubbleOpen && (
          <button
            type="button"
            onClick={reopen}
            className="mb-1 rounded-full border border-[#f6d57e]/40 bg-emerald-950/90 px-2.5 py-1 text-[11px] font-bold text-[#fff5d1] shadow backdrop-blur-sm hover:bg-emerald-900/90"
          >
            Help?
          </button>
        )}
        <button
          type="button"
          onClick={() => setBubbleOpen((o) => !o)}
          className="floating-bee leading-none select-none text-[44px] drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)] transition hover:scale-105 sm:text-[52px]"
          style={{ animationDelay: "0.35s" }}
          aria-label={bubbleOpen ? "Hide help message" : "Show help message"}
        >
          🐝
        </button>
      </div>
    </div>
  );
}
