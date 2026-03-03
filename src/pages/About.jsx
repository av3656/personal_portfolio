import { motion } from 'framer-motion'
import { About } from '../components/sections/About'
import { usePageMeta } from '../hooks/usePageMeta'

export function AboutPage() {
  usePageMeta('About', 'Detailed background, engineering mindset, and journey of Aman Verma.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-surface-light to-slate-50 px-4 py-24 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            About
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Engineering-minded, curiosity-driven.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            I&apos;m Aman Verma, an engineering student and Java-focused developer who enjoys thinking
            about how systems behave over time — from the data structures behind an algorithm to the
            way a backend service scales under real-world load.
          </p>
        </motion.header>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 text-sm text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80 dark:text-slate-300"
          >
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Engineering journey</h2>
            <p className="mt-2 text-xs leading-relaxed">
              My degree has given me a strong foundation in computer science fundamentals: algorithms,
              data structures, operating systems, and networks. I complement this with self-driven projects
              in Java and backend development, where I care about code clarity, predictable behavior, and
              designing APIs that are a pleasure to work with.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 text-sm text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80 dark:text-slate-300"
          >
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Mindset &amp; philosophy
            </h2>
            <p className="mt-2 text-xs leading-relaxed">
              I like to approach problems systematically: understand the constraints, break work into
              manageable pieces, and iterate with feedback. Good engineering to me means balancing
              performance with readability, favoring clear interfaces over clever one-liners, and always
              leaving code in a better state than I found it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4 }}
            className="rounded-2xl border border-slate-900/5 bg-white/80 p-5 text-sm text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80 dark:text-slate-300"
          >
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Beyond the code</h2>
            <p className="mt-2 text-xs leading-relaxed">
              When I&apos;m not working through DSA problems or backend patterns, I love badminton and chess.
              Both sports have shaped how I think about pacing, strategy, and anticipating the next move —
              skills that map surprisingly well to debugging and designing resilient systems.
            </p>
          </motion.div>
        </div>

        {/* Reuse the original timeline-based About section as an extended narrative block */}
        <About />
      </div>
    </section>
  )
}
