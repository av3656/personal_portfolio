import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProfileFlipCard } from '../ProfileFlipCard'

const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function Hero() {
  return (
    <section
      id="intro"
      className="relative flex min-h-screen snap-start items-center justify-center bg-hero-gradient px-4 pt-24"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ai-navy via-ai-navy/95 to-ai-surface dark:from-ai-navy dark:via-ai-navy dark:to-ai-surface" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-6xl flex-col items-start gap-10 md:flex-row md:items-center"
      >
        <div className="flex-1 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ai-text-secondary dark:text-ai-text-secondary">
            Engineering Student · Java Developer
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-ai-text-primary sm:text-5xl md:text-6xl dark:text-ai-text-primary">
            Hi, I&apos;m <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">Aman Verma.</span>
          </h1>

          <p className="max-w-xl text-balance text-sm text-ai-text-secondary sm:text-base dark:text-ai-text-secondary">
            I&apos;m an engineering student and aspiring software engineer focused on{' '}
            <span className="font-medium">clean backend systems</span>,{' '}
            <span className="font-medium">Java</span>, and{' '}
            <span className="font-medium">scalable cloud-ready architectures</span> — with a love for
            badminton, chess, and thoughtfully crafted web experiences.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ai-navy shadow-lg shadow-[0_0_12px_rgba(34,211,238,0.35)] transition hover:bg-[#06b6d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ai-navy dark:focus-visible:ring-offset-ai-navy"
            >
              View Projects
            </Link>
            <Link
              to="/resume"
              className="inline-flex items-center justify-center rounded-full border border-ai-violet bg-ai-card/70 px-5 py-2.5 text-sm font-semibold text-ai-violet shadow-sm transition hover:bg-ai-violet/10 hover:border-ai-violet hover:text-ai-violet-glow dark:border-ai-violet dark:bg-ai-card/60 dark:text-ai-violet"
            >
              Download Resume
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
            <span className="rounded-full border border-ai-border bg-ai-card/60 px-3 py-1 dark:border-ai-border dark:bg-ai-card/70">
              Backend Development
            </span>
            <span className="rounded-full border border-ai-border bg-ai-card/60 px-3 py-1 dark:border-ai-border dark:bg-ai-card/70">
              Java &amp; DSA
            </span>
            <span className="rounded-full border border-ai-border bg-ai-card/60 px-3 py-1 dark:border-ai-border dark:bg-ai-card/70">
              AWS (Foundations)
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mt-4 flex flex-1 items-center justify-center md:mt-0"
        >
          <ProfileFlipCard />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 transform flex-col items-center gap-3 md:flex">
        <div className="text-xs uppercase tracking-[0.25em] text-ai-text-secondary dark:text-ai-text-secondary">
          Scroll
        </div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-10 w-5 rounded-full border border-ai-border bg-ai-card/60 p-1 shadow-sm backdrop-blur dark:border-ai-border dark:bg-ai-card/70"
          aria-hidden="true"
        >
          <div className="h-full w-full rounded-full bg-ai-text-secondary/70 dark:bg-ai-text-secondary/70" />
        </motion.div>
      </div>
    </section>
  )
}
