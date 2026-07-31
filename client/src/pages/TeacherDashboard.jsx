import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch, apiUrl } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import SoftCard from "../components/ui/SoftCard.jsx";

function MedalBadge({ medal }) {
  if (medal === "gold") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-amber-950 shadow"
        title="1st place"
      >
        <span className="text-base leading-none">⭐</span> Gold
      </span>
    );
  }
  if (medal === "silver") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-200 via-zinc-100 to-slate-300 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-800 shadow"
        title="2nd place"
      >
        <span className="text-base leading-none">🥈</span> Silver
      </span>
    );
  }
  if (medal === "bronze") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-amber-100 shadow"
        title="3rd place"
      >
        <span className="text-base leading-none">🥉</span> Bronze
      </span>
    );
  }
  return null;
}

export default function TeacherDashboard() {
  const { token, user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [rankError, setRankError] = useState("");

  const loadPending = useCallback(async () => {
    if (!token) return;
    try {
      const taskData = await apiFetch("/api/task/pending", { token });
      setSubmissions(taskData.submissions || []);
    } catch (e) {
      setError(e.data?.error || e.message || "Could not load pending submissions.");
    }
    try {
      const quizData = await apiFetch("/api/quiz/attempts?limit=30", { token });
      setQuizAttempts(quizData.attempts || []);
    } catch {
      setQuizAttempts([]);
    }
    try {
      setRankError("");
      const rankData = await apiFetch("/api/quiz/student-rankings", { token });
      setRankings(rankData.students || []);
    } catch (e) {
      setRankings([]);
      setRankError(e.data?.error || e.message || "Could not load student standings.");
    }
  }, [token]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const pendingCount = useMemo(() => submissions.filter((s) => s.status === "pending").length, [submissions]);

  const quizAttemptsSorted = useMemo(
    () =>
      [...quizAttempts].sort((a, b) => {
        const ra = a.maxScore ? a.score / a.maxScore : 0;
        const rb = b.maxScore ? b.score / b.maxScore : 0;
        if (rb !== ra) return rb - ra;
        return (b.score || 0) - (a.score || 0);
      }),
    [quizAttempts]
  );

  async function review(submissionId, decision) {
    setBusyId(submissionId);
    setError("");
    try {
      const result = await apiFetch(`/api/task/approve/${submissionId}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ decision }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: result.submission?.status || decision } : s))
      );
      await loadPending();
    } catch (e) {
      setError(e.data?.error || e.message || "Review action failed.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="teacher-dashboard-page page-transition">
      <div className="teacher-dashboard-page-bg-fixed" aria-hidden>
        <div className="teacher-dashboard-page-bg-img" />
        <div className="teacher-dashboard-page-bg-veil" />
      </div>

      <div className="teacher-dashboard-content">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-white/50 bg-white/35 px-4 py-2 text-sm font-extrabold text-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-white/55"
          >
            Log out
          </button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="kid-title">Teacher Review Dashboard</h1>
            <p className="kid-subtitle">Welcome {user?.name || "Teacher"} — review student task submissions below.</p>
          </div>
          <span className="rounded-full bg-[#f6d57e]/25 px-4 py-2 text-base font-bold text-[#fff5d1]">
            Pending: {pendingCount}
          </span>
        </div>

        {error && <p className="rounded-2xl bg-rose-500/20 px-4 py-3 text-base text-rose-100">{error}</p>}

        <SoftCard className="border-[#f6d57e]/35">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-lime-100">Student standings</h2>
              <p className="mt-1 text-sm text-[#e8efd9]/85">
                Ranked by combined marks: <strong>points</strong>, <strong>scenes completed</strong>,{" "}
                <strong>approved tasks</strong>, and <strong>best quiz score</strong> (end-of-journey).
              </p>
            </div>
          </div>
          {rankError && <p className="mt-3 rounded-xl bg-rose-500/15 px-3 py-2 text-sm text-rose-100">{rankError}</p>}
          <div className="mt-4 overflow-x-auto rounded-xl border border-emerald-800/40">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-800/50 bg-emerald-950/60 text-xs font-bold uppercase tracking-wide text-emerald-200/90">
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Total marks</th>
                  <th className="px-3 py-2">Points</th>
                  <th className="px-3 py-2">Scenes</th>
                  <th className="px-3 py-2">Tasks ✓</th>
                  <th className="px-3 py-2">Best quiz</th>
                </tr>
              </thead>
              <tbody>
                {rankings.length === 0 && !rankError && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-[#e8efd9]/80">
                      No students registered yet.
                    </td>
                  </tr>
                )}
                {rankings.map((s) => (
                  <tr
                    key={s.userId}
                    className={`border-b border-emerald-900/40 ${
                      s.medal ? "bg-emerald-900/25" : "hover:bg-emerald-950/40"
                    }`}
                  >
                    <td className="px-3 py-2.5 align-middle">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-lime-100">{s.rank}</span>
                        {s.medal && <MedalBadge medal={s.medal} />}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 align-middle">
                      <p className="font-bold text-white">{s.name}</p>
                      <p className="text-xs text-[#e8efd9]/70">{s.email}</p>
                    </td>
                    <td className="px-3 py-2.5 font-black text-amber-200">{s.totalMarks}</td>
                    <td className="px-3 py-2.5 text-[#e8efd9]">{s.points}</td>
                    <td className="px-3 py-2.5 text-[#e8efd9]">{s.scenesCompleted}</td>
                    <td className="px-3 py-2.5 text-[#e8efd9]">{s.approvedTasks}</td>
                    <td className="px-3 py-2.5 text-[#e8efd9]">
                      {s.bestQuizScore != null ? (
                        <span>
                          {s.bestQuizScore} / {s.quizMaxScore}
                        </span>
                      ) : (
                        <span className="text-emerald-200/50">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SoftCard>

        <div className="grid gap-3">
          {submissions.length === 0 && (
            <SoftCard>
              <p className="text-base text-[#e8efd9]">No pending student submissions right now.</p>
            </SoftCard>
          )}

          {submissions.map((s) => (
            <SoftCard key={s.id} className={s.status === "pending" ? "border-[#f6d57e]/50" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-white">{s.studentName}</p>
                  <p className="text-sm text-[#e8efd9]/80">{s.studentEmail || "No email"}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    s.status === "approved"
                      ? "bg-emerald-300/30 text-emerald-100"
                      : s.status === "rejected"
                        ? "bg-rose-300/30 text-rose-100"
                        : "bg-[#f6d57e]/30 text-[#fff5d1]"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-[#e8efd9]">
                <p>
                  Scene: <span className="font-bold">{s.sceneId}</span> — {s.sceneTitle}
                </p>
                <p className="mt-1">Submitted: {new Date(s.createdAt).toLocaleString()}</p>
              </div>

              {s.imageUrl && (
                <div className="mt-4">
                  <a
                    href={apiUrl(s.imageUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-xl bg-[#f6d57e]/25 px-3 py-2 text-sm font-bold text-[#fff5d1] hover:bg-[#f6d57e]/35"
                  >
                    View Uploaded Image
                  </a>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === s.id || s.status !== "pending"}
                  onClick={() => review(s.id, "approved")}
                  className="hive-button px-4 py-2 text-base disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === s.id || s.status !== "pending"}
                  onClick={() => review(s.id, "rejected")}
                  className="rounded-2xl bg-rose-500/75 px-4 py-2 text-base font-bold text-white transition hover:bg-rose-400 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </SoftCard>
          ))}
        </div>

        <h2 className="mt-10 kid-title">Quiz attempts</h2>
        <p className="kid-subtitle">
          {`End-of-journey quiz (raw log sorted by score; standings table uses each student's best quiz attempt).`}
        </p>
        <div className="mt-3 grid gap-3">
          {quizAttemptsSorted.length === 0 && (
            <SoftCard>
              <p className="text-base text-[#e8efd9]">No quiz submissions yet.</p>
            </SoftCard>
          )}
          {quizAttemptsSorted.map((a) => (
            <SoftCard key={a.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-lg font-bold text-white">{a.studentName}</p>
                  <p className="text-sm text-[#e8efd9]/80">{a.studentEmail}</p>
                </div>
                <span className="rounded-full bg-lime-200/25 px-3 py-1 text-sm font-black text-lime-100">
                  {a.score} / {a.maxScore}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#e8efd9]/80">
                {new Date(a.createdAt).toLocaleString()}
                {a.adaptiveMode ? " · Gentle mode (hints)" : ""}
              </p>
            </SoftCard>
          ))}
        </div>
      </div>

      </div>
    </div>
  );
}
