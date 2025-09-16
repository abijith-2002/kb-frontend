/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Harmonious palette built around a deep slate background.
        // Background stays unchanged (app.bg).
        app: {
          bg: "#2C2F37",             // Background (unchanged)

          // Brand/primary elements (links, key highlights)
          primary: "#7DD3FC",        // Sky 300
          primaryDark: "#38BDF8",    // Sky 400 (hover)
          onprimary: "#0B1220",      // Text on primary

          // Secondary elements (subtle highlights, outlines)
          secondary: "#A7F3D0",      // Emerald 200
          secondaryDark: "#34D399",  // Emerald 400 (hover)
          onsecondary: "#073B2A",    // Text on secondary

          // Accent and interactive (CTA buttons)
          accent: "#539769",         // New accent (green)
          accentDark: "#457E57",     // Darker shade for hover/active
          onaccent: "#0F1913",       // Text on accent (dark green-tinted on-light)

          // Text colors for on-background content
          onbg: "#E5E7EB",           // Gray 200 (primary text on bg)
          "onbg-muted": "#A1A1AA",   // Zinc 400 (muted text)

          // Surfaces and borders
          surface: "#343844",        // Slightly raised surface
          border: "#525866"          // Border on dark surfaces
        }
      },
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      }
    },
  },
  plugins: [],
};
