/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cursor-bg': '#0d1117',
        'cursor-surface': '#161b22',
        'cursor-border': '#30363d',
        'cursor-text': '#c9d1d9',
        'cursor-text-muted': '#8b949e',
      },
    },
  },
  plugins: [],
}


