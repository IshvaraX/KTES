/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#eef0e6",
        surface: "#d6faa4",
        "surface-alt": "#ddf3a6",
        ink: "#16231a",
        "ink-soft": "#4b5a4d",
        "ink-faint": "#7c8a7a",
        accent: "#e2622c",
        "accent-dark": "#b94b1e",
        moss: "#33543d",
        "moss-light": "#eaf0e7",
        gold: "#a97f3f",
        line: "#cad0ba",
        danger: "#c23b2c",
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', "Archivo", "sans-serif"],
        body: ["Archivo", "-apple-system", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,26,0.06), 0 12px 28px rgba(22,35,26,0.08)",
        modal: "0 20px 60px rgba(22,35,26,0.28)",
      },
    },
  },
  plugins: [],
};