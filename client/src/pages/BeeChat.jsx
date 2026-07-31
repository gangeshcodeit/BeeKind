import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

export default function BeeChat() {
  const { token } = useAuth();
  const [input, setInput] = useState("");
  const [scene, setScene] = useState("");
  const [task, setTask] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi explorer! I am Bee. Ask me anything and I will keep it short and fun." },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [popIn, setPopIn] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/scenes/current", { token });
        if (!cancelled && data?.scene) {
          setScene(data.scene.id || "");
          setTask(data.scene.task || "");
        }
      } catch {
        // Keep chat usable even without context.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    const id = window.setTimeout(() => setPopIn(true), 90);
    return () => window.clearTimeout(id);
  }, []);

  const quickActions = useMemo(
    () => [
      { label: "Explain Task", prompt: `Please explain this task in very simple words: ${task || "my current task"}` },
      { label: "Why is this important?", prompt: `Why is this important for nature and kids? Task: ${task || "current task"}` },
      { label: "Fun Fact", prompt: "Tell me one short and fun nature fact." },
    ],
    [task]
  );

  async function send(textOverride) {
    const text = (textOverride ?? input).trim();
    if (!text || busy) return;
    setError("");
    const nextUser = { role: "user", content: text };
    setMessages((m) => [...m, nextUser]);
    setInput("");
    setBusy(true);
    try {
      const data = await apiFetch("/api/ai/chat", {
        method: "POST",
        token,
        body: JSON.stringify({
          message: text,
          scene,
          task,
        }),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    } catch (e) {
      const baseError = e?.data?.error || e.message || "Chat request failed";
      const detail = e?.data?.detail;
      setError(detail ? `${baseError} (${detail})` : baseError);
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bee-chat-page-root">
      <div className="bee-chat-bg-fixed" aria-hidden>
        <div className="bee-chat-bg-img" />
        <div className="bee-chat-bg-veil" />
      </div>

      <Link to="/tasks" className="weather-nav-next shrink-0">
        Next →
      </Link>

      <div className="bee-chat-page-on-image page-transition">
        <Link to="/dashboard" className="weather-nav-home shrink-0">
          ← Home
        </Link>
        <div className="bee-chat-parrot-lane" aria-hidden>
          <motion.div
            className="bee-chat-parrot-flyer"
            initial={{ x: "110vw" }}
            animate={{ x: ["110vw", "-24vw"], y: [0, -8, 3, -5, 0] }}
            transition={{ duration: 9.4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          >
            <DotLottiePlayer
              className="bee-chat-parrot-player"
              src="/animations/Parrot.lottie"
              autoplay
              loop
              background="transparent"
            />
          </motion.div>
        </div>
        <div className="bee-chat-layout">
          <div className={`bee-chat-popup ${popIn ? "bee-chat-popup--visible" : ""}`}>
            <section className="bee-chat-main-card">
              <div className="bee-chat-head">
                <div>
                  <h1 className="bee-chat-title">
                    Bee Chat
                  </h1>
                  <p className="bee-chat-subtitle">Ask me anything about nature!</p>
                </div>
              </div>

              <div className="bee-chat-quick-actions">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => send(action.prompt)}
                    disabled={busy}
                    className="bee-chat-quick-btn"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="bee-chat-thread-wrap">
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      {m.role === "assistant" && <div className="bee-chat-avatar">🐝</div>}
                      <div
                        className={
                          m.role === "user"
                            ? "bee-chat-bubble bee-chat-bubble--user"
                            : "bee-chat-bubble bee-chat-bubble--assistant"
                        }
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {busy && (
                    <div className="flex items-end gap-2">
                      <div className="bee-chat-avatar">🐝</div>
                      <div className="bee-chat-bubble bee-chat-bubble--assistant">Thinking...</div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              {error && <p className="bee-chat-error">{error}</p>}

              <div className="bee-chat-input-row">
                <input
                  className="bee-chat-input"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                />
                <button type="button" disabled={busy} onClick={() => send()} className="bee-chat-send-btn">
                  Send
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
