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
          dark: "#050814",
          surface: "#0b112c",
          card: "#121b42",
          border: "#1e2c69",
          cyan: "#00f0ff",
          purple: "#9d4edd",
          emerald: "#10b981",
          rose: "#ff007f",
          gold: "#f59e0b"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace', 'Courier New']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.9)' }
        }
      }
    },
  },
  plugins: [],
}
