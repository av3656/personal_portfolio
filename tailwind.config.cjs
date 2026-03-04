/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'Inter', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#22d3ee',
          soft: '#06b6d4',
        },
        surface: {
          light: '#020617',
          dark: '#020617',
        },
        'ai-navy': '#020617',
        'ai-surface': '#0f172a',
        'ai-card': '#1e293b',
        'ai-violet': '#22d3ee',
        'ai-violet-glow': '#67e8f9',
        'ai-text-primary': '#e2e8f0',
        'ai-text-secondary': '#94a3b8',
        'ai-border': 'rgba(148,163,184,0.15)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(34,211,238,0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 55%)',
      },
    },
  },
  plugins: [],
}
