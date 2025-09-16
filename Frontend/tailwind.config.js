/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Modern dark UI with emerald accent (#479470) and accessible contrasts
        app: {
          // App background (unchanged)
          bg: "#232628",

          // Primary (used for links and subtle highlights) - cool neutral that complements emerald
          primary: "#93C5FD",          // sky-300
          primaryDark: "#60A5FA",      // sky-400
          onprimary: "#0B1220",

          // Secondary (pills, subtle accents) - desaturated teal to pair with emerald
          secondary: "#5FA28B",        // toned teal
          secondaryDark: "#4A8A77",
          onsecondary: "#0C1612",

          // Accent (CTAs) - requested emerald hue
          accent: "#479470",           // requested accent
          accentDark: "#38765A",       // darker for hover/focus
          onaccent: "#F2FBF7",         // light on-emerald text

          // On-background text
          onbg: "#E5E7EB",             // gray-200
          "onbg-muted": "#9AA5B1",     // slate-400-ish tuned

          // Surfaces/cards with layered elevation (cool neutrals to match bg)
          surface: "#1E2325",          // slightly lighter than bg for inputs
          surfaceAlt: "#1A1F21",       // section container
          surfaceMuted: "#2A2F31",     // card container

          // Borders and dividers (cool slate)
          border: "#3B4548"            // cool gray border
        }
      },
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      }
    },
  },
  plugins: [],
};
