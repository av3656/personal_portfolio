import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiInstagram, FiTwitter } from 'react-icons/fi'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/your-username',
    icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/your-handle',
    icon: FiLinkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/your-handle',
    icon: FiInstagram,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/your-handle',
    icon: FiTwitter,
  },
]

export function Contact() {
  return (
    <section
      id="contact"
      className="flex min-h-screen snap-start items-center bg-surface-light px-4 py-24 dark:bg-slate-950"
      aria-label="Contact"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Contact
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Let&apos;s build something thoughtful.
          </h2>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
            Open to internships, backend-focused roles, and collaborative projects where clean
            engineering and curiosity matter.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-50/15 dark:bg-slate-900/80 dark:text-slate-100"
              >
                <social.icon size={14} />
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex-1 rounded-3xl border border-slate-900/5 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-50/10 dark:bg-slate-900/80 lg:mt-0"
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-slate-900/10 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-accent/40 placeholder:text-slate-400 focus:border-accent focus:ring-2 dark:border-slate-50/15 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-slate-900/10 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-accent/40 placeholder:text-slate-400 focus:border-accent focus:ring-2 dark:border-slate-50/15 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-slate-600 dark:text-slate-200"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-900/10 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-accent/40 placeholder:text-slate-400 focus:border-accent focus:ring-2 dark:border-slate-50/15 dark:bg-slate-900 dark:text-slate-50"
                placeholder="Tell me about your project or opportunity..."
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light dark:focus-visible:ring-offset-slate-950 sm:w-auto"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

