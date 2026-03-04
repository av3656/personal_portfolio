import { motion } from 'framer-motion'
import { Contact } from '../components/sections/Contact'
import { usePageMeta } from '../hooks/usePageMeta'

export function ContactPage() {
  usePageMeta('Contact', 'Contact Aman Verma for internships, collaborations, and opportunities.')

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">Contact</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ai-text-primary sm:text-4xl dark:text-ai-text-primary">
            Let&apos;s discuss internships, collaborations, and backend ideas.
          </h1>
          <p className="max-w-2xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
            I&apos;m open to software engineering internships and project collaborations. Share your
            context through the form and I&apos;ll get back with next steps.
          </p>
        </motion.header>

        <Contact />
      </div>
    </section>
  )
}
