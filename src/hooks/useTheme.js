import { useEffect, useState } from 'react'

const THEME_KEY = 'portfolio-theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(theme === 'light' ? 'dark' : 'light')
    root.classList.add(theme)
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
  }
}

