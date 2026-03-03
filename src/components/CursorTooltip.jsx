import { AnimatePresence, motion as Motion } from 'framer-motion'

export function CursorTooltip({ visible, x, y, text }) {
  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, x: x + 15, y: y + 15 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            opacity: { duration: 0.16, ease: 'easeOut' },
            scale: { duration: 0.16, ease: 'easeOut' },
            x: { type: 'spring', stiffness: 420, damping: 32, mass: 0.35 },
            y: { type: 'spring', stiffness: 420, damping: 32, mass: 0.35 },
          }}
          className="pointer-events-none fixed left-0 top-0 z-[80] rounded-xl border border-slate-900/10 bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-slate-50/15 dark:bg-slate-900/80 dark:text-slate-100"
        >
          {text}
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
