import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0.7, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-2xl font-semibold tracking-[0.25em] text-[#38bdf8]"
          aria-hidden="true"
        >
          AVR
        </motion.div>

        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Loading Portfolio...</p>

        <div className="relative h-1 w-[120px] overflow-hidden rounded-full bg-[rgba(148,163,184,0.15)]">
          <motion.div
            className="h-full rounded-full bg-[#38bdf8]"
            animate={{ x: ['-100%', '0%'] }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  )
}
