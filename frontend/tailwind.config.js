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
          dark: "#ffffff",
          surface: "#ffffff",
          card: "#f9fafb",
          border: "#e5e7eb",
          cyan: "#0284c7",
          purple: "#6b7280",
          emerald: "#15803d",
          rose: "#dc2626",
          gold: "#b45309"
        },
        office: {
          bg: "#ffffff",
          panel: "#f9fafb",
          muted: "#f3f4f6",
          border: "#e5e7eb",
          darkborder: "#111827",
          heading: "#1f2937",
          text: "#111827",
          subtext: "#4b5563"
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
