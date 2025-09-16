/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        kavia: {
          orange: "#E87A41",
          dark: "#1A1A1A"
        },
        app: {
          bg: "#2C2F37",            // Background
          accent: "#3A455D",        // Accent (buttons / highlights)
          onbg: "#C5C5C5",          // On-background text
          onaccent: "#DCDCDC"       // On-accent text
        }
      },
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      }
    },
  },
  plugins: [],
};
