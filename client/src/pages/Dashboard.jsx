import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";
import IntroAnimation from "../components/intro/IntroAnimation.jsx";
import DashboardImpactPanel from "../components/DashboardImpactPanel.jsx";

const WELCOME_DONE_KEY = "beekind_intro_welcome_done";
const PROGRESS_SESSION_KEY = "beekind_intro_progress_session_done";

export default function Dashboard() {
  const { token, loading, user } = useAuth();
  const [dash, setDash] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const dashboardData = await apiFetch("/api/user/dashboard", { token });
        if (!cancelled) {
          setDash(dashboardData);
        }
      } catch (e) {
        if (!cancelled) setErr(e.data?.error || e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <span className="font-display text-5xl animate-twinkle" aria-hidden>
          🌱
        </span>
        <p className="font-display bg-gradient-to-r from-amber-200 to-sky-300 bg-clip-text text-xl font-bold text-transparent">
          Growing your dashboard…
        </p>
        <p className="text-base font-semibold text-rose-200/90">Almost ready!</p>
      </div>
    );
  }

  const completedScenes = dash?.progress?.completedScenes ?? 0;
  const totalScenes = dash?.progress?.totalScenes ?? 10;
  const progressPercent = Math.min(100, Math.round((completedScenes / totalScenes) * 100));
  const currentSceneId = dash?.progress?.currentSceneId || "scene-1";
  const activeLevel = dash?.level || user?.level || "Seed Saver";

  const introVariant = useMemo(() => {
    if (!dash) return null;
    const approvedTasks = dash.taskStats?.completed ?? 0;
    if (typeof window === "undefined") return null;
    if (approvedTasks >= 1) {
      if (window.sessionStorage.getItem(PROGRESS_SESSION_KEY)) return null;
      return "progress";
    }
    if (!window.localStorage.getItem(WELCOME_DONE_KEY)) return "welcome";
    return null;
  }, [dash]);

  return (
    <div className="dashboard-page-root">
      <div className="dashboard-page-bg-fixed" aria-hidden>
        <div className="dashboard-page-bg-img" />
        <div className="dashboard-page-bg-veil" />
      </div>
      {introVariant && (
        <IntroAnimation
          variant={introVariant}
          studentName={(dash?.welcomeName ?? user?.name ?? "").trim() || "friend"}
        />
      )}
      <div className="dashboard-page-on-image page-transition space-y-7">
        <div
          className={`dashboard-overlay-layout${!introVariant && dash ? " dashboard-overlay-layout--with-impact" : ""}`}
        >
          <motion.div
            className={`dashboard-right-cards${!introVariant && dash ? " dashboard-right-cards--in-flow" : ""}`}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          >
            <section className="dashboard-kpi-card dashboard-kpi-card--mint">
              <p className="dashboard-kpi-title">Story Progress</p>
              <p className="dashboard-kpi-main">
                {completedScenes} / {totalScenes} scenes completed
              </p>
              <div className="dashboard-kpi-track">
                <div className="dashboard-kpi-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="dashboard-kpi-sub">{progressPercent}% complete - you've got this!</p>
            </section>

            <section className="dashboard-kpi-card dashboard-kpi-card--violet">
              <p className="dashboard-kpi-title">Points</p>
              <div className="dashboard-points-row">
                <span className="dashboard-points-value">{dash?.points ?? 0}</span>
                {(dash?.badges || []).length > 0 && <span className="dashboard-badge-pill">🏅 {dash.badges[0]}</span>}
              </div>
            </section>

            <section className="dashboard-kpi-card dashboard-kpi-card--amber">
              <p className="dashboard-kpi-title">Journey</p>
              <p className="dashboard-journey-scene">Scene {dash?.progress?.currentSceneNumber ?? 1}</p>
              <p className="dashboard-kpi-sub">
                Next stop: <span className="font-bold text-amber-100">{currentSceneId}</span>
              </p>
            </section>
          </motion.div>

          {!introVariant && dash && (
            <motion.div
              className="dashboard-impact-panel-wrap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
            >
              <DashboardImpactPanel dash={dash} activeLevel={activeLevel} />
            </motion.div>
          )}
        </div>
        {err && <p className="rounded-2xl bg-rose-400/20 px-4 py-3 text-base text-rose-50">{err}</p>}
      </div>
    </div>
  );
}
