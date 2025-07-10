/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'happy-yellow': '#FEF3C7',
        'happy-orange': '#FED7AA',
        'happy-green': '#D1FAE5',
        'happy-blue': '#DBEAFE',
        'happy-purple': '#E0E7FF',
        'happy-yellow-dark': '#92400E',
        'happy-orange-dark': '#9A3412',
        'happy-green-dark': '#047857',
        'happy-blue-dark': '#1E40AF',
        'happy-purple-dark': '#5B21B6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}