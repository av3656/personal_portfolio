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
      <div className="pointer-events-auto w-56 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-ai-card">
        {/* Heading text intentionally removed to keep layout minimal while preserving spacing */}
        <div className="h-4" />

        <div className="relative overflow-hidden rounded-2xl bg-ai-card/5 p-3 dark:bg-ai-surface/5">
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
                    ? 'bg-[rgba(34,211,238,0.08)] text-accent font-semibold shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                    : 'text-ai-text-secondary hover:text-ai-violet-glow dark:text-ai-text-secondary dark:hover:text-ai-violet-glow'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-accent' : 'bg-ai-text-secondary/60 dark:bg-ai-text-secondary/80'
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
