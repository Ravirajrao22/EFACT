/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        blue: "var(--blue)",
        orange: "var(--orange)",
        lime: "var(--lime)",
        yellow: "var(--yellow)",
        pink: "var(--pink)",
        violet: "var(--violet)",
        danger: "var(--danger)",
        glitch: "var(--glitch)",
        "glitch-ink": "var(--glitch-ink)",
        "panel-dark": "var(--panel-dark)",
        "panel-text": "#EDEAFF"
      },
      fontFamily: {
        heading: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 var(--ink)",
        "hard-sm": "2.5px 2.5px 0 var(--ink)",
        "hard-lg": "6px 6px 0 var(--ink)",
        "hard-xl": "8px 8px 0 var(--ink)",
        "hard-hover": "6px 6px 0 var(--ink)",
        "hard-active": "1px 1px 0 var(--ink)",
      },
      borderWidth: {
        ink: "2.5px",
      }
    },
  },
  plugins: [],
}

