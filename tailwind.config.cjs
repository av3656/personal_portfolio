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
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        surface: {
          light: 'rgb(var(--ai-navy) / <alpha-value>)',
          dark: 'rgb(var(--ai-navy) / <alpha-value>)',
        },
        'ai-navy': 'rgb(var(--ai-navy) / <alpha-value>)',
        'ai-surface': 'rgb(var(--ai-surface) / <alpha-value>)',
        'ai-card': 'rgb(var(--ai-card) / <alpha-value>)',
        'ai-violet': 'rgb(var(--ai-violet) / <alpha-value>)',
        'ai-violet-glow': 'rgb(var(--ai-violet-glow) / <alpha-value>)',
        'ai-text-primary': 'rgb(var(--ai-text-primary) / <alpha-value>)',
        'ai-text-secondary': 'rgb(var(--ai-text-secondary) / <alpha-value>)',
        'ai-border': 'rgb(148 163 184 / 0.15)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(34,211,238,0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 55%)',
      },
    },
  },
  plugins: [],
}
