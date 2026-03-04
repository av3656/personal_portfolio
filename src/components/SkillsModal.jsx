import { useEffect } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export function SkillsModal({ isOpen, modalType, categoryTitle, skills = [], selectedSkill, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const singleMode = modalType === 'single' && selectedSkill
  const categoryMode = modalType === 'category'
  const items = singleMode ? [selectedSkill] : skills

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ai-navy/60 px-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-label={singleMode ? `${selectedSkill.name} skill details` : `${categoryTitle} skills details`}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-ai-border bg-ai-card/75 p-5 shadow-2xl shadow-[0_0_20px_rgba(34,211,238,0.25)] backdrop-blur dark:bg-ai-card/85"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-ai-border bg-ai-card/70 text-ai-text-secondary transition hover:border-ai-violet hover:text-ai-violet-glow dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
              aria-label="Close skills modal"
            >
              <FiX size={16} />
            </button>

            <div className="pr-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
                {singleMode ? 'Skill Focus' : 'Category Focus'}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-ai-text-primary dark:text-ai-text-primary">
                {singleMode ? selectedSkill.name : categoryTitle}
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((skill, idx) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-ai-text-secondary transition-colors hover:text-ai-violet-glow dark:text-ai-text-secondary">
                      {skill.name}
                    </span>
                    <span className="font-semibold text-ai-text-primary dark:text-ai-text-primary">{skill.level}%</span>
                  </div>

                  <div className={`${singleMode ? 'h-4' : 'h-3'} w-full overflow-hidden rounded-full bg-ai-surface/80 dark:bg-ai-surface/80`}>
                    <Motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent via-sky-400 to-emerald-400 shadow-[0_0_20px_rgba(14,165,233,0.35)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: singleMode ? 0.8 : 0.65, delay: singleMode ? 0.05 : idx * 0.12, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {categoryMode && (
              <p className="mt-5 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
                Click any individual skill badge in the section for a focused view.
              </p>
            )}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
