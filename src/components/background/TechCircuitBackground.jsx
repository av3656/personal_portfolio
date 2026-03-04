import { motion as Motion } from 'framer-motion'

const patternId = 'tech-circuit-grid'

export function TechCircuitBackground({ mobile = false }) {
  const opacity = mobile ? 0.035 : 0.05

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      <Motion.div
        className="h-full w-[140%] will-change-transform"
        animate={{ x: ['0%', '-14%'] }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      >
        <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 60 H120" stroke="rgba(56,189,248,0.22)" strokeWidth="1" />
              <path d="M60 0 V120" stroke="rgba(99,102,241,0.18)" strokeWidth="1" />
              <circle cx="60" cy="60" r="2" fill="rgba(125,211,252,0.5)" />
              <path d="M20 20 H45 V45" stroke="rgba(167,139,250,0.28)" strokeWidth="1" fill="none" />
            </pattern>
            <linearGradient id="circuit-fade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(14,165,233,0.25)" />
              <stop offset="100%" stopColor="rgba(30,41,59,0.08)" />
            </linearGradient>
          </defs>

          <rect width="1600" height="900" fill={`url(#${patternId})`} />
          <rect width="1600" height="900" fill="url(#circuit-fade)" />
        </svg>
      </Motion.div>
    </div>
  )
}
