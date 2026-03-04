import { motion } from 'framer-motion'

const timeline = [
  {
    label: 'Education',
    title: 'Engineering Student',
    body: 'Pursuing engineering with a focus on computer science fundamentals, problem solving, and software engineering practices.',
  },
  {
    label: 'Skills',
    title: 'Java, DSA & Backend',
    body: 'Deepening expertise in Java, data structures & algorithms, and how to design clean, maintainable backend systems.',
  },
  {
    label: 'Experience',
    title: 'Junior Software Engineer – Forage',
    body: 'Applying backend concepts in simulated work environments, collaborating on projects, and learning production workflows.',
  },
  {
    label: 'Goals',
    title: 'Aspiring Software Engineer',
    body: 'Building scalable, reliable systems in the cloud (AWS) while continuously improving as a backend-focused engineer.',
  },
]

export function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen snap-start items-center bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface"
      aria-label="About Aman"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row">
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            About
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
            Story-driven engineering journey.
          </h2>
          <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            I&apos;m Aman, an engineering student from India who enjoys reasoning about systems — from
            how data flows through a backend service to how users experience an interface. I love
            working in Java, practicing DSA, and translating ideas into clean, scalable code.
          </p>
          <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            Outside of code, you&apos;ll likely find me on a badminton court, thinking a few moves ahead
            in chess, or reading about cloud architectures and system design.
          </p>
        </div>

        <div className="flex-1">
          <div className="relative h-full">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-accent/10 to-transparent" />
            <div className="space-y-6 pl-10">
              {timeline.map((item, index) => (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="relative"
                >
                  <div className="absolute left-[-2.2rem] top-1.5 h-3 w-3 rounded-full border-2 border-ai-navy bg-accent shadow-md shadow-[0_0_20px_rgba(34,211,238,0.25)] dark:border-ai-navy" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ai-text-secondary dark:text-ai-text-secondary">
                    {item.label}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-ai-text-secondary dark:text-ai-text-secondary">{item.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
