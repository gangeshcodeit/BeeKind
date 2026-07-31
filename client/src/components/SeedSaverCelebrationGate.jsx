import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

const SEED_STORAGE_KEY = "beekind_seed_saver_celebration_done";
const TREE_STORAGE_KEY = "beekind_tree_protector_celebration_done";
const EARTH_FINAL_STORAGE_KEY = "beekind_earth_guardian_complete_done";

const SEED_SCENES = ["scene-1", "scene-2", "scene-3"];
const TREE_SCENES = ["scene-4", "scene-5", "scene-6", "scene-7"];
const EARTH_SCENES = ["scene-8", "scene-9", "scene-10"];

function isSeedSaverTierComplete(completedSceneIds, progressLevel) {
  if (!Array.isArray(completedSceneIds) || progressLevel < 4) return false;
  return SEED_SCENES.every((id) => completedSceneIds.includes(id));
}

function isTreeProtectorTierComplete(completedSceneIds, progressLevel) {
  if (!Array.isArray(completedSceneIds) || progressLevel < 8) return false;
  return TREE_SCENES.every((id) => completedSceneIds.includes(id));
}

function isEarthGuardianTierComplete(completedSceneIds) {
  if (!Array.isArray(completedSceneIds)) return false;
  return EARTH_SCENES.every((id) => completedSceneIds.includes(id));
}

/**
 * Student tier celebrations: Seed Saver → Tree Protector → Earth Guardian (final art).
 * flowStep: seed | treeWelcome | treeMilestone | earthWelcome | earthMilestone | journeyComplete | null
 */
export default function SeedSaverCelebrationGate({ children }) {
  const { token, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [flowStep, setFlowStep] = useState(null);

  const finishSeedCelebration = useCallback(() => {
    try {
      localStorage.setItem(SEED_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setFlowStep(null);
  }, []);

  const finishTreeCelebration = useCallback(() => {
    try {
      localStorage.setItem(TREE_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setFlowStep(null);
  }, []);

  const finishEarthFinalCelebration = useCallback(() => {
    try {
      localStorage.setItem(EARTH_FINAL_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setFlowStep(null);
  }, []);

  useEffect(() => {
    if (!token || authLoading || !user || user.role !== "student") return;
    if (flowStep !== null) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/user/progress", { token });
        if (cancelled) return;
        const p = data?.progress;
        if (!p) return;

        let seedDone = false;
        try {
          seedDone = localStorage.getItem(SEED_STORAGE_KEY) === "1";
        } catch {
          seedDone = false;
        }
        if (!seedDone && isSeedSaverTierComplete(p.completedSceneIds, p.progressLevel)) {
          setFlowStep("seed");
          return;
        }

        let treeDone = false;
        try {
          treeDone = localStorage.getItem(TREE_STORAGE_KEY) === "1";
        } catch {
          treeDone = false;
        }
        if (!treeDone && isTreeProtectorTierComplete(p.completedSceneIds, p.progressLevel)) {
          setFlowStep("treeMilestone");
          return;
        }

        let earthFinalDone = false;
        try {
          earthFinalDone = localStorage.getItem(EARTH_FINAL_STORAGE_KEY) === "1";
        } catch {
          earthFinalDone = false;
        }
        if (!earthFinalDone && isEarthGuardianTierComplete(p.completedSceneIds)) {
          setFlowStep("earthMilestone");
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, authLoading, location.pathname, flowStep]);

  const nextButtonClass =
    "rounded-2xl border-2 border-[#3d2914] bg-gradient-to-b from-[#f7d060] to-[#e8a820] px-8 py-3 text-lg font-extrabold uppercase tracking-wide text-[#2a1f0f] shadow-[0_6px_0_#8b6914,0_4px_20px_rgba(0,0,0,0.45)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-[0_3px_0_#8b6914] sm:px-10 sm:py-4 sm:text-xl";

  /** Full-viewport overlays above app chrome (portaled to `document.body`). */
  const portalOverlay = (content, ariaLabel, outerClass = "bg-black") =>
    typeof document !== "undefined"
      ? createPortal(
          <div
            className={`fixed inset-0 z-[9999] flex min-h-[100dvh] w-screen flex-col ${outerClass}`}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            {content}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {children}
      {flowStep === "seed" &&
        portalOverlay(
          <div className="relative min-h-[100dvh] w-full flex-1">
            <img
              src="/seed-saver-complete.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <p className="sr-only">Level 3 complete. Super Seed Saver. Ready for the Tree Protector journey.</p>
            <button
              type="button"
              onClick={() => setFlowStep("treeWelcome")}
              className={`absolute bottom-6 right-6 z-10 sm:bottom-10 sm:right-10 ${nextButtonClass}`}
            >
              Next
            </button>
          </div>,
          "Level 3 complete — Seed Saver"
        )}
      {flowStep === "treeWelcome" &&
        portalOverlay(
          <div
            className="relative flex min-h-[100dvh] flex-1 flex-col items-center justify-center overflow-y-auto bg-cover bg-center px-4 py-10"
            style={{ backgroundImage: "url('/login-forest-bg.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/75 via-emerald-900/65 to-lime-950/80" />
            <div className="relative z-10 mx-auto w-full max-w-lg rounded-[2rem] border-2 border-[#f6d57e]/50 bg-gradient-to-br from-[#1f5b2d]/95 via-[#256d32]/95 to-[#164327]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-10">
              <div className="text-center text-5xl sm:text-6xl" aria-hidden="true">
                🌳🐝🌿
              </div>
              <h2 className="mt-4 text-center text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-tight tracking-tight text-[#fff8dc]">
                Welcome to Tree Protector!
              </h2>
              <p className="mt-2 text-center text-lg font-bold text-[#f6d57e] sm:text-xl">Levels 4–7</p>
              <p className="mt-6 text-center text-base leading-relaxed text-[#e8efd9] sm:text-lg">
                You finished Seed Saver like a champion. Now you&apos;re growing into a{" "}
                <span className="font-black text-lime-200">Tree Protector</span>—someone who helps forests breathe,
                gives shade to tiny creatures, and stands tall for nature.
              </p>
              <p className="mt-4 text-center text-base leading-relaxed text-[#d4e8c8] sm:text-lg">
                Scenes 4 through 7 are your next adventure. Bee believes in you—keep going, explore, and show the
                forest your kindness!
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={finishSeedCelebration}
                  className="rounded-2xl bg-gradient-to-r from-[#f7c54c] via-[#f8ba38] to-[#f3ad25] px-10 py-4 text-lg font-extrabold text-[#2f2f2f] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:scale-[1.03] hover:brightness-105 active:scale-[0.99] sm:px-12 sm:text-xl"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>,
          "Welcome to Tree Protector",
          "overflow-y-auto bg-emerald-950"
        )}
      {flowStep === "treeMilestone" &&
        portalOverlay(
          <div className="relative min-h-[100dvh] w-full flex-1">
            <img
              src="/tree-protector-complete.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <p className="sr-only">Level 7 complete. Expert Tree Protector milestone.</p>
            <button
              type="button"
              onClick={() => setFlowStep("earthWelcome")}
              className={`absolute bottom-6 right-6 z-10 sm:bottom-10 sm:right-10 ${nextButtonClass}`}
            >
              Next
            </button>
          </div>,
          "Level 7 complete — Tree Protector"
        )}
      {flowStep === "earthWelcome" &&
        portalOverlay(
          <div
            className="relative flex min-h-[100dvh] flex-1 flex-col items-center justify-center overflow-y-auto bg-cover bg-center px-4 py-10"
            style={{ backgroundImage: "url('/login-forest-bg.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-teal-950/80 via-emerald-900/70 to-lime-950/85" />
            <div className="relative z-10 mx-auto w-full max-w-lg rounded-[2rem] border-2 border-amber-200/40 bg-gradient-to-br from-[#1a4d3a]/95 via-[#1f5b2d]/95 to-[#123d28]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-10">
              <div className="text-center text-5xl sm:text-6xl" aria-hidden="true">
                🌍🐝✨
              </div>
              <h2 className="mt-4 text-center text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-tight tracking-tight text-[#fff8dc]">
                Welcome, Earth Guardian!
              </h2>
              <p className="mt-2 text-center text-lg font-bold text-amber-200 sm:text-xl">Levels 8–10</p>
              <p className="mt-6 text-center text-base leading-relaxed text-[#e8efd9] sm:text-lg">
                You protected trees like a hero. Now you step into{" "}
                <span className="font-black text-lime-200">Earth Guardian</span>—where air, water, soil, and every
                creature connect as one big story.
              </p>
              <p className="mt-4 text-center text-base leading-relaxed text-[#d4e8c8] sm:text-lg">
                Scenes 8 through 10 are your grand finale. Take a deep breath, stay curious, and keep being kind to the
                planet—Bee is cheering you on!
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={finishTreeCelebration}
                  className="rounded-2xl bg-gradient-to-r from-[#f7c54c] via-[#f8ba38] to-[#f3ad25] px-10 py-4 text-lg font-extrabold text-[#2f2f2f] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:scale-[1.03] hover:brightness-105 active:scale-[0.99] sm:px-12 sm:text-xl"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>,
          "Welcome to Earth Guardian",
          "overflow-y-auto bg-emerald-950"
        )}
      {flowStep === "earthMilestone" &&
        portalOverlay(
          <div className="relative min-h-[100dvh] w-full flex-1">
            <img
              src="/earth-guardian-complete.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <p className="sr-only">Levels 8 through 10 complete. Earth Guardian achievement.</p>
            <button
              type="button"
              onClick={() => setFlowStep("journeyComplete")}
              className={`absolute bottom-6 right-6 z-10 sm:bottom-10 sm:right-10 ${nextButtonClass}`}
            >
              Next
            </button>
          </div>,
          "Earth Guardian — levels 8 through 10 complete"
        )}
      {flowStep === "journeyComplete" &&
        portalOverlay(
          <div
            className="relative flex min-h-[100dvh] flex-1 flex-col items-center justify-center overflow-y-auto bg-cover bg-center px-4 py-10"
            style={{ backgroundImage: "url('/login-forest-bg.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-sky-950/80 via-emerald-900/75 to-lime-950/85" />
            <div className="relative z-10 mx-auto w-full max-w-lg rounded-[2rem] border-2 border-sky-200/40 bg-gradient-to-br from-[#1a4d4a]/95 via-[#1f5b2d]/95 to-[#123d32]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-10">
              <div className="text-center text-5xl sm:text-6xl" aria-hidden="true">
                🏆🌍🐝
              </div>
              <h2 className="mt-4 text-center text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-tight tracking-tight text-[#fff8dc]">
                You finished the whole journey!
              </h2>
              <p className="mt-2 text-center text-lg font-bold text-sky-200 sm:text-xl">Earth Guardian · Scenes 1–10</p>
              <p className="mt-6 text-center text-base leading-relaxed text-[#e8efd9] sm:text-lg">
                From Seed Saver to Tree Protector to Earth Guardian—you lived every lesson. The forest is brighter
                because of you, and Bee could not be more proud.
              </p>
              <p className="mt-4 text-center text-base leading-relaxed text-[#d4e8c8] sm:text-lg">
                Keep caring for nature in real life: share what you learned, invite friends to be kind to the planet,
                and stay curious. This is not the end—it is your beginning as a true Earth Guardian!
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link
                  to="/quiz"
                  className="inline-flex rounded-2xl border-2 border-sky-200/50 bg-sky-900/40 px-8 py-3 text-lg font-extrabold text-sky-100 shadow-md transition hover:bg-sky-800/50"
                >
                  Take the forest quiz
                </Link>
                <button
                  type="button"
                  onClick={finishEarthFinalCelebration}
                  className="rounded-2xl bg-gradient-to-r from-[#f7c54c] via-[#f8ba38] to-[#f3ad25] px-10 py-4 text-lg font-extrabold text-[#2f2f2f] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:scale-[1.03] hover:brightness-105 active:scale-[0.99] sm:px-12 sm:text-xl"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>,
          "Journey complete",
          "overflow-y-auto bg-emerald-950"
        )}
    </>
  );
}
