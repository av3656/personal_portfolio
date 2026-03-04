import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const pageLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar({ theme, onToggleTheme }) {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 backdrop-blur-xl">
        <Link
          to="/"
          className="rounded-full bg-ai-card/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ai-text-secondary shadow-sm ring-1 ring-ai-border backdrop-blur dark:bg-ai-surface/5 dark:text-ai-text-secondary dark:ring-ai-border"
        >
          Aman Verma
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-accent md:flex dark:text-accent">
          {pageLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors hover:text-ai-violet-glow ${isActive(link.to) ? 'text-accent' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ai-border bg-ai-card/70 text-ai-text-secondary shadow-sm transition hover:border-ai-violet hover:text-ai-violet-glow dark:border-ai-border dark:bg-ai-card/60 dark:text-ai-text-primary"
            aria-label="Toggle color theme"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </motion.span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}
