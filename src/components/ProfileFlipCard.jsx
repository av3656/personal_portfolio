import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import profilePlaceholder from '../assets/photo_01.png'

export function ProfileFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFlip = () => setIsFlipped((prev) => !prev)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleFlip()
    }
  }

  return (
    <div className="[perspective:1200px]">
      <Motion.div
        role="button"
        tabIndex={0}
        aria-label="Flip profile card"
        aria-pressed={isFlipped}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        className="relative h-64 w-64 max-w-xs cursor-pointer rounded-2xl [transform-style:preserve-3d]"
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          y: isFlipped ? 0 : [0, -6, 0],
        }}
        whileHover={{
          scale: 1.03,
          rotateX: isFlipped ? 0 : -4,
          boxShadow: '0 24px 50px -20px rgba(56, 189, 248, 0.35)',
        }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.2, ease: 'easeOut' },
          rotateX: { duration: 0.2, ease: 'easeOut' },
          boxShadow: { duration: 0.2, ease: 'easeOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-ai-border bg-ai-card/70 p-4 shadow-2xl shadow-sky-500/10 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 via-sky-400/10 to-emerald-300/10" />
          <div className="relative flex h-full items-center justify-center">
            <div className="group relative">
              <div className="absolute -inset-3 rounded-full bg-accent/20 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
              <img
                src={profilePlaceholder}
                alt="Aman Verma profile"
                className="relative h-36 w-36 rounded-full border border-white/40 object-cover shadow-lg shadow-slate-900/20 transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-ai-border bg-ai-card/70 p-4 shadow-2xl shadow-sky-500/10 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 via-sky-400/10 to-emerald-300/10" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="space-y-1 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ai-text-secondary dark:text-ai-text-secondary">
                Focus
              </p>
              <p className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">Java · Backend · Cloud</p>
            </div>
            <div className="space-y-2 text-xs text-ai-text-secondary dark:text-ai-text-secondary">
              <p>Currently learning:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Advanced Data Structures &amp; Algorithms</li>
                <li>Backend architecture &amp; microservices</li>
                <li>AWS fundamentals &amp; deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  )
}
