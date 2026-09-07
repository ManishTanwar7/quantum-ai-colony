/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          dark: "#f8fafc",
          surface: "#ffffff",
          card: "#ffffff",
          border: "#e2e8f0",
          cyan: "#0284c7",
          purple: "#7c3aed",
          emerald: "#10b981",
          rose: "#e11d48",
          gold: "#d97706"
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'Courier New']
      }
    },
  },
  plugins: [],
}
