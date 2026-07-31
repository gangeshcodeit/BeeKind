import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";
import SoftCard from "../components/ui/SoftCard.jsx";
import BeeBuddy from "../components/ui/BeeBuddy.jsx";

export default function SceneDetail() {
  const { sceneId } = useParams();
  const { token } = useAuth();
  const [scene, setScene] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sceneData, progressData] = await Promise.all([
          apiFetch(`/api/scenes/${sceneId}`, { token }),
          apiFetch("/api/user/progress", { token }),
        ]);
        if (!cancelled) {
          setScene(sceneData.scene);
          setProgress(progressData.progress);
          setDialogueIndex(0);
        }
      } catch (e) {
        if (!cancelled) setError(e.data?.error || e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sceneId, token]);

  const dialogueLines = useMemo(() => scene?.dialogue || [], [scene]);
  const currentLine = dialogueLines[dialogueIndex] || "";
  const hasNext = dialogueIndex < dialogueLines.length - 1;
  const completed = progress?.completedSceneIds?.includes(scene?.id);
  const taskOnly = scene?.id === "scene-10";

  if (error && !scene) {
    return (
      <SoftCard>
        <p className="text-lg text-rose-100">
          {error}{" "}
          <Link to="/scenes" className="font-bold text-lime-200 underline">
            Back to scenes
          </Link>
        </p>
      </SoftCard>
    );
  }

  if (!scene) {
    return <p className="text-lg text-emerald-100">Loading forest scene...</p>;
  }

  return (
    <div className="page-transition grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Link to="/scenes" className="inline-block text-base font-bold text-lime-200 underline">
          ← Back to scene list
        </Link>
        <SoftCard>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-100/70">{scene.id}</p>
          <h1 className="mt-2 text-4xl font-black text-lime-50">{scene.title}</h1>
          <p className="mt-2 text-lg text-emerald-100">Theme: {scene.theme}</p>
          {!taskOnly && scene.purpose && (
            <p className="mt-4 text-base leading-relaxed text-emerald-100/90">
              <span className="font-bold text-lime-100">Purpose: </span>
              {scene.purpose}
            </p>
          )}
          {!taskOnly && scene.learningMessage && (
            <p className="mt-3 rounded-2xl bg-lime-900/35 px-4 py-3 text-base leading-relaxed text-lime-50">
              <span className="font-bold text-[#f6d57e]">Learning message: </span>
              {scene.learningMessage}
            </p>
          )}
        </SoftCard>

        {!taskOnly && (
          <SoftCard>
            <h2 className="text-2xl font-black text-lime-50">Dialogue</h2>
            <p key={`${scene.id}-${dialogueIndex}`} className="dialogue-fade mt-3 rounded-3xl bg-emerald-200/20 p-4 text-xl text-emerald-50">
              {currentLine || "No dialogue available."}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setDialogueIndex((i) => Math.max(i - 1, 0))}
                disabled={dialogueIndex === 0}
                className="hive-button disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setDialogueIndex((i) => (hasNext ? i + 1 : i))}
                disabled={!hasNext}
                className="hive-button disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </SoftCard>
        )}

        <SoftCard className="bg-lime-950/45">
          <h2 className="text-2xl font-black text-lime-50">Task Mission</h2>
          <p className="mt-3 text-xl text-lime-100">{scene.task}</p>
          <p className="mt-3 text-base text-emerald-100/85">
            {completed ? "✅ This scene is approved and complete." : "📷 Upload your task image for teacher approval."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/tasks" className="hive-button">
              Upload task image
            </Link>
            <Link to="/bee" className="hive-button">
              Ask Bee for help
            </Link>
          </div>
        </SoftCard>
      </div>
      <div className="space-y-4">
        <BeeBuddy
          title="Bee Assistant"
          message={
            taskOnly
              ? "This is your final mission—complete the task below and upload proof for your teacher."
              : "Read each dialogue line slowly, then complete the mission task below."
          }
        />
      </div>
    </div>
  );
}
