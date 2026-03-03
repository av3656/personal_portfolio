import { motion } from 'framer-motion'

const items = [
  {
    title: 'Junior Software Engineer – Forage',
    period: 'Remote · Current',
    body: 'Completing virtual experience programs that simulate real engineering workflows, from backend tasks to code reviews.',
  },
  {
    title: 'Academic Projects',
    period: 'University',
    body: 'Built course projects around Java, data structures, and web technologies with a focus on readability and correctness.',
  },
]

export function Experience() {
  return (
    <section
      id="experience"
      className="flex min-h-screen snap-start items-center bg-surface-light px-4 py-24 dark:bg-slate-950"
      aria-label="Experience"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Experience
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Steps toward professional software engineering.
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="flex flex-col gap-2 rounded-2xl border border-slate-900/5 bg-white/80 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80 sm:px-5 sm:py-5"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {item.period}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

