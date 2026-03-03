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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur"
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
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-50/10 bg-white/75 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur dark:bg-slate-900/85"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 text-slate-700 transition hover:border-accent hover:text-accent dark:border-slate-50/15 dark:bg-slate-900/70 dark:text-slate-200"
              aria-label="Close skills modal"
            >
              <FiX size={16} />
            </button>

            <div className="pr-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
                {singleMode ? 'Skill Focus' : 'Category Focus'}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {singleMode ? selectedSkill.name : categoryTitle}
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((skill, idx) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-700 transition-colors hover:text-accent dark:text-slate-200">
                      {skill.name}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">{skill.level}%</span>
                  </div>

                  <div className={`${singleMode ? 'h-4' : 'h-3'} w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80`}>
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
              <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                Click any individual skill badge in the section for a focused view.
              </p>
            )}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
