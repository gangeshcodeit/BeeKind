import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import SoftCard from "../components/ui/SoftCard.jsx";

export default function Home() {
  const { token } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/health");
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setHealth({ ok: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-transition space-y-8">
      <SoftCard className="p-8">
        <p className="text-sm uppercase tracking-widest text-[#f6d57e]">Scene-based learning</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Welcome to BeeKind</h1>
        <p className="mt-4 max-w-2xl text-[#e8efd9]">
          Learn across ten guided scenes, chat with Bee, submit tasks with images, track points and levels, and
          glance at the weather—all wired to a real Express + MongoDB backend.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {token ? (
            <Link to="/dashboard" className="hive-button inline-flex items-center">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hive-button inline-flex items-center">
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-xl border border-[#f6d57e]/50 bg-[#1f5b2d]/50 px-5 py-2.5 font-semibold text-[#fff5d1] transition hover:bg-[#2d6a2d]/60"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </SoftCard>

      <SoftCard>
        <h2 className="text-lg font-semibold text-white">API connection</h2>
        <p className="mt-2 text-sm text-[#e8efd9]/85">
          Public health check (no auth):{" "}
          <code className="rounded bg-[#164327] px-1.5 py-0.5 text-[#f6d57e]">GET /api/health</code>
        </p>
        <p className="mt-3 text-sm">
          Status:{" "}
          {health === null && <span className="text-[#e8efd9]/75">Checking…</span>}
          {health?.ok === true && (
            <span className="text-emerald-200">
              Connected — {health.service}
            </span>
          )}
          {health?.ok === false && <span className="text-rose-200">Could not reach API (is the server running?)</span>}
        </p>
      </SoftCard>
    </div>
  );
}
