import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export function Sidebar({ activeSection, sectionIds = [], onSectionClick }) {
  const location = useLocation()

  if (location.pathname !== '/') return null

  const handleClick = (id) => {
    onSectionClick?.(id)
  }

  return (
    <div className="pointer-events-none fixed left-4 top-24 z-30 hidden select-none md:block">
      <div className="pointer-events-auto space-y-4 rounded-3xl bg-white/60 p-3 shadow-xl ring-1 ring-slate-900/5 backdrop-blur-xl dark:bg-slate-900/60 dark:ring-slate-50/10">
        {/* Heading text intentionally removed to keep layout minimal while preserving spacing */}
        <div className="h-4" />

        <div className="relative overflow-hidden rounded-2xl bg-slate-900/5 p-3 dark:bg-slate-50/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-accent"
            >
              {(activeSection ?? 'intro').toUpperCase()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          {sectionIds.map((id) => {
            const section = sections.find((item) => item.id === id)
            if (!section) return null
            const isActive = activeSection === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleClick(id)}
                className={`flex items-center gap-2 rounded-full px-2 py-1 text-left capitalize transition-colors ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-accent' : 'bg-slate-400/60 dark:bg-slate-500/80'
                  }`}
                  aria-hidden="true"
                />
                <span className={isActive ? 'uppercase tracking-[0.18em]' : ''}>{section.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
