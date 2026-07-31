import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch, apiUrl } from "../api/client.js";
import SoftCard from "../components/ui/SoftCard.jsx";
import BeeBuddy from "../components/ui/BeeBuddy.jsx";
import QuizBeeWingGate from "../components/ui/QuizBeeWingGate.jsx";

const TEN_MIN_MS = 10 * 60 * 1000;

function quizImageSrc(url) {
  if (!url) return "";
  if (String(url).startsWith("http")) return url;
  return apiUrl(url);
}

function formatMmSs(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function QuizShell({ children, compactHero = false }) {
  return (
    <div className="quiz-page-root">
      <div className="quiz-page-bg-fixed" aria-hidden>
        <div className="quiz-page-bg-img" />
        <div className="quiz-page-bg-veil" />
      </div>

      <Link to="/forest-3d" className="weather-nav-next shrink-0">
        Next →
      </Link>

      <div className="quiz-page-on-image">
        <div className="flex w-full flex-wrap items-start justify-between gap-3">
          <Link to="/dashboard" className="weather-nav-home shrink-0">
            ← Home
          </Link>
        </div>
        {!compactHero && (
          <div className="mt-1">
            <h1 className="quiz-hero-title font-display text-[clamp(1.4rem,4vw,1.85rem)] font-bold leading-tight text-white sm:text-3xl">
              Forest quiz
            </h1>
            <p className="mt-1 text-sm font-semibold text-amber-50 drop-shadow-md sm:text-base">
              Study under the sunbeams—your answers sit on the learning path.
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function QuizStack({ children }) {
  return <div className="flex w-full flex-col gap-4 lg:grid lg:grid-cols-[1fr_280px] lg:items-start">{children}</div>;
}

export default function Quiz() {
  const { token } = useAuth();
  const [status, setStatus] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [adaptive, setAdaptive] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [expiresAtMs, setExpiresAtMs] = useState(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const autoSubmitFired = useRef(false);

  const loadStatus = useCallback(async () => {
    const data = await apiFetch("/api/quiz/status", { token });
    setStatus(data);
    return data;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await apiFetch("/api/quiz/status", { token });
        if (cancelled) return;
        setStatus(s);
        if (!s.eligible) {
          setPhase("locked");
        } else if (s.quizCompleted) {
          setPhase("finished");
        } else {
          setPhase("intro");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus({ eligible: false, scenesCompleted: 0, totalScenes: 10, error: e.data?.error || e.message });
          setPhase("locked");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const remainingMs = useMemo(() => {
    if (expiresAtMs == null) return TEN_MIN_MS;
    return Math.max(0, expiresAtMs - nowTick);
  }, [expiresAtMs, nowTick]);

  useEffect(() => {
    if (phase !== "quiz" || expiresAtMs == null) return undefined;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase, expiresAtMs]);

  const startQuiz = useCallback(async () => {
    setSubmitError("");
    autoSubmitFired.current = false;
    try {
      const q = await apiFetch("/api/quiz/begin", {
        method: "POST",
        token,
        body: JSON.stringify({ adaptiveMode: adaptive }),
      });
      setQuestions(q.questions || []);
      setSelections({});
      setIndex(0);
      setResult(null);
      const end = q.expiresAt ? new Date(q.expiresAt).getTime() : Date.now() + (q.timeLimitMs || TEN_MIN_MS);
      setExpiresAtMs(end);
      setNowTick(Date.now());
      setPhase("quiz");
    } catch (e) {
      setSubmitError(e.data?.error || e.message || "Could not start the quiz.");
    }
  }, [token, adaptive]);

  const current = questions[index];
  const total = questions.length;
  const answeredCount = useMemo(() => Object.keys(selections).length, [selections]);
  const canSubmit = total > 0 && answeredCount === total;

  const submitQuiz = useCallback(async () => {
    if (total === 0) return;
    setSubmitError("");
    setPhase("submitting");
    try {
      const answers = questions.map((q) => ({
        questionId: q.id,
        selectedIndex: typeof selections[q.id] === "number" ? selections[q.id] : null,
      }));
      const data = await apiFetch("/api/quiz/submit", {
        method: "POST",
        token,
        body: JSON.stringify({ answers, adaptiveMode: adaptive }),
      });
      setResult(data);
      setPhase("results");
      setExpiresAtMs(null);
      await loadStatus();
    } catch (e) {
      autoSubmitFired.current = false;
      setSubmitError(e.data?.error || e.message || "Submit failed");
      setPhase("quiz");
    }
  }, [questions, selections, adaptive, token, total, loadStatus]);

  useEffect(() => {
    if (phase !== "quiz" || expiresAtMs == null || total === 0) return undefined;
    if (remainingMs > 0) return undefined;
    if (autoSubmitFired.current) return undefined;
    autoSubmitFired.current = true;
    submitQuiz();
    return undefined;
  }, [phase, expiresAtMs, remainingMs, total, submitQuiz]);

  if (phase === "loading") {
    return (
      <QuizShell>
        <p className="quiz-loading-text">Loading quiz…</p>
      </QuizShell>
    );
  }

  if (phase === "locked" || !status?.eligible) {
    const scenesDone = status?.scenesCompleted ?? 0;
    const scenesTotal = status?.totalScenes ?? 10;
    return (
      <QuizShell compactHero>
        <div className="quiz-bee-page-wrap">
          <QuizBeeWingGate>
            <div className="quiz-speech-popup__head">
              <h1 className="quiz-speech-popup__title">Forest Quiz</h1>
              <span className="quiz-speech-popup__notepad" aria-hidden>
                📝
              </span>
            </div>
            <p className="quiz-speech-popup__status">
              {scenesDone} / {scenesTotal} scenes done (teacher-approved)
            </p>
            <p className="quiz-speech-popup__copy">
              The quiz unlocks after you complete <strong>all 10 scenes</strong> with teacher approval—so it reviews
              everything you learned.
            </p>
            <div className="quiz-speech-popup__actions">
              <Link to="/scenes" className="hive-button">
                Go to scenes
              </Link>
              <Link to="/dashboard" className="hive-button">
                Dashboard
              </Link>
            </div>
          </QuizBeeWingGate>
        </div>
      </QuizShell>
    );
  }

  if (phase === "finished" && status?.lastAttempt) {
    return (
      <QuizShell compactHero>
        <div className="quiz-bee-page-wrap">
          <QuizBeeWingGate>
            <div className="quiz-speech-popup__head">
              <h1 className="quiz-speech-popup__title">Quiz already completed</h1>
              <span className="quiz-speech-popup__notepad" aria-hidden>
                📝
              </span>
            </div>
            <p className="quiz-speech-popup__status">
              Each student takes the forest quiz once. Your score is saved for your teacher.
            </p>
            <p className="quiz-speech-popup__copy">
              <strong>
                {status.lastAttempt.score} / {status.lastAttempt.maxScore}
              </strong>{" "}
              · Submitted {new Date(status.lastAttempt.createdAt).toLocaleString()}
            </p>
            <div className="quiz-speech-popup__actions">
              <Link to="/dashboard" className="hive-button">
                Back to dashboard
              </Link>
            </div>
          </QuizBeeWingGate>
        </div>
      </QuizShell>
    );
  }

  if (phase === "intro") {
    return (
      <QuizShell compactHero>
        <div className="quiz-bee-page-wrap">
          <QuizBeeWingGate>
            <div className="quiz-speech-popup__head">
              <h1 className="quiz-speech-popup__title">Forest Quiz</h1>
              <span className="quiz-speech-popup__notepad" aria-hidden>
                📝
              </span>
            </div>
            <p className="quiz-speech-popup__status">You&apos;re ready — start when you like!</p>
            <p className="quiz-speech-popup__copy">
              Eight questions mix story scenes, multiple choice, and <strong>two pictures from your own approved scene uploads</strong>.
              You have <strong>10 minutes</strong> once you start, and you can take this quiz <strong>only one time</strong>.
            </p>
            {submitError && (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900">
                {submitError}
              </p>
            )}
            <label className="quiz-speech-intro-label">
              <input
                type="checkbox"
                checked={adaptive}
                onChange={(e) => setAdaptive(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-emerald-600"
              />
              <span>
                <span className="font-bold text-emerald-900">Gentle mode (optional)</span>
                <span className="mt-1 block text-sm text-slate-700">
                  Show a short hint from Bee under each question text—helps if you want a softer challenge. Your teacher
                  still sees your score.
                </span>
              </span>
            </label>
            <div className="quiz-speech-popup__actions">
              <button type="button" onClick={startQuiz} className="hive-button">
                Start quiz
              </button>
            </div>
          </QuizBeeWingGate>
        </div>
      </QuizShell>
    );
  }

  if (phase === "submitting") {
    return (
      <QuizShell compactHero>
        <p className="quiz-loading-text">Sending your answers…</p>
      </QuizShell>
    );
  }

  if (phase === "results" && result) {
    return (
      <QuizShell>
        <QuizStack>
          <SoftCard className="quiz-panel">
            <h1 className="kid-title">Quiz complete!</h1>
            <p className="mt-4 font-display text-3xl font-black text-emerald-900">
              {result.score} / {result.maxScore}
            </p>
            <p className="mt-2 text-base text-emerald-900/90">
              Your teacher can see this score on their dashboard. Retakes are not available.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/dashboard" className="hive-button">
                Back to dashboard
              </Link>
            </div>
          </SoftCard>
          <BeeBuddy className="quiz-bee-panel" title="Bee" message="One shot, big heart—you finished the forest quiz!" />
        </QuizStack>
      </QuizShell>
    );
  }

  if (phase === "quiz" && current) {
    const urgent = remainingMs < 60_000;
    return (
      <QuizShell compactHero>
        <div className="flex w-full flex-col gap-4 lg:grid lg:grid-cols-[1fr_260px] lg:items-start">
          <SoftCard className="quiz-panel">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-900/75">
                Question {index + 1} of {total}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`quiz-kpi-timer ${urgent ? "quiz-kpi-timer--urgent" : ""}`}>
                  Time left: {formatMmSs(remainingMs)}
                </span>
                <span className="quiz-kpi-scene">{current.sceneId}</span>
              </div>
            </div>
            <div className="quiz-progress-track mt-3">
              <div className="quiz-progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
            {current.imageUrl && (
              <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#f9d74c]/40 bg-black/15 shadow-lg">
                <img
                  src={quizImageSrc(current.imageUrl)}
                  alt=""
                  className="max-h-56 w-full object-cover object-center sm:max-h-72"
                />
              </div>
            )}
            <p className="mt-5 text-lg font-bold leading-snug text-emerald-950 sm:text-xl">{current.prompt}</p>
            {current.hint && (
              <p className="mt-3 rounded-xl border border-amber-200/60 bg-amber-100/50 px-3 py-2 text-sm text-emerald-950">
                <span className="font-bold text-amber-800">Hint: </span>
                {current.hint}
              </p>
            )}
            <div className="mt-5 space-y-3">
              {current.choices.map((label, i) => (
                <label
                  key={i}
                  className={`quiz-choice ${selections[current.id] === i ? "quiz-choice--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name={current.id}
                    checked={selections[current.id] === i}
                    onChange={() => setSelections((prev) => ({ ...prev, [current.id]: i }))}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="text-base font-medium text-emerald-950">{label}</span>
                </label>
              ))}
            </div>
            {submitError && <p className="mt-4 text-sm font-semibold text-rose-800">{submitError}</p>}
            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((x) => Math.max(0, x - 1))}
                className="rounded-2xl border-2 border-emerald-800/25 bg-white/40 px-5 py-2.5 text-base font-bold text-emerald-900 backdrop-blur-sm disabled:opacity-40"
              >
                Back
              </button>
              {index < total - 1 ? (
                <button
                  type="button"
                  disabled={selections[current.id] === undefined}
                  onClick={() => setIndex((x) => x + 1)}
                  className="hive-button disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => submitQuiz()}
                  className="hive-button disabled:opacity-50"
                >
                  Submit answers
                </button>
              )}
            </div>
          </SoftCard>
          <BeeBuddy
            className="quiz-bee-panel"
            title="Bee"
            message="Watch the timer—you have 10 minutes total. Unanswered questions count as wrong if time runs out."
          />
        </div>
      </QuizShell>
    );
  }

  return (
    <QuizShell>
      <SoftCard className="quiz-panel">
        <p className="text-emerald-900">Something went wrong.</p>
        <Link to="/dashboard" className="hive-button mt-4 inline-block">
          Dashboard
        </Link>
      </SoftCard>
    </QuizShell>
  );
}
