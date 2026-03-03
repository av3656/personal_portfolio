import { motion } from 'framer-motion'
import { Projects } from '../components/sections/Projects'
import { usePageMeta } from '../hooks/usePageMeta'

const projectPrinciples = [
  {
    title: 'Problem Framing',
    body: 'Each project begins with constraints: expected scale, failure cases, and what tradeoffs matter most for users.',
  },
  {
    title: 'Architecture Choice',
    body: 'I favor modular boundaries and explicit data flow so systems are easier to test, reason about, and evolve.',
  },
  {
    title: 'Tech Stack Reasoning',
    body: 'I choose tools based on maintainability and learning value, not only on trend alignment.',
  },
]

export function ProjectsPage() {
  usePageMeta('Projects', 'Detailed project portfolio focused on backend systems and clean engineering.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-surface-light to-slate-100 px-4 py-24 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Projects</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Projects with clear engineering decisions.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Beyond screenshots, this page emphasizes why each system was built the way it was, what
            problem it solves, and what I learned during implementation.
          </p>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-3">
          {projectPrinciples.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80"
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.body}</p>
            </motion.article>
          ))}
        </div>

        <Projects />
      </div>
    </section>
  )
}
