import { motion } from "framer-motion";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.26, delay: 0.1 },
  },
};

/** @typedef {"welcome" | "progress"} IntroPopupVariant */

/**
 * @param {{
 *   isArrived: boolean;
 *   onStart: () => void;
 *   onChat: () => void;
 *   locked?: boolean;
 *   variant?: IntroPopupVariant;
 *   studentName?: string;
 * }} props
 */
export default function Popup({
  isArrived,
  onStart,
  onChat,
  locked = false,
  variant = "welcome",
  studentName = "friend",
}) {
  const isProgress = variant === "progress";
  const firstName = String(studentName || "friend").trim().split(/\s+/)[0] || "friend";
  const title = `🐝 Hey ${firstName}!`;
  const subtitle = isProgress ? "You are doing well very good!" : "Let's start or chat with me!";
  const primaryLabel = isProgress ? "Continue" : "Let's Start";

  return (
    <motion.div className="intro-bee-popup-overlay" variants={popupVariants} initial="hidden" animate={isArrived ? "shown" : "hidden"}>
      <div className="intro-bee-popup" role="dialog" aria-live="polite" aria-label="Bee intro notification">
        <p className="intro-bee-popup__title">{title}</p>
        <p className="intro-bee-popup__sub">{subtitle}</p>
        <div className="intro-bee-popup__actions">
          <button type="button" onClick={onStart} disabled={locked} className="hive-button disabled:opacity-60">
            {primaryLabel}
          </button>
          <button type="button" onClick={onChat} disabled={locked} className="hive-button disabled:opacity-60">
            Chat with me!
          </button>
        </div>
      </div>
    </motion.div>
  );
}
