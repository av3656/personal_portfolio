import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'

export function Resume() {
  return (
    <section
      id="resume"
      className="flex min-h-screen snap-start items-center bg-gradient-to-b from-surface-light to-slate-100 px-4 py-24 dark:from-slate-950 dark:to-slate-900"
      aria-label="Resume"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Resume
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            A quick snapshot of my journey.
          </h2>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            Inline preview and a downloadable copy. Replace the file at <code>public/resume.pdf</code>{' '}
            with your latest resume.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-slate-900/5 bg-white/80 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-900/5 px-5 py-3 text-xs text-slate-500 dark:border-slate-50/10 dark:text-slate-300">
            <span>resume.pdf</span>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-accent/90"
            >
              <FiDownload size={12} />
              Download
            </a>
          </div>
          <div className="h-[420px] w-full bg-slate-100 text-xs text-slate-500 dark:bg-slate-950/40 dark:text-slate-400">
            <iframe
              title="Aman Verma Resume"
              src="/resume.pdf"
              className="h-full w-full"
            />
          </div>
        </motion.div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          If the resume preview doesn&apos;t load in development, ensure you&apos;ve added{' '}
          <code>resume.pdf</code> to the <code>public</code> folder.
        </p>
      </div>
    </section>
  )
}

