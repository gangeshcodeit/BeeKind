import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";
import SoftCard from "./ui/SoftCard.jsx";

function getWeatherIcon(conditionText) {
  const c = String(conditionText || "").toLowerCase();
  if (c.includes("partly") || c.includes("few clouds") || c.includes("scattered clouds")) return "🌤️";
  if (c.includes("clear") || c.includes("sunny")) return "☀️";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) return "🌧️";
  if (c.includes("cloud")) return "☁️";
  return "🌡️";
}

/** Detect rainy / storm conditions for background + KPI theme. */
export function isRainyCondition(conditionText) {
  const c = String(conditionText || "").toLowerCase();
  return (
    c.includes("rain") ||
    c.includes("drizzle") ||
    c.includes("thunder") ||
    c.includes("shower") ||
    c.includes("storm") ||
    c.includes("precip")
  );
}

/** Background art + page mood: clear (sunny default art), rainy, cloudy, scattered. */
export function getForestSkyMood(conditionText) {
  const c = String(conditionText || "").toLowerCase();
  if (isRainyCondition(c)) return "rainy";
  if (
    c.includes("scattered clouds") ||
    c.includes("few clouds") ||
    c.includes("partly cloudy") ||
    c.includes("partly cloud") ||
    c.includes("broken clouds")
  ) {
    return "scattered";
  }
  if (
    c.includes("overcast") ||
    c.includes("cloudy") ||
    c.includes("grey") ||
    c.includes("gray") ||
    (c.includes("cloud") && !c.includes("clear"))
  ) {
    return "cloudy";
  }
  return "clear";
}

/** `tone="forest"` — glass card + KPI tiles on the Weather page background. */
export default function WeatherWidget({ autoLocate = true, tone = "default", onForestWeatherChange }) {
  const forest = tone === "forest";
  const { token } = useAuth();
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const rainy = Boolean(data && forest && isRainyCondition(data.weatherCondition));

  useEffect(() => {
    if (!forest || !onForestWeatherChange) return;
    if (!data?.weatherCondition) {
      onForestWeatherChange({ skyMood: "clear" });
      return;
    }
    onForestWeatherChange({ skyMood: getForestSkyMood(data.weatherCondition) });
  }, [forest, data?.weatherCondition, onForestWeatherChange]);

  useEffect(() => {
    if (!autoLocate || coords || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setError("Please allow location access to load weather, or search by city.");
      }
    );
  }, [autoLocate, coords]);

  useEffect(() => {
    if (!coords || !token) return;
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError("");
      try {
        const q = new URLSearchParams({ lat: String(coords.lat), lon: String(coords.lon) });
        const response = await apiFetch(`/api/weather?${q.toString()}`, { token });
        if (!cancelled) setData(response);
      } catch (e) {
        if (!cancelled) setError(e.data?.error || e.message || "Could not load weather.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [coords, token]);

  function retry() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setError("Location permission is needed for this weather widget. You can search by city.");
      }
    );
  }

  async function searchByCity(e) {
    e.preventDefault();
    const cityName = city.trim();
    if (!cityName || !token) return;
    setBusy(true);
    setError("");
    setData(null);
    try {
      const q = new URLSearchParams({ city: cityName });
      const response = await apiFetch(`/api/weather?${q.toString()}`, { token });
      setData(response);
    } catch (e2) {
      setError(e2.data?.error || e2.message || "Could not load weather for city.");
    } finally {
      setBusy(false);
    }
  }

  const locationLine =
    data?.location?.city || data?.location?.country
      ? `${data.location?.city || ""}${data.location?.country ? `, ${data.location.country}` : ""}`
      : "";

  const kpiLabel = rainy ? "text-sky-950/75" : "text-amber-900/65";
  const kpiValue = rainy ? "text-sky-950" : "text-amber-950";
  const kpiHint = rainy ? "text-sky-800/65" : "text-amber-900/55";

  return (
    <SoftCard
      accent={forest ? "sunshine" : "sky"}
      className={`space-y-4 ${forest ? `weather-panel ${rainy ? "weather-panel--rainy" : ""}` : ""}`}
    >
      <h3
        className={`font-display text-2xl font-bold ${forest ? "weather-on-image-title text-white" : "text-sky-50"}`}
      >
        Weather Garden
      </h3>

      {busy && (
        <p className={`text-base ${forest ? "font-semibold text-white drop-shadow-md" : "text-sky-100/85"}`}>
          Checking your sky…
        </p>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-300/50 bg-rose-950/50 p-3 text-base text-rose-50 backdrop-blur-sm">
          {error}
          <button type="button" onClick={retry} className="ml-3 rounded-xl bg-rose-200/25 px-3 py-1 text-sm font-bold text-rose-100">
            Retry
          </button>
        </div>
      )}

      <form onSubmit={searchByCity} className="flex flex-wrap gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Or enter city (e.g. Mumbai)"
          className="leaf-input mt-0 min-w-[12rem] flex-1 py-2 text-base"
        />
        <button type="submit" className="hive-button px-4 py-2 text-base" disabled={busy || !city.trim()}>
          Search
        </button>
      </form>

      {data && forest && locationLine && (
        <p className="weather-city-line text-left text-lg font-extrabold uppercase tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] sm:text-xl">
          📍 {locationLine}
        </p>
      )}

      {data && forest && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`weather-kpi flex flex-col justify-center px-3 py-3 sm:min-h-[7.5rem] ${rainy ? "weather-kpi--rainy" : ""}`}>
              <p className={`text-[0.7rem] font-extrabold uppercase tracking-wider ${kpiLabel}`}>Temperature</p>
              <p className={`font-display text-4xl font-black tabular-nums leading-tight ${kpiValue}`}>
                {Math.round(data.temperature)}°C
              </p>
              <p className={`mt-1 text-xs font-semibold ${kpiHint}`}>Right now</p>
            </div>
            <div className={`weather-kpi flex flex-col justify-center px-3 py-3 sm:min-h-[7.5rem] ${rainy ? "weather-kpi--rainy" : ""}`}>
              <p className={`text-[0.7rem] font-extrabold uppercase tracking-wider ${kpiLabel}`}>Sky</p>
              <p className={`font-display text-2xl font-black leading-tight ${kpiValue}`}>
                {getWeatherIcon(data.weatherCondition)}{" "}
                <span className="text-lg font-bold">{data.weatherCondition}</span>
              </p>
            </div>
            <div className={`weather-kpi flex flex-col justify-center px-3 py-3 sm:min-h-[7.5rem] ${rainy ? "weather-kpi--rainy" : ""}`}>
              <p className={`text-[0.7rem] font-extrabold uppercase tracking-wider ${kpiLabel}`}>Air quality</p>
              <p className={`font-display text-3xl font-black tabular-nums ${kpiValue}`}>{data.aqiLevel}</p>
              <p className={`mt-1 text-xs font-semibold ${kpiHint}`}>AQI level</p>
            </div>
          </div>

          <p
            className={`weather-suggestion-on-image p-4 text-base leading-snug sm:text-[1.05rem] ${rainy ? "weather-suggestion--rainy" : ""}`}
          >
            <span className="mr-2 text-lg" aria-hidden>
              💡
            </span>
            {data.suggestion}
          </p>
        </div>
      )}

      {data && !forest && (
        <div className="space-y-3 text-lg text-sky-50">
          <p className="text-base text-sky-100/85">
            {data.location?.city}
            {data.location?.country ? `, ${data.location.country}` : ""}
          </p>
          <p className="text-3xl font-black">
            {getWeatherIcon(data.weatherCondition)} {Math.round(data.temperature)}°C
          </p>
          <p>
            Condition: <span className="font-bold">{data.weatherCondition}</span>
          </p>
          <p>
            AQI: <span className="font-bold">{data.aqiLevel}</span>
          </p>
          <p className="rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-3 text-base text-amber-50">
            💡 {data.suggestion}
          </p>
        </div>
      )}

      {!busy && !error && !data && (
        <button type="button" onClick={retry} className="hive-button">
          Use my location
        </button>
      )}
    </SoftCard>
  );
}
