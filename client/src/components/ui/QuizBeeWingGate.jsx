import { useEffect, useState } from "react";

/**
 * Invisible left spacer + glowing trail connector + speech-bubble card.
 */
export default function QuizBeeWingGate({ children }) {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setPop(true), 90);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="quiz-landing-stage">
      <div className="quiz-landing-stage__bee-wrap" aria-hidden>
        <div className="quiz-landing-stage__bee-spacer" />
      </div>

      <div className="quiz-landing-trail" aria-hidden>
        <svg className="quiz-landing-trail__svg" viewBox="0 0 140 36" preserveAspectRatio="none">
          <defs>
            <linearGradient id="quizTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
            </linearGradient>
            <filter id="quizTrailGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="quiz-landing-trail__path"
            d="M2,22 C38,8 92,30 138,14"
            fill="none"
            stroke="url(#quizTrailGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#quizTrailGlow)"
          />
        </svg>
      </div>

      <div
        className={`quiz-speech-popup ${pop ? "quiz-speech-popup--visible" : ""}`}
        role="dialog"
        aria-label="Forest quiz message"
        aria-live="polite"
      >
        <span className="quiz-speech-popup__tail" aria-hidden />
        <div className="quiz-speech-popup__surface">{children}</div>
      </div>
    </div>
  );
}
