import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";
import { firstIncompletePrerequisiteScene, parseSceneIdInput } from "../utils/sceneOrder.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const FILE_SIZE_ERROR = "Image must be under 5MB.";

function countApprovedScenes(completedSceneIds) {
  const set = new Set(completedSceneIds || []);
  let n = 0;
  for (let i = 1; i <= 10; i += 1) {
    if (set.has(`scene-${i}`)) n += 1;
  }
  return n;
}

export default function Tasks() {
  const { token } = useAuth();
  const [sceneId, setSceneId] = useState("scene-1");
  const [completedSceneIds, setCompletedSceneIds] = useState([]);
  const [currentSceneNumber, setCurrentSceneNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/scenes/current", { token });
        if (cancelled || !data?.scene?.id) return;
        setSceneId(data.scene.id);
        setCompletedSceneIds(data.progress?.completedSceneIds || []);
        setCurrentSceneNumber(data.progress?.currentSceneNumber ?? 1);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const approvedCount = useMemo(() => countApprovedScenes(completedSceneIds), [completedSceneIds]);
  const totalScenes = 10;

  function onPickFile(e) {
    const picked = e.target.files?.[0] || null;
    setMsg("");
    setPopup("");
    if (!picked) {
      setFile(null);
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setError(FILE_SIZE_ERROR);
      e.target.value = "";
      return;
    }
    setFile(picked);
    if (error === FILE_SIZE_ERROR) setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    setPopup("");
    if (!file) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(FILE_SIZE_ERROR);
      return;
    }

    const trimmed = String(sceneId).trim();
    const sceneNumber = parseSceneIdInput(trimmed);
    if (!Number.isFinite(sceneNumber) || sceneNumber < 1 || sceneNumber > 10) {
      setError("Use scene-1 through scene-10 (for example scene-3).");
      return;
    }

    const normalizedId = `scene-${sceneNumber}`;
    const missing = firstIncompletePrerequisiteScene(completedSceneIds, sceneNumber);
    if (missing !== null) {
      setPopup(`First complete scene ${missing}.`);
      return;
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("sceneId", normalizedId);
    try {
      await apiFetch("/api/task/upload", {
        method: "POST",
        token,
        body: fd,
      });
      setMsg("Submitted! Your task is now pending teacher approval.");
      setFile(null);
      try {
        const data = await apiFetch("/api/scenes/current", { token });
        setCompletedSceneIds(data.progress?.completedSceneIds || []);
        setCurrentSceneNumber(data.progress?.currentSceneNumber ?? 1);
        setSceneId(data.scene?.id || normalizedId);
      } catch {
        /* ignore */
      }
    } catch (err) {
      const serverMsg = err?.data?.error || err.message || "Upload failed";
      if (err?.status === 403) {
        const m = err.data?.missingScene;
        setPopup(typeof m === "number" ? `First complete scene ${m}.` : serverMsg);
      } else {
        setError(serverMsg);
      }
    }
  }

  return (
    <div className="task-page-root">
      <div className="task-page-bg-fixed" aria-hidden>
        <div className="task-page-bg-img" />
        <div className="task-page-bg-veil" />
      </div>

      <Link to="/weather" className="weather-nav-next shrink-0">
        Next →
      </Link>

      <div className="task-page-on-image">
        <Link to="/dashboard" className="weather-nav-home shrink-0">
          ← Home
        </Link>

        <motion.div
          className="task-side-bird"
          initial={{ x: -140, opacity: 0 }}
          animate={{ x: [0, 6, 0], y: [0, -4, 0], opacity: 1 }}
          transition={{ x: { duration: 3.2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }, y: { duration: 2.2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }, opacity: { duration: 0.65, ease: "easeOut" } }}
          aria-hidden
        >
          <DotLottiePlayer
            className="task-side-bird-player"
            src="/animations/Cute%20bird.lottie"
            autoplay
            loop
            background="transparent"
          />
        </motion.div>

        <div className="task-page-center">
          <div className="task-glass-card">
            <h1 className="task-glass-title font-display">
              Task upload
              <span className="task-glass-title-emoji" aria-hidden>
                {" "}
                📸
              </span>
            </h1>
            <p className="task-glass-progress-line">
              <strong>
                {approvedCount}/{totalScenes}
              </strong>{" "}
              scenes teacher-approved · next up: <strong>scene-{currentSceneNumber}</strong>
            </p>

            <form onSubmit={onSubmit} className="task-glass-form mt-6 space-y-4">
              {msg && <p className="task-glass-banner task-glass-banner--ok">{msg}</p>}
              {error && <p className="task-glass-banner task-glass-banner--err">{error}</p>}

              <label className="task-glass-label">
                Scene id
                <input
                  type="text"
                  className="task-glass-input"
                  value={sceneId}
                  onChange={(e) => setSceneId(e.target.value)}
                  placeholder="scene-1 … scene-10"
                  autoComplete="off"
                />
              </label>
              <label className="task-glass-label">
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="task-glass-file"
                  onChange={onPickFile}
                />
              </label>

              <button type="submit" className="task-glass-submit hive-button w-full font-extrabold">
                Submit task
              </button>
            </form>
          </div>
        </div>
      </div>

      {popup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="scene-order-popup-title"
        >
          <div className="w-full max-w-md rounded-[1.5rem] border-2 border-white/35 bg-emerald-950/90 p-6 shadow-2xl backdrop-blur-md">
            <h2 id="scene-order-popup-title" className="font-display text-xl font-black text-amber-50">
              Not yet unlocked
            </h2>
            <p className="mt-3 text-lg text-emerald-100">{popup}</p>
            <button type="button" onClick={() => setPopup("")} className="hive-button mt-6 w-full">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
