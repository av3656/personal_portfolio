import { useMemo } from 'react'

const CHARS = ['0', '1']

function makeChunk(size) {
  return Array.from({ length: size }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export default function BinaryRainLayer({ mobile = false }) {
  const columns = useMemo(
    () =>
      Array.from({ length: mobile ? 10 : 18 }, (_, i) => ({
        id: i,
        left: `${(i + 1) * (100 / (mobile ? 11 : 19))}%`,
        duration: 12 + (i % 5),
        delay: i * 0.5,
        text: `${makeChunk(9)}\n${makeChunk(6)}\n${makeChunk(5)}\n${makeChunk(8)}`,
      })),
    [mobile],
  )

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.04 }}>
      <style>{`@keyframes binary-fall { from { transform: translate3d(0,-120%,0); } to { transform: translate3d(0,120vh,0); } }`}</style>
      {columns.map((col) => (
        <pre
          key={col.id}
          className="absolute top-[-24%] font-mono text-[10px] leading-4 text-cyan-300 blur-[0.35px]"
          style={{
            left: col.left,
            animationName: 'binary-fall',
            animationDuration: `${col.duration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${col.delay}s`,
            willChange: 'transform',
          }}
        >
          {col.text}
        </pre>
      ))}
    </div>
  )
}
