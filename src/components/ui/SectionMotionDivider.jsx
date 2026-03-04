import { motion as Motion } from 'framer-motion'

const nodes = [12, 34, 50, 68, 88]

export function SectionMotionDivider() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="pointer-events-none relative h-0"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 w-[80%] -translate-x-1/2 md:w-[65%]">
        <div
          className="relative h-px overflow-visible"
          style={{
            background: 'rgba(34,211,238,0.25)',
            boxShadow: '0 0 8px rgba(34,211,238,0.4)',
          }}
        >
          <Motion.div
            className="absolute inset-y-0 w-1/3"
            style={{
              background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
              filter: 'blur(0.2px)',
            }}
            animate={{ x: ['-120%', '320%'] }}
            transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
          />

          {nodes.map((left, idx) => (
            <Motion.span
              key={left}
              className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent ${
                idx > 1 ? 'hidden md:block' : ''
              }`}
              style={{ left: `${left}%`, boxShadow: '0 0 10px rgba(34,211,238,0.6)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
            />
          ))}
        </div>
      </div>
    </Motion.div>
  )
}
