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
    <section className="relative min-h-screen bg-gradient-to-b from-surface-light to-slate-50 px-4 py-24 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Experience</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Applied engineering through hands-on execution.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
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
              className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80"
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{block.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-600 dark:text-slate-300">
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
