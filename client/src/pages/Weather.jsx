import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import WeatherWidget from "../components/WeatherWidget.jsx";

/** @typedef {"clear" | "rainy" | "cloudy" | "scattered"} SkyMood */

const MOOD_COPY = {
  clear: {
    title: "Sunny forest sky",
    subtitle: "Your forecast sits right on the path—scroll for more.",
    pill: "🌤️ Weather",
    pillClass: "border-white/50 bg-amber-400/35 text-amber-50",
  },
  rainy: {
    title: "Rainy forest magic",
    subtitle: "Stormy skies and glowing flowers—your forecast matches the mood.",
    pill: "🌧️ Rain",
    pillClass: "border-sky-300/60 bg-sky-900/40 text-sky-100",
  },
  cloudy: {
    title: "Cloudy forest calm",
    subtitle: "Soft grey skies over the river—flowers still glow below.",
    pill: "☁️ Cloudy",
    pillClass: "border-slate-300/55 bg-slate-800/45 text-slate-100",
  },
  scattered: {
    title: "Sunbeams & soft clouds",
    subtitle: "Light breaks through—your day is partly bright, partly misty.",
    pill: "⛅ Mixed sky",
    pillClass: "border-amber-200/55 bg-amber-500/30 text-amber-50",
  },
};

export default function Weather() {
  /** @type {[SkyMood, import('react').Dispatch<import('react').SetStateAction<SkyMood>>]} */
  const [skyMood, setSkyMood] = useState(/** @type {SkyMood} */ ("clear"));

  const onForestWeatherChange = useCallback(({ skyMood: m }) => {
    setSkyMood(m && MOOD_COPY[m] ? m : "clear");
  }, []);

  const copy = MOOD_COPY[skyMood] ?? MOOD_COPY.clear;

  const bgImgClass =
    skyMood === "rainy"
      ? "weather-page-bg-img--rainy"
      : skyMood === "cloudy"
        ? "weather-page-bg-img--cloudy"
        : skyMood === "scattered"
          ? "weather-page-bg-img--scattered"
          : "";

  const bgVeilClass =
    skyMood === "rainy"
      ? "weather-page-bg-veil--rainy"
      : skyMood === "cloudy"
        ? "weather-page-bg-veil--cloudy"
        : skyMood === "scattered"
          ? "weather-page-bg-veil--scattered"
          : "";

  return (
    <div className="weather-page-root">
      <div className="weather-page-bg-fixed" aria-hidden>
        <div className={`weather-page-bg-img ${bgImgClass}`} />
        <div className={`weather-page-bg-veil ${bgVeilClass}`} />
      </div>

      <Link to="/quiz" className="weather-nav-next shrink-0">
        Next →
      </Link>

      <div className="weather-page-on-image">
        <div className="flex w-full flex-wrap items-start justify-between gap-3">
          <Link to="/dashboard" className="weather-nav-home shrink-0">
            ← Home
          </Link>
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide shadow-md backdrop-blur-sm ${copy.pillClass}`}
          >
            {copy.pill}
          </span>
        </div>

        <div className="mt-2">
          <h1 className="weather-on-image-title font-display text-[clamp(1.5rem,4.5vw,2rem)] font-bold leading-tight text-white">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-xl text-sm font-semibold text-amber-50 drop-shadow-md sm:text-base">{copy.subtitle}</p>
        </div>

        <WeatherWidget tone="forest" onForestWeatherChange={onForestWeatherChange} />
      </div>
    </div>
  );
}
