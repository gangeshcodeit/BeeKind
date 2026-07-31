import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ForestPage from "./ui/ForestPage.jsx";
import SeedSaverCelebrationGate from "./SeedSaverCelebrationGate.jsx";

/** @type {Record<string, { active: string; idle: string }>} */
const NAV_THEMES = {
  sky: {
    active: "bg-gradient-to-b from-sky-400/50 to-sky-600/40 text-white ring-2 ring-sky-200/50 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-sky-100 hover:bg-sky-500/20 hover:text-white",
  },
  violet: {
    active: "bg-gradient-to-b from-violet-400/50 to-violet-700/40 text-white ring-2 ring-violet-200/45 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-violet-100 hover:bg-violet-500/20 hover:text-white",
  },
  amber: {
    active: "bg-gradient-to-b from-amber-400/55 to-amber-700/45 text-amber-950 ring-2 ring-amber-200/50 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-amber-100 hover:bg-amber-500/25 hover:text-amber-50",
  },
  rose: {
    active: "bg-gradient-to-b from-rose-400/50 to-rose-700/40 text-white ring-2 ring-rose-200/45 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-rose-100 hover:bg-rose-500/20 hover:text-white",
  },
  cyan: {
    active: "bg-gradient-to-b from-cyan-400/50 to-cyan-700/40 text-cyan-950 ring-2 ring-cyan-100/50 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-cyan-100 hover:bg-cyan-500/20 hover:text-white",
  },
  lime: {
    active: "bg-gradient-to-b from-lime-400/50 to-lime-700/40 text-lime-950 ring-2 ring-lime-200/45 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-lime-100 hover:bg-lime-500/20 hover:text-lime-50",
  },
  emerald: {
    active: "bg-gradient-to-b from-emerald-400/50 to-emerald-800/45 text-white ring-2 ring-emerald-200/45 shadow-[0_3px_0_rgba(0,0,0,0.15)]",
    idle: "text-emerald-100 hover:bg-emerald-500/20 hover:text-white",
  },
};

function navClass(themeKey) {
  const t = NAV_THEMES[themeKey] || NAV_THEMES.sky;
  return ({ isActive }) =>
    [
      "inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-base font-extrabold transition duration-200 sm:px-4",
      isActive ? t.active : `${t.idle} hover:scale-[1.03] active:scale-[0.98]`,
    ].join(" ");
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isTeacher = user?.role === "teacher";
  const isForest3d = location.pathname === "/forest-3d";
  const isWeatherPage = location.pathname === "/weather";
  const isQuizPage = location.pathname === "/quiz";
  const isTasksPage = location.pathname === "/tasks";
  const isBeeChatPage = location.pathname === "/bee";
  const isScenesPage = location.pathname === "/scenes";
  const isDashboardPage = location.pathname === "/dashboard";
  const isTeacherDashboardPage = location.pathname === "/teacher-dashboard";
  const immersive =
    isForest3d ||
    isWeatherPage ||
    isQuizPage ||
    isTasksPage ||
    isBeeChatPage ||
    isScenesPage ||
    isDashboardPage ||
    isTeacherDashboardPage;

  return (
    <ForestPage fullBleed={immersive} contentClassName={immersive ? "" : "space-y-6"}>
      {isDashboardPage && !isTeacher && (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-4">
          <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between gap-3">
            <div className="pointer-events-auto rounded-2xl border border-amber-300/35 bg-black/35 px-4 py-2 backdrop-blur-md">
              <span className="bg-gradient-to-r from-amber-200 via-sky-200 to-rose-200 bg-clip-text text-3xl font-black text-transparent">
                BeeKind
              </span>
            </div>

            <nav className="pointer-events-auto flex flex-wrap items-center gap-1 rounded-2xl border border-white/20 bg-black/35 px-2 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md sm:gap-1.5 sm:px-2.5">
              <NavLink to="/dashboard" className={navClass("sky")}>
                <span aria-hidden>🏠</span> Home
              </NavLink>
              <NavLink to="/scenes" className={navClass("violet")}>
                <span aria-hidden>🎬</span> Scene
              </NavLink>
              <NavLink to="/bee" className={navClass("amber")}>
                <span aria-hidden>💬</span> Chat
              </NavLink>
              <NavLink to="/tasks" className={navClass("rose")}>
                <span aria-hidden>📸</span> Task
              </NavLink>
              <NavLink to="/weather" className={navClass("cyan")}>
                <span aria-hidden>🌤️</span> Weather
              </NavLink>
              <NavLink to="/quiz" className={navClass("lime")}>
                <span aria-hidden>📝</span> Quiz
              </NavLink>
              <NavLink to="/forest-3d" className={navClass("emerald")}>
                <span aria-hidden>📦</span> 3D
              </NavLink>
            </nav>

            <div className="pointer-events-auto relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/35 px-3 py-2 backdrop-blur-md"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-200 text-lg">🐝</span>
                <div className="leading-tight text-left">
                  <p className="text-sm font-extrabold text-amber-50">{user?.name || "Student"}</p>
                  <p className="text-xs font-semibold text-sky-100 capitalize">{user?.role || "student"}</p>
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 min-w-[10rem] rounded-xl border border-white/25 bg-black/70 p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-100 hover:bg-rose-500/25"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      {!immersive && !isTeacherDashboardPage && (
      <header className="leaf-card relative overflow-hidden px-4 py-4 sm:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-rose-400 via-amber-300 via-50% to-sky-500"
          aria-hidden
        />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <Link
            to={isTeacher ? "/teacher-dashboard" : "/dashboard"}
            className="font-display inline-flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight transition hover:scale-[1.02] sm:text-[2rem]"
          >
            <span className="bg-gradient-to-r from-amber-200 via-sky-200 to-rose-200 bg-clip-text text-transparent">
              BeeKind
            </span>
            <span className="inline-block animate-twinkle select-none text-[1.15em] leading-none" aria-hidden>
              🌿
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {isTeacher ? (
              <NavLink to="/teacher-dashboard" className={navClass("violet")}>
                <span aria-hidden>📋</span> Review
              </NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className={navClass("sky")}>
                  <span aria-hidden>🏠</span> Home
                </NavLink>
                <NavLink to="/scenes" className={navClass("violet")}>
                  <span aria-hidden>🎬</span> Scene
                </NavLink>
                <NavLink to="/bee" className={navClass("amber")}>
                  <span aria-hidden>💬</span> Chat
                </NavLink>
                <NavLink to="/tasks" className={navClass("rose")}>
                  <span aria-hidden>📸</span> Task
                </NavLink>
                <NavLink to="/weather" className={navClass("cyan")}>
                  <span aria-hidden>🌤️</span> Weather
                </NavLink>
                <NavLink to="/quiz" className={navClass("lime")}>
                  <span aria-hidden>📝</span> Quiz
                </NavLink>
                <NavLink to="/forest-3d" className={navClass("emerald")}>
                  <span aria-hidden>🌳</span> 3D
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {user && (
              <span className="rounded-full border border-fuchsia-300/25 bg-gradient-to-r from-fuchsia-950/50 via-cyan-950/40 to-amber-950/40 px-3 py-1.5 text-base font-bold text-amber-50 shadow-inner">
                {user.name} · <span className="capitalize text-sky-100">{user.role}</span>
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border-2 border-sky-400/40 bg-indigo-950/50 px-4 py-2 text-base font-bold text-sky-100 shadow-sm transition hover:scale-[1.03] hover:border-sky-300/60 hover:bg-indigo-900/55 active:scale-[0.98]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      )}
      <main
        key={location.pathname}
        className={
          immersive && !isTeacherDashboardPage
            ? `relative h-[100dvh] min-h-0 w-full min-w-0 overflow-hidden px-0 pb-0 ${isDashboardPage ? "pt-20 sm:pt-24" : "pt-0"}`
            : immersive && isTeacherDashboardPage
              ? "relative min-h-[100dvh] w-full min-w-0 px-0 pb-0 pt-0"
              : "page-transition"
        }
      >
        {isTeacher ? <Outlet /> : <SeedSaverCelebrationGate><Outlet /></SeedSaverCelebrationGate>}
      </main>
    </ForestPage>
  );
}
