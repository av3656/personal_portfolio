import { motion as Motion } from 'framer-motion'

const snippets = [
  { text: 'const server = express()', top: '16%', left: '7%' },
  { text: 'SELECT * FROM users', top: '34%', left: '64%' },
  { text: 'class Node {}', top: '58%', left: '18%' },
  { text: 'api.get("/health")', top: '74%', left: '72%' },
  { text: 'docker compose up -d', top: '84%', left: '36%' },
]

export function FloatingCodeBackground({ mobile = false }) {
  const visible = mobile ? snippets.slice(0, 3) : snippets
  const opacity = mobile ? 0.035 : 0.05

  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {visible.map((snippet, idx) => (
        <Motion.pre
          key={snippet.text}
          className="absolute font-mono text-[10px] md:text-xs text-sky-300/90 blur-[0.3px] will-change-transform"
          style={{ top: snippet.top, left: snippet.left }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8 + idx, delay: idx * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {snippet.text}
        </Motion.pre>
      ))}
    </div>
  )
}
