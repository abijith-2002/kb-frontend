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
        }
      }
    },
  },
  plugins: [],
};
