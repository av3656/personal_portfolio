import { motion } from 'framer-motion'
import { Skills } from '../components/sections/Skills'
import { usePageMeta } from '../hooks/usePageMeta'

const skillTracks = [
  {
    title: 'Programming Foundations',
    summary:
      'Java is my primary language for backend and DSA work, with C and SQL used for low-level and data-focused problem solving.',
    focus: ['Core Java', 'Collections', 'OOP design', 'Problem solving patterns'],
  },
  {
    title: 'Backend Engineering',
    summary:
      'I focus on clean APIs, predictable error handling, and structure that scales from course projects to production-style services.',
    focus: ['REST API design', 'Layered architecture', 'Validation and testing', 'Service decomposition'],
  },
  {
    title: 'Cloud and Tooling',
    summary:
      'I use Git/GitHub for collaboration and I am actively building AWS foundations for deployment, monitoring, and reliability.',
    focus: ['Git workflows', 'AWS basics', 'CI-friendly structure', 'Observability mindset'],
  },
]

export function SkillsPage() {
  usePageMeta('Skills', 'Technical skills across Java, backend engineering, cloud, and web fundamentals.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-surface-light to-slate-50 px-4 py-24 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Skills</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Technical depth with a backend-first direction.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            This page expands how I apply each skill set in real projects, how I prioritize learning,
            and where I am investing next for software engineering growth.
          </p>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-3">
          {skillTracks.map((track, idx) => (
            <motion.article
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80"
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{track.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{track.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-600 dark:text-slate-300">
                {track.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <Skills />
      </div>
    </section>
  )
}
