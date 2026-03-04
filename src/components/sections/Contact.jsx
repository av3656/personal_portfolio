import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import { Reveal } from '../ui/Reveal'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/av3656',
    icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/amanvermaavr0001',
    icon: FiLinkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/carpediem_aman_',
    icon: FiInstagram,
  },
  {
    label: 'X',
    href: 'https://x.com/carpediem_aman',
    icon: FaXTwitter,
  },
]

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [github, setGithub] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setSuccess(false)
    setError(false)

    const githubLink = github.startsWith('http') ? github : `https://github.com/${github}`

    try {
      await emailjs.send(
        'service_zwajs2k',
        'template_1h0irdb',
        {
          name,
          email,
          github: githubLink,
          message,
        },
        'e9N8MhJBf60vznEmS',
      )

      setSuccess(true)
      setName('')
      setEmail('')
      setGithub('')
      setMessage('')
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="contact"
      className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
      aria-label="Contact"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <Reveal className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Contact
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
              Let&apos;s build something thoughtful.
            </h2>
            <p className="max-w-md text-sm text-ai-text-secondary dark:text-ai-text-secondary">
              Open to internships, backend-focused roles, and collaborative projects where clean
              engineering and curiosity matter.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {socials.map((social, index) => (
              <Reveal
                key={social.label}
                delay={index * 0.08}
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ai-border bg-ai-card/80 px-3 py-1.5 text-ai-text-secondary shadow-sm transition hover:border-ai-violet hover:text-ai-violet-glow dark:border-ai-border dark:bg-ai-card/80 dark:text-ai-text-primary"
                >
                  <social.icon size={14} />
                  {social.label}
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-6 flex-1 rounded-3xl border border-ai-border bg-ai-card/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-ai-border dark:bg-ai-card/80 lg:mt-0"
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-ai-text-secondary dark:text-ai-text-secondary"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ai-text-primary outline-none ring-accent/40 placeholder:text-ai-text-secondary focus:border-accent focus:ring-2 focus:shadow-[0_0_8px_rgba(34,211,238,0.25)] dark:border-slate-700 dark:bg-ai-surface dark:text-ai-text-primary"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-ai-text-secondary dark:text-ai-text-secondary"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ai-text-primary outline-none ring-accent/40 placeholder:text-ai-text-secondary focus:border-accent focus:ring-2 focus:shadow-[0_0_8px_rgba(34,211,238,0.25)] dark:border-slate-700 dark:bg-ai-surface dark:text-ai-text-primary"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="github"
                className="block text-xs font-medium text-ai-text-secondary dark:text-ai-text-secondary"
              >
                GitHub ID
              </label>
              <input
                id="github"
                name="github"
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ai-text-primary outline-none ring-accent/40 placeholder:text-ai-text-secondary focus:border-accent focus:ring-2 focus:shadow-[0_0_8px_rgba(34,211,238,0.25)] dark:border-slate-700 dark:bg-ai-surface dark:text-ai-text-primary"
                placeholder="your-github-username or profile link"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-ai-text-secondary dark:text-ai-text-secondary"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ai-text-primary outline-none ring-accent/40 placeholder:text-ai-text-secondary focus:border-accent focus:ring-2 focus:shadow-[0_0_8px_rgba(34,211,238,0.25)] dark:border-slate-700 dark:bg-ai-surface dark:text-ai-text-primary"
                placeholder="Tell me about your project or opportunity..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-ai-navy shadow-md shadow-[0_0_12px_rgba(34,211,238,0.35)] transition hover:bg-[#06b6d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ai-navy disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-ai-navy sm:w-auto"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </motion.button>

            <AnimatePresence mode="wait">
              {success && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Message sent successfully. I will get back to you soon.
                </motion.p>
              )}
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-xs font-medium text-red-600 dark:text-red-400"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
