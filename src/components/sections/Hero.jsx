import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SiChessdotcom, SiLichess } from 'react-icons/si'
import { ProfileFlipCard } from '../ProfileFlipCard'
import { useChessRatings } from '../../hooks/useChessRatings'
import { HeroKnightBackground } from '../HeroKnightBackground'
import { RatingSparkline } from '../RatingSparkline'

const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

function getRatingColor(rating) {
  if (typeof rating !== 'number') {
    return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
  }
  if (rating < 1000) {
    return 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'
  }
  if (rating <= 1399) {
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  }
  if (rating <= 1799) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }
  if (rating <= 1999) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  }
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
}

function getRatingTier(rating) {
  if (typeof rating !== 'number') return 'Rating unavailable'
  if (rating < 1000) return 'Beginner'
  if (rating <= 1399) return 'Intermediate'
  if (rating <= 1799) return 'Club Player'
  if (rating <= 1999) return 'Expert'
  return 'Master Level'
}

function calculateRatingPercent(rating) {
  const safeRating = typeof rating === 'number' ? rating : 0
  const min = 0
  const max = 2500
  const percent = ((safeRating - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, percent))
}

function useAnimatedNumber(value, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(0)
      return
    }

    let frameId = 0
    let startTime = 0

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setDisplayValue(Math.round(progress * value))
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [value, duration])

  return displayValue
}

function RatingRow({ label, value, history = [] }) {
  const animatedValue = useAnimatedNumber(value)
  const percent = calculateRatingPercent(value)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowProgress(true), 50)
    return () => clearTimeout(timeoutId)
  }, [value])

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span
          className={`rounded-full px-3 py-1 font-semibold ${getRatingColor(value)}`}
          title={getRatingTier(value)}
        >
          {typeof value === 'number' ? animatedValue : '--'}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-gray-200 opacity-80 dark:bg-slate-700">
        <div
          className="h-full bg-accent transition-all duration-1000 ease-out"
          style={{ width: `${showProgress ? percent : 0}%` }}
        />
      </div>
      <RatingSparkline ratings={history} />
    </div>
  )
}

export function Hero() {
  const { ratings, history, loading, error } = useChessRatings('aman-avr', 'av3656')

  const RatingsCard = ({ title, icon: Icon, rows }) => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full w-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-md transition duration-300 dark:border-slate-600 dark:bg-slate-700 dark:shadow-none"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-slate-700 dark:text-cyan-300" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      </div>

      {loading ? (
        <div className="text-xs text-ai-text-secondary dark:text-ai-text-secondary">Loading ratings...</div>
      ) : error ? (
        <div className="text-xs text-ai-text-secondary dark:text-ai-text-secondary">Ratings unavailable</div>
      ) : (
        <div className="mt-1 flex flex-col gap-2">
          {rows.map((row) => (
            <RatingRow key={row.label} label={row.label} value={row.value} history={row.history} />
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <section
      id="intro"
      className="relative flex min-h-screen snap-start items-center justify-center bg-hero-gradient px-4 pt-24"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ai-navy via-ai-navy/95 to-ai-surface dark:from-ai-navy dark:via-ai-navy dark:to-ai-surface" />
      <HeroKnightBackground />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center"
      >
        <div className="flex-1 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ai-text-secondary dark:text-ai-text-secondary">
            Engineering Student · Java Developer
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-ai-text-primary sm:text-5xl md:text-6xl dark:text-ai-text-primary">
            Hi, I&apos;m <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">Aman Verma.</span>
          </h1>

          <p className="max-w-xl text-balance text-sm text-ai-text-secondary sm:text-base dark:text-ai-text-secondary">
            I&apos;m an engineering student and aspiring software engineer focused on building clean
            backend systems with Java and scalable cloud-ready architectures. I enjoy designing APIs,
            structuring backend services, and thinking about how systems behave under real-world load.
            <br />
            <br />
            Beyond coding, I approach engineering the same way I approach chess — carefully analyzing
            positions, planning several moves ahead, and constantly refining strategies to reach better
            solutions.
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Currently exploring system architecture, distributed systems, and scalable backend design.
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
          className="mt-4 w-full lg:mt-0 lg:justify-self-end"
        >
          <div className="w-full max-w-[520px] space-y-5 rounded-3xl border border-[rgba(56,189,248,0.18)] border-slate-200 bg-[rgba(15,23,42,0.55)] bg-white/70 p-6 shadow-[0_0_35px_rgba(56,189,248,0.18)] backdrop-blur-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mb-6 flex justify-center">
              <div className="flex h-[180px] w-[180px] items-center justify-center">
                <div className="scale-[0.7]">
                  <ProfileFlipCard />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RatingsCard
                title="Lichess Rating"
                icon={SiLichess}
                rows={[
                  { label: 'Rapid', value: ratings.lichess.rapid, history: history.rapid },
                  { label: 'Puzzle', value: ratings.lichess.puzzle, history: history.puzzle },
                ]}
              />
              <RatingsCard
                title="Chess.com Rating"
                icon={SiChessdotcom}
                rows={[
                  { label: 'Rapid', value: ratings.chesscom.rapid, history: history.rapid },
                  { label: 'Blitz', value: ratings.chesscom.blitz, history: [] },
                  { label: 'Puzzle', value: ratings.chesscom.puzzle, history: history.puzzle },
                ]}
              />
            </div>

            <p className="mt-4 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Strategic thinking from chess influences my approach to system design and problem
              solving.
            </p>
          </div>
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
