import { motion as Motion } from 'framer-motion'

const lines = ['18%', '36%', '54%', '72%', '88%']

export function SectionDivider({ mobile = false }) {
  return (
    <div className="absolute inset-0">
      {lines.map((top, idx) => (
        <div key={top} className="absolute left-0 right-0" style={{ top }}>
          <div className="relative h-px bg-gradient-to-r from-transparent via-sky-300/12 to-transparent">
            <Motion.div
              className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan-300/35"
              animate={{ x: ['0%', '100%'], opacity: mobile ? [0.25, 0.1, 0.25] : [0.45, 0.2, 0.45] }}
              transition={{ duration: mobile ? 14 : 10, delay: idx * 0.35, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
