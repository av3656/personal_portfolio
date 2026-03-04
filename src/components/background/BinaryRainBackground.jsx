import { motion as Motion } from 'framer-motion'

const desktopColumns = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i + 1) * 5.2}%`,
  delay: i * 0.7,
  duration: 18 + (i % 5) * 2,
}))

const mobileColumns = desktopColumns.slice(0, 8)

const binaryChunk = '0101101 11001 001011 101001 0110'

export function BinaryRainBackground({ mobile = false }) {
  const columns = mobile ? mobileColumns : desktopColumns
  const opacity = mobile ? 0.02 : 0.03

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      {columns.map((col) => (
        <Motion.div
          key={col.id}
          className="absolute top-[-20%] font-mono text-[10px] leading-5 text-cyan-300/90 blur-[0.25px] will-change-transform"
          style={{ left: col.left }}
          animate={{ y: ['-20%', '120%'] }}
          transition={{ duration: col.duration, delay: col.delay, ease: 'linear', repeat: Infinity }}
        >
          <div>{binaryChunk}</div>
          <div>{binaryChunk}</div>
          <div>{binaryChunk}</div>
          <div>{binaryChunk}</div>
        </Motion.div>
      ))}
    </div>
  )
}
