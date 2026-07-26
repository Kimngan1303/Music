/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        themePrimary: 'var(--theme-primary)',
        themeGlow: 'var(--theme-glow)',
        bgBase: '#030712',
        bgSurface: 'rgba(17, 24, 39, 0.7)',
        bgGlass: 'rgba(255, 255, 255, 0.05)',
        borderGlass: 'rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
