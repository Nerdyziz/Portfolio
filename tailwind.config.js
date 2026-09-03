/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cloud-white": "#FAFAFA",
        "alabaster": "#F8F6F8",
        "surface-glass": "rgba(255, 255, 255, 0.75)",
        "surface-card": "#FFFFFF",
        "sun-gold": "#F5A623",
        "champagne": "#D4AF37",
        "warm-bronze": "#835500",
        "obsidian": "#1B1B1D",
        "titanium": "#5C5E62",
        "border-subtle": "rgba(229, 229, 234, 0.8)",
        "border-gold": "rgba(245, 166, 35, 0.4)"
      },
      fontFamily: {
        "display": ["'Playfair Display'", "serif"],
        "sans": ["Inter", "sans-serif"],
        "mono": ["'JetBrains Mono'", "monospace"],
        "label": ["'Space Mono'", "monospace"],
      },
      boxShadow: {
        "glass": "0 20px 40px -15px rgba(0, 0, 0, 0.04), 0 0 15px rgba(245, 166, 35, 0.08)",
        "gold-glow": "0 0 25px rgba(245, 166, 35, 0.25)",
        "card-subtle": "0 10px 30px -5px rgba(0, 0, 0, 0.03)"
      }
    },
  },
  plugins: [],
}
