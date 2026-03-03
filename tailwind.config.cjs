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
          DEFAULT: '#6366F1',
          soft: '#A5B4FC',
        },
        surface: {
          light: '#F9FAFB',
          dark: '#020617',
        },
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(129,140,248,0.25), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.25), transparent 55%)',
      },
    },
  },
  plugins: [],
}

