import { motion as Motion } from 'framer-motion'

const snippets = [
  { text: 'const server = express()', top: '18%', left: '8%' },
  { text: 'server.listen(3000)', top: '34%', left: '68%' },
  { text: 'class BinarySearchTree {}', top: '55%', left: '16%' },
  { text: 'SELECT * FROM users', top: '72%', left: '62%' },
]

export function FloatingCode({ mobile = false }) {
  return (
    <div className="absolute inset-0">
      {snippets.map((snippet, index) => (
        <Motion.pre
          key={snippet.text}
          className="absolute font-mono text-[10px] md:text-xs text-cyan-300/10"
          style={{ top: snippet.top, left: snippet.left, filter: 'blur(0.2px)' }}
          animate={{ y: [0, -10, 0], opacity: mobile ? [0.03, 0.05, 0.03] : [0.05, 0.08, 0.05] }}
          transition={{ duration: mobile ? 9 : 7, delay: index * 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          {snippet.text}
        </Motion.pre>
      ))}
    </div>
  )
}
