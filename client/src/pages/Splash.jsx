import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function Splash() {
  const { token, user, loading } = useAuth();
  const [showStartButton, setShowStartButton] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-200 text-slate-600">
        Loading…
      </div>
    );
  }
  if (token) {
    return <Navigate to={user?.role === "teacher" ? "/teacher-dashboard" : "/dashboard"} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <DotLottiePlayer
        src="/animations/Forest%20Morning.lottie"
        autoplay
        loop={false}
        background="transparent"
        className="splash-forest-player absolute inset-0 h-screen w-screen object-fill"
        aria-label="KINDBEE is launching with a forest morning animation."
        onEvent={(event) => {
          if (event === "complete") {
            setShowStartButton(true);
          }
        }}
      />
      <div className="splash-tree-bird" aria-hidden>
        <DotLottiePlayer
          src="/animations/bird.lottie"
          autoplay
          loop
          background="transparent"
          className="splash-tree-bird-player"
        />
      </div>
      {showStartButton && (
        <div className="absolute inset-x-0 bottom-[8dvh] z-10 flex justify-center px-4">
          <Link
            to="/login"
            className="splash-get-started-btn min-w-[12rem] rounded-full px-8 py-3 text-base sm:text-lg"
            aria-label="Get started"
          >
            GET STARTED
          </Link>
        </div>
      )}
    </div>
  );
}
