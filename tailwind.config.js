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
        'accent-orange': '#ff6b35',
        'gradient-start': '#1a1a2e',
        'gradient-end': '#16213e',
      },
      backgroundImage: {
        'gradient-portfolio': 'linear-gradient(to right, #1a1a2e, #16213e, #0f1419)',
      },
    },
  },
  plugins: [],
}


