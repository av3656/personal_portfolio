import { motion as Motion } from 'framer-motion'

const snippets = [
  'const server = express()',
  'SELECT * FROM users',
  'class BinarySearchTree {}',
  'docker run app',
  'api.get("/health")',
  'async function deploy() {}',
  'const cache = new Map()',
  'kubectl get pods',
]

const positions = [
  { top: '16%', left: '8%' },
  { top: '28%', left: '66%' },
  { top: '42%', left: '20%' },
  { top: '56%', left: '74%' },
  { top: '68%', left: '12%' },
  { top: '78%', left: '52%' },
  { top: '84%', left: '30%' },
  { top: '90%', left: '70%' },
]

export default function CodeLayer({ mobile = false }) {
  const count = mobile ? 5 : 8
  return (
    <div className="absolute inset-0" style={{ opacity: 0.05 }}>
      {snippets.slice(0, count).map((text, idx) => (
        <Motion.pre
          key={text}
          className="absolute font-mono text-[10px] md:text-xs text-sky-300 blur-[0.5px]"
          style={{ ...positions[idx], willChange: 'transform' }}
          animate={{ y: [0, -10, 0], rotate: [0, 0.6, 0] }}
          transition={{ duration: 10 + idx, delay: idx * 0.45, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </Motion.pre>
      ))}
    </div>
  )
}
