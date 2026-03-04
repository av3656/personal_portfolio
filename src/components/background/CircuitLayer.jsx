import { motion as Motion } from 'framer-motion'

export default function CircuitLayer({ mobile = false }) {
  return (
    <div className="absolute inset-0" style={{ opacity: 0.05 }}>
      <Motion.svg
        viewBox="0 0 2000 1200"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-[140%] will-change-transform"
        animate={{ x: ['0%', '-20%'] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <pattern id="circuit-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M0 60H120" stroke="rgba(56,189,248,0.55)" strokeWidth="1" />
            <path d="M60 0V120" stroke="rgba(129,140,248,0.45)" strokeWidth="1" />
            <path d="M18 18H42V42" stroke="rgba(94,234,212,0.45)" strokeWidth="1" fill="none" />
            <circle cx="60" cy="60" r="2" fill="rgba(125,211,252,0.75)" />
          </pattern>
        </defs>
        <rect width="2000" height="1200" fill="url(#circuit-pattern)" />
      </Motion.svg>
    </div>
  )
}
