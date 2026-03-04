import { motion } from 'framer-motion'
import { Resume } from '../components/sections/Resume'
import { usePageMeta } from '../hooks/usePageMeta'

const highlights = [
  'Backend-focused engineering projects using Java and structured API design.',
  'Strong base in data structures, algorithms, and system-level problem solving.',
  'Experience with collaboration tools and cloud fundamentals for deployment readiness.',
]

export function ResumePage() {
  usePageMeta('Resume', 'Resume preview and download for Aman Verma.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Resume</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ai-text-primary sm:text-4xl dark:text-ai-text-primary">
            Snapshot of education, skills, and project impact.
          </h1>
          <p className="max-w-2xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            You can preview and download my latest resume below, along with a concise summary of core
            strengths and current focus areas.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-ai-border bg-ai-card/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
        >
          <h2 className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">Key Highlights</h2>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <Resume />
      </div>
    </section>
  )
}
