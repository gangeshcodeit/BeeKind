/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        honey: { DEFAULT: "#f5a623", dark: "#c77f0a" },
        hive: { DEFAULT: "#1e293b", light: "#334155" },
        /* Kid-friendly accents (use with /opacity) */
        play: {
          coral: "#fb7185",
          sunshine: "#fbbf24",
          sky: "#38bdf8",
          grape: "#a78bfa",
          mint: "#5eead4",
          berry: "#f472b6",
        },
      },
      fontFamily: {
        display: ['"Fredoka"', "Trebuchet MS", "system-ui", "sans-serif"],
        sans: ['"Nunito"', "Trebuchet MS", "Segoe UI", "system-ui", "sans-serif"],
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0) rotate(-4deg)" },
          "50%": { transform: "translate(6px, -10px) rotate(4deg)" },
        },
        popIn: {
          from: { opacity: "0", transform: "scale(0.94) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmerBar: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        meshShift: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.9)" },
          "50%": { opacity: "0.95", transform: "scale(1.05)" },
        },
      },
      animation: {
        "float-slow": "floatSlow 7s ease-in-out infinite",
        pop: "popIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer-bar": "shimmerBar 2.2s ease-in-out infinite",
        "mesh-pulse": "meshShift 10s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
