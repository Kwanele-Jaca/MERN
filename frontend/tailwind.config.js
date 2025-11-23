/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#0a1a2f",
        gold: "#d4af37",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
}
