import { motion } from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

export default function Bee({
  className = "",
  label = "Bee",
  sizeClass = "h-[120px] w-[120px]",
  glowClass = "drop-shadow-[0_0_14px_rgba(250,204,21,0.55)]",
  style,
  variants,
  initial,
  animate,
  transition,
  onAnimationComplete,
}) {
  return (
    <motion.div
      aria-label={label}
      className={`relative grid place-items-center rounded-full ${sizeClass} ${glowClass} ${className}`}
      style={style}
      variants={variants}
      initial={initial}
      animate={animate}
      transition={transition}
      onAnimationComplete={onAnimationComplete}
    >
      <span className="pointer-events-none absolute inset-0 z-0 grid place-items-center text-4xl">🐝</span>
      <DotLottiePlayer
        className="bee-dotlottie-player relative z-[1]"
        src="/animations/bee.lottie"
        autoplay
        loop
        background="transparent"
        style={{ width: "100%", height: "100%" }}
      />
      <span
        className="pointer-events-none absolute -bottom-1 h-2 w-7 rounded-full bg-black/25 blur-[2px]"
        aria-hidden
      />
    </motion.div>
  );
}
