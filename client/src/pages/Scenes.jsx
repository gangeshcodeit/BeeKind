import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

export default function Scenes() {
  const { token } = useAuth();
  const [scene, setScene] = useState(null);
  const [progress, setProgress] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/scenes/current", { token });
        if (!cancelled) {
          setScene(data.scene || null);
          setProgress(data.progress || null);
          setDialogueIndex(0);
        }
      } catch (e) {
        if (!cancelled) setError(e.data?.error || e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const dialogueLines = useMemo(() => scene?.dialogue || [], [scene]);
  const currentLine = dialogueLines[dialogueIndex] || "";
  const hasNextLine = dialogueIndex < dialogueLines.length - 1;
  const taskOnly = scene?.id === "scene-10";

  return (
    <div className="scenes-page-root">
      <div className="scenes-page-bg-fixed" aria-hidden>
        <div className="scenes-page-bg-img" />
        <div className="scenes-page-bg-veil" />
      </div>

      <Link to="/bee" className="weather-nav-next shrink-0">
        Next →
      </Link>

      <div className="scenes-page-on-image page-transition">
        <Link to="/dashboard" className="weather-nav-home shrink-0">
          ← Home
        </Link>
        <div className="scenes-glass-stack">
      <div className="scenes-glass-card scenes-glass-card--hero">
        {error && <p className="rounded-2xl bg-rose-400/20 px-4 py-3 text-base text-rose-50">{error}</p>}
        {!scene && !error && <p className="scenes-loading-text">Loading current scene...</p>}
      {scene && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-fuchsia-300/50 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/35 to-amber-500/40 text-3xl font-black text-amber-50 shadow-[0_6px_0_rgba(0,0,0,0.15)]">
                {progress?.currentSceneNumber ?? "?"}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-violet-200/80">{scene.id}</p>
                <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-amber-50">
                  {scene.title}
                </h2>
              </div>
            </div>
            <p className="text-lg font-semibold text-sky-100">
              <span className="mr-2 inline-flex rounded-lg border border-cyan-400/35 bg-cyan-500/25 px-2 py-0.5 font-bold text-cyan-50">
                Theme
              </span>
              {scene.theme}
            </p>
            {!taskOnly && scene.purpose && (
              <p className="text-base leading-relaxed text-emerald-100/90">
                <span className="font-bold text-lime-100">Purpose: </span>
                {scene.purpose}
              </p>
            )}
            {!taskOnly && scene.learningMessage && (
              <p className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-violet-900/50 to-amber-900/40 px-4 py-3 text-base leading-relaxed text-amber-50">
                <span className="font-bold text-amber-200">Learning message: </span>
                {scene.learningMessage}
              </p>
            )}

            {!taskOnly && (
              <div className="dialogue-bubble">
                <p className="text-sm font-bold uppercase tracking-wide text-amber-200/90">Story dialogue</p>
                <p key={`${scene.id}-${dialogueIndex}`} className="dialogue-fade mt-3 font-display text-xl font-semibold leading-snug text-sky-50">
                  {currentLine || "No dialogue for this scene yet."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDialogueIndex((i) => Math.max(0, i - 1))}
                    disabled={dialogueIndex === 0}
                    className="hive-button disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialogueIndex((i) => (hasNextLine ? i + 1 : i))}
                    disabled={!hasNextLine}
                    className="hive-button disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-3xl border-2 border-dashed border-amber-300/50 bg-gradient-to-br from-rose-500/20 via-violet-600/15 to-cyan-600/20 p-5 shadow-inner">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-100">Your mission</p>
              <p className="mt-2 font-display text-xl font-semibold text-amber-50">{scene.task}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/tasks" className="hive-button">
                Upload task
              </Link>
            </div>
          </div>
      )}
      </div>
      </div>
      </div>
    </div>
  );
}
