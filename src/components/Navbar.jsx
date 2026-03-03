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
          className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm ring-1 ring-slate-900/5 backdrop-blur dark:bg-slate-50/5 dark:text-slate-200 dark:ring-slate-50/10"
        >
          Aman Verma
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-200">
          {pageLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors hover:text-accent ${isActive(link.to) ? 'text-accent' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-50/15 dark:bg-slate-900/60 dark:text-slate-100"
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
