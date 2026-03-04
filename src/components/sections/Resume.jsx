import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'

export function Resume() {
  return (
    <section
      id="resume"
      className="flex min-h-screen snap-start items-center bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface"
      aria-label="Resume"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Resume
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
            A quick snapshot of my journey.
          </h2>
          <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            Inline preview and a downloadable copy. Replace the file at <code>public/resume.pdf</code>{' '}
            with your latest resume.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-ai-border bg-ai-card/80 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-ai-border px-5 py-3 text-xs text-ai-text-secondary dark:border-ai-border dark:text-ai-text-secondary">
            <span>resume.pdf</span>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-ai-navy shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-[#06b6d4]"
            >
              <FiDownload size={12} />
              Download
            </a>
          </div>
          <div className="h-[420px] w-full bg-ai-surface text-xs text-ai-text-secondary dark:bg-ai-navy/40 dark:text-ai-text-secondary">
            <iframe
              title="Aman Verma Resume"
              src="/resume.pdf"
              className="h-full w-full"
            />
          </div>
        </motion.div>

        <p className="text-[11px] text-ai-text-secondary dark:text-ai-text-secondary">
          If the resume preview doesn&apos;t load in development, ensure you&apos;ve added{' '}
          <code>resume.pdf</code> to the <code>public</code> folder.
        </p>
      </div>
    </section>
  )
}
