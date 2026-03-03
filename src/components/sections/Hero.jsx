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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-light via-surface-light/95 to-slate-900/80 dark:from-surface-dark dark:via-slate-950 dark:to-slate-950" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-6xl flex-col items-start gap-10 md:flex-row md:items-center"
      >
        <div className="flex-1 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
            Engineering Student · Java Developer
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-50">
            Hi, I&apos;m <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">Aman Verma.</span>
          </h1>

          <p className="max-w-xl text-balance text-sm text-slate-600 sm:text-base dark:text-slate-300">
            I&apos;m an engineering student and aspiring software engineer focused on{' '}
            <span className="font-medium">clean backend systems</span>,{' '}
            <span className="font-medium">Java</span>, and{' '}
            <span className="font-medium">scalable cloud-ready architectures</span> — with a love for
            badminton, chess, and thoughtfully crafted web experiences.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/40 transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light dark:focus-visible:ring-offset-surface-dark"
            >
              View Projects
            </Link>
            <Link
              to="/resume"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-50/15 dark:bg-slate-900/60 dark:text-slate-100"
            >
              Download Resume
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 dark:border-slate-50/10 dark:bg-slate-900/70">
              Backend Development
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 dark:border-slate-50/10 dark:bg-slate-900/70">
              Java &amp; DSA
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 dark:border-slate-50/10 dark:bg-slate-900/70">
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
        <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Scroll
        </div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-10 w-5 rounded-full border border-slate-900/15 bg-white/60 p-1 shadow-sm backdrop-blur dark:border-slate-50/20 dark:bg-slate-900/70"
          aria-hidden="true"
        >
          <div className="h-full w-full rounded-full bg-slate-400/70 dark:bg-slate-200/70" />
        </motion.div>
      </div>
    </section>
  )
}
