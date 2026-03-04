import { Reveal } from '../ui/Reveal'

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
      className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
      aria-label="Experience"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Experience
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
            Steps toward professional software engineering.
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.08}
            >
              <article className="flex flex-col gap-2 rounded-2xl border border-ai-border bg-ai-card/80 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-ai-border dark:bg-ai-card/80 sm:px-5 sm:py-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                  <h3 className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ai-text-secondary dark:text-ai-text-secondary">
                    {item.period}
                  </p>
                </div>
                <p className="text-xs text-ai-text-secondary dark:text-ai-text-secondary">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
