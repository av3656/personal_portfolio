import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest)
  })

  if (location.pathname !== '/') return null

  const handleClick = (id) => {
    onSectionClick?.(id)
  }

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
  const totalSections = Math.max(sectionIds.length, 1)
  const segmentSize = totalSections > 1 ? 1 / (totalSections - 1) : 1

  const getDotFill = (index) => {
    const start = index * segmentSize
    const fill = (clampedProgress - start) / segmentSize
    return Math.max(0, Math.min(1, fill))
  }

  return (
    <div className="pointer-events-none fixed left-4 top-24 z-20 hidden select-none md:block">
      <div className="sidebar-gradient-border pointer-events-auto relative w-56 space-y-4 rounded-2xl bg-transparent p-6 shadow-[0_0_25px_rgba(56,189,248,0.08),0_0_60px_rgba(56,189,248,0.04)]">
        {/* Heading text intentionally removed to keep layout minimal while preserving spacing */}
        <div className="h-4" />

        <div className="relative overflow-hidden rounded-2xl bg-transparent p-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-[#38bdf8]"
            >
              {(activeSection ?? 'intro').toUpperCase()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col gap-1 text-xs">
          <div
            className="absolute bottom-[10px] top-[10px] w-px bg-[rgba(56,189,248,0.15)]"
            style={{ left: '11px' }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-[10px] w-px origin-top bg-[#38bdf8]"
            style={{
              left: '11px',
              height: 'calc(100% - 20px)',
              scaleY: clampedProgress,
            }}
            aria-hidden="true"
          />

          {sectionIds.map((id) => {
            const section = sections.find((item) => item.id === id)
            if (!section) return null
            const isActive = activeSection === id
            const fillProgress = getDotFill(sectionIds.indexOf(id))
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleClick(id)}
                className={`flex items-center gap-2 rounded-full px-2 py-1 text-left capitalize transition-all duration-[250ms] ease-in-out ${
                  isActive
                    ? 'rounded-[8px] bg-[rgba(56,189,248,0.06)] text-[#38bdf8] font-medium'
                    : 'rounded-[8px] text-[rgba(148,163,184,0.85)] hover:bg-[rgba(56,189,248,0.08)] hover:text-[#38bdf8]'
                }`}
              >
                <span className="relative h-1.5 w-1.5 rounded-full bg-[rgba(148,163,184,0.4)]" aria-hidden="true">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[#38bdf8]"
                    style={{ scale: fillProgress }}
                  />
                  {isActive ? (
                    <span className="absolute inset-0 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  ) : null}
                </span>
                <span className={isActive ? 'uppercase tracking-[0.18em]' : ''}>{section.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
