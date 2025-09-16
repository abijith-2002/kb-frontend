/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Subtle, modern, and accessible background-focused palette.
        // Keep accents and text readable with high contrast.
        app: {
          // Primary page background: updated to #232628 per request
          bg: "#232628",

          // Keep existing accent feel but aligned to modern hues
          primary: "#7DD3FC",          // sky-300 (links & primary highlights)
          primaryDark: "#38BDF8",      // sky-400 (hover)
          onprimary: "#0B1220",

          // Secondary (pills / subtle highlights)
          secondary: "#A7F3D0",        // emerald-200
          secondaryDark: "#34D399",    // emerald-400
          onsecondary: "#052018",

          // Accent for CTAs (preserved tone, slightly tuned for better contrast)
          accent: "#22C55E",           // green-500
          accentDark: "#16A34A",       // green-600
          onaccent: "#06210F",

          // On-background text
          onbg: "#E5E7EB",             // gray-200
          "onbg-muted": "#94A3B8",     // slate-400

          // Surfaces/cards with layered elevation
          surface: "#111827",          // gray-900 (base surface)
          surfaceAlt: "#0B1220",       // deeper overlay surface for sections
          surfaceMuted: "#1F2937",     // gray-800 (muted containers)

          // Borders and dividers tuned for dark backgrounds
          border: "#334155"            // slate-600
        }
      },
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      }
    },
  },
  plugins: [],
};
