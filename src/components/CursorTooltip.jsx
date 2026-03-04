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
          className="pointer-events-none fixed left-0 top-0 z-[80] rounded-xl border border-ai-border bg-ai-card/75 px-3 py-1.5 text-xs font-medium text-ai-text-secondary shadow-lg shadow-slate-900/10 backdrop-blur dark:border-ai-border dark:bg-ai-card/80 dark:text-ai-text-primary"
        >
          {text}
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
