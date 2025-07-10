/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'happy-yellow': '#FEF3C7',
        'happy-orange': '#FED7AA',
        'happy-green': '#D1FAE5',
        'happy-blue': '#DBEAFE',
        'happy-purple': '#E0E7FF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}