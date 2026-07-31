import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bee from "./Bee.jsx";
import Popup from "./Popup.jsx";

const beeVariants = {
  hidden: {
    x: -720,
    y: 0,
    rotate: -8,
    scale: 1,
    opacity: 1,
  },
  flyToCenter: {
    x: [-720, -520, -320, -150, -40, 0],
    y: [0, -7, 5, -6, 3, 0],
    rotate: [-8, 4, -3, 3, -2, 0],
    scale: [1, 1.01, 1, 1.04, 1.08, 1],
    transition: {
      delay: 0.3,
      duration: 2.2,
      ease: [0.18, 0.8, 0.22, 1],
      times: [0, 0.16, 0.34, 0.56, 0.8, 1],
    },
  },
  hover: {
    // Continuous glide loop (no "rest" hold between cycles).
    y: [0, -2.2, 1, -1.4, 0.4],
    x: [0, 3, 6, 9, 12],
    rotate: [0, 2.2, -1.6, 1.2, -0.8],
    scale: [1, 1.01, 1.005, 1.01, 1.005],
    transition: {
      duration: 3.4,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    },
  },
  exitRight: {
    x: [0, 180, 360, 620, 920],
    y: [0, -5, 6, -8, -2],
    rotate: [0, 6, -5, 8, 12],
    scale: [1, 1.03, 1.02, 1, 0.95],
    opacity: [1, 1, 1, 1, 1],
    transition: {
      duration: 1.05,
      ease: [0.2, 0.7, 0.24, 1],
      times: [0, 0.25, 0.5, 0.78, 1],
    },
  },
};

const WELCOME_DONE_KEY = "beekind_intro_welcome_done";
const PROGRESS_SESSION_KEY = "beekind_intro_progress_session_done";

function markIntroConsumed(variant) {
  if (typeof window === "undefined") return;
  if (variant === "welcome") {
    window.localStorage.setItem(WELCOME_DONE_KEY, "1");
  } else if (variant === "progress") {
    window.sessionStorage.setItem(PROGRESS_SESSION_KEY, "1");
  }
}

/**
 * @param {{ variant?: "welcome" | "progress"; studentName?: string }} props
 */
export default function IntroAnimation({ variant = "welcome", studentName = "friend" }) {
  const navigate = useNavigate();
  const [isArrived, setIsArrived] = useState(false);
  const [phase, setPhase] = useState("flyToCenter");
  const [targetRoute, setTargetRoute] = useState("");

  useEffect(() => {
    if (!targetRoute || phase !== "done") return;
    navigate(targetRoute);
  }, [targetRoute, phase, navigate]);

  function goScenes() {
    if (phase !== "hover") return;
    markIntroConsumed(variant);
    setTargetRoute("/scenes");
    setIsArrived(false);
    setPhase("exitRight");
  }

  function goBee() {
    if (phase !== "hover") return;
    markIntroConsumed(variant);
    setTargetRoute("/bee");
    setIsArrived(false);
    setPhase("exitRight");
  }

  return (
    <div className="absolute inset-0 z-[12] overflow-hidden">
      <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <Bee
          sizeClass="h-36 w-36 sm:h-40 sm:w-40"
          variants={beeVariants}
          initial="hidden"
          animate={phase}
          onAnimationComplete={() => {
            if (phase === "flyToCenter") {
              setIsArrived(true);
              setPhase("hover");
            } else if (phase === "exitRight") {
              setPhase("done");
            }
          }}
        />
      </div>

      <Popup
        variant={variant}
        studentName={studentName}
        isArrived={isArrived && phase !== "exitRight" && phase !== "done"}
        locked={phase === "exitRight"}
        onStart={goScenes}
        onChat={goBee}
      />
    </div>
  );
}
