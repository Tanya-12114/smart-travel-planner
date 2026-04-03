/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:        "#0f1117",          // near-black (unchanged — text)
        paper:      "#f7f8fa",          // cool off-white (was warm cream)
        sand:       "#e4e7ed",          // cool light grey border (was warm sand)
        accent:     "#2563eb",          // clean blue — replaces rust/orange
        "accent-lt":"#eff4ff",          // very light blue tint
        "accent-dk":"#1d4ed8",          // darker blue for hover
        muted:      "#374151",          // neutral grey
        cream:      "#ffffff",          // pure white cards (was warm cream)
        forest:     "#166534",
        "forest-lt":"#16a34a",
      },
      fontFamily: {
        // Normal, highly readable sans-serif stack
        display: ["'Roboto'", "system-ui", "sans-serif"],
        mono:    ["'Roboto Mono'", "monospace"],
        ui:      ["'Roboto'", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":    "fadeUp 0.35s ease both",
        "pin-drop":   "pinDrop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        pinDrop: {
          from: { opacity: 0, transform: "translate(-50%, -200%)" },
          to:   { opacity: 1, transform: "translate(-50%, -100%)" },
        },
      },
    },
  },
  plugins: [],
};