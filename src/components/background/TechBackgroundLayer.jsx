import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const NETWORK_NODES = [
  { x: 8, y: 12, d: 14 },
  { x: 18, y: 24, d: 17 },
  { x: 26, y: 14, d: 12 },
  { x: 34, y: 30, d: 18 },
  { x: 42, y: 18, d: 13 },
  { x: 52, y: 28, d: 16 },
  { x: 61, y: 16, d: 15 },
  { x: 70, y: 32, d: 19 },
  { x: 78, y: 20, d: 14 },
  { x: 86, y: 36, d: 18 },
  { x: 16, y: 62, d: 16 },
  { x: 28, y: 74, d: 12 },
  { x: 40, y: 64, d: 15 },
  { x: 54, y: 78, d: 17 },
  { x: 72, y: 70, d: 13 },
]

const EDGE_BINARY = [
  { text: '0101101 101010 0110', left: '1.5%', duration: 9, delay: 0.2 },
  { text: '1 0 1 1 0 0 1 0', left: '3.8%', duration: 11, delay: 1.1 },
  { text: '11001 0101 011010', right: '2%', duration: 10, delay: 0.7 },
  { text: '010 10101 110 01', right: '4.2%', duration: 8.5, delay: 1.6 },
]

const CODE_SNIPPETS = [
  { text: 'public static void main(String[] args)', top: '14%', left: '9%', rotate: -2, d: 11 },
  { text: '@RestController', top: '32%', right: '11%', rotate: 2, d: 13 },
  { text: 'List<String> users = new ArrayList<>();', top: '48%', left: '14%', rotate: 1, d: 16 },
  { text: 'Optional<User> user = repo.findById(id);', top: '65%', right: '12%', rotate: -2, d: 12 },
  { text: 'CompletableFuture.runAsync(() -> process())', top: '75%', left: '46%', rotate: 3, d: 14 },
  { text: 'Map<String, Integer> cache = new HashMap<>();', top: '24%', left: '44%', rotate: -1, d: 15 },
]

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export default function TechBackgroundLayer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const nodes = isMobile ? NETWORK_NODES.slice(0, 8) : NETWORK_NODES
  const snippets = isMobile ? CODE_SNIPPETS.slice(0, 2) : CODE_SNIPPETS

  const connections = useMemo(() => {
    const pairs = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (distance(nodes[i], nodes[j]) < 22) {
          pairs.push([nodes[i], nodes[j]])
        }
      }
    }
    return pairs
  }, [nodes])

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 h-full w-full overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        animate={{ x: [0, 200] }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      />

      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {connections.map(([a, b], idx) => (
          <line
            key={`${a.x}-${a.y}-${b.x}-${b.y}-${idx}`}
            x1={`${a.x}%`}
            y1={`${a.y}%`}
            x2={`${b.x}%`}
            y2={`${b.y}%`}
            stroke="rgba(34,211,238,0.18)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {nodes.map((node, idx) => (
        <motion.span
          key={`${node.x}-${node.y}-${idx}`}
          className="absolute h-1 w-1 rounded-full bg-cyan-400"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            boxShadow: '0 0 8px rgba(34,211,238,0.5)',
            opacity: 0.8,
          }}
          animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }}
          transition={{ duration: node.d, ease: 'easeInOut', repeat: Infinity, delay: idx * 0.2 }}
        />
      ))}

      {!isMobile &&
        EDGE_BINARY.map((item, idx) => (
          <motion.pre
            key={`${item.text}-${idx}`}
            className="absolute m-0 whitespace-nowrap font-mono text-[11px]"
            style={{
              left: item.left,
              right: item.right,
              color: 'rgba(34,211,238,0.2)',
            }}
            initial={{ y: '-120%' }}
            animate={{ y: ['-120%', '120%'] }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {item.text}
          </motion.pre>
        ))}

      {snippets.map((snippet, idx) => (
        <motion.pre
          key={`${snippet.text}-${idx}`}
          className="absolute m-0 rounded-md border px-[14px] py-[10px] font-mono text-[11px]"
          style={{
            top: snippet.top,
            left: snippet.left,
            right: snippet.right,
            color: 'rgba(34,211,238,0.35)',
            background: 'rgba(15,23,42,0.4)',
            borderColor: 'rgba(34,211,238,0.2)',
            transform: `rotate(${snippet.rotate}deg)`,
          }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: snippet.d, ease: 'easeInOut', repeat: Infinity, delay: idx * 0.25 }}
        >
          {snippet.text}
        </motion.pre>
      ))}
    </div>
  )
}
