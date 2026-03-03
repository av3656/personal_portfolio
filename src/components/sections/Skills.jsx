import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Programming',
    skills: ['Java', 'C', 'SQL'],
  },
  {
    title: 'Web',
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'AWS (Basic)'],
  },
  {
    title: 'Core',
    skills: ['Data Structures', 'Algorithms'],
  },
]

const badgeVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.05 * i, duration: 0.3 },
  }),
}

export function Skills() {
  return (
    <section
      id="skills"
      className="flex min-h-screen snap-start items-center bg-surface-light px-4 py-24 dark:bg-slate-950"
      aria-label="Skills"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Skills
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              A backend-leaning toolkit.
            </h2>
            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
              I&apos;m building a strong foundation around Java and backend development while staying
              comfortable across the web stack.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {category.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    custom={i}
                    variants={badgeVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.5 }}
                    className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition duration-200 hover:border-accent hover:text-accent dark:border-slate-50/15 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

