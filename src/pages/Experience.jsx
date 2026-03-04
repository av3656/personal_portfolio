import { motion } from 'framer-motion'
import { Experience } from '../components/sections/Experience'
import { usePageMeta } from '../hooks/usePageMeta'

const experienceHighlights = [
  {
    title: 'Responsibilities',
    points: ['Translate requirements into implementation tasks', 'Review code and improve quality gates', 'Document architecture decisions'],
  },
  {
    title: 'Achievements',
    points: ['Improved clarity in backend module structure', 'Practiced production-like issue investigation', 'Delivered maintainable project iterations'],
  },
  {
    title: 'Skills Applied',
    points: ['Java and DSA fundamentals', 'API design and debugging', 'Communication and collaboration workflows'],
  },
]

export function ExperiencePage() {
  usePageMeta('Experience', 'Professional and academic experience in software engineering and backend development.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Experience</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ai-text-primary sm:text-4xl dark:text-ai-text-primary">
            Applied engineering through hands-on execution.
          </h1>
          <p className="max-w-2xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            My experience combines simulated industry environments and academic projects where I focus
            on execution quality, clean systems thinking, and consistent delivery.
          </p>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-3">
          {experienceHighlights.map((block, idx) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-ai-border bg-ai-card/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
            >
              <h2 className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">{block.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
                {block.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <Experience />
      </div>
    </section>
  )
}
