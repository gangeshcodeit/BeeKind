import { motion } from "framer-motion";

export default function SpeechBubble({ text, className = "", delay = 0, align = "left" }) {
  const tailClass =
    align === "right"
      ? "right-6 border-l-transparent border-r-transparent border-t-white/95"
      : "left-6 border-l-transparent border-r-transparent border-t-white/95";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 20, delay }}
      className={`relative rounded-2xl border border-white/60 bg-white/95 px-4 py-2 text-sm font-bold text-amber-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ${className}`}
      role="status"
      aria-live="polite"
    >
      {text}
      <span
        className={`absolute -bottom-2 h-0 w-0 border-l-8 border-r-8 border-t-8 ${tailClass}`}
        aria-hidden
      />
    </motion.div>
  );
}
