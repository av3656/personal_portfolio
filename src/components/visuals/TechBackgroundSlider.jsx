import { motion as Motion } from 'framer-motion'

const tiles = [
  'linear-gradient(135deg, rgba(14,165,233,0.24), rgba(14,165,233,0.02) 55%, rgba(2,6,23,0.18))',
  'repeating-linear-gradient(45deg, rgba(148,163,184,0.14) 0px, rgba(148,163,184,0.14) 1px, transparent 1px, transparent 10px), linear-gradient(135deg, rgba(30,41,59,0.3), rgba(15,23,42,0.05))',
  'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.04) 35%, transparent 60%), radial-gradient(circle at 75% 70%, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.02) 40%, transparent 65%), linear-gradient(120deg, rgba(2,6,23,0.24), rgba(15,23,42,0.08))',
  'repeating-radial-gradient(circle at center, rgba(148,163,184,0.18) 0px, rgba(148,163,184,0.18) 1px, transparent 1px, transparent 8px), linear-gradient(140deg, rgba(14,165,233,0.16), rgba(2,6,23,0.1))',
]

function Track({ mobile }) {
  return (
    <div className="flex min-w-max items-center gap-6 pr-6">
      {tiles.concat(tiles).map((bg, idx) => (
        <div
          key={`${idx}-${bg.slice(0, 10)}`}
          className="h-36 w-[18rem] rounded-2xl border border-white/10 md:h-44 md:w-[24rem]"
          style={{
            backgroundImage: bg,
            filter: 'grayscale(1) blur(0.6px)',
            opacity: mobile ? 0.05 : 0.1,
          }}
        />
      ))}
    </div>
  )
}

export function TechBackgroundSlider({ mobile = false }) {
  return (
    <div className="absolute inset-x-0 top-[12%] overflow-hidden">
      <Motion.div
        className="flex will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: mobile ? 58 : 40, ease: 'linear', repeat: Infinity }}
      >
        <Track mobile={mobile} />
        <Track mobile={mobile} />
      </Motion.div>
    </div>
  )
}
