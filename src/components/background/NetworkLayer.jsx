import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function NetworkLayer({ mobile = false }) {
  const nodeCount = mobile ? 14 : 24

  const nodes = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => ({ id: i, x: rand(6, 94), y: rand(8, 92) })),
    [nodeCount],
  )

  const edges = useMemo(() => {
    const list = []
    for (let i = 0; i < nodes.length; i += 1) {
      if (i + 1 < nodes.length) list.push([nodes[i], nodes[i + 1]])
      if (i + 4 < nodes.length && i % 2 === 0) list.push([nodes[i], nodes[i + 4]])
    }
    return list
  }, [nodes])

  return (
    <div className="absolute inset-0" style={{ opacity: 0.05 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {edges.map(([a, b], idx) => (
          <line
            key={`${a.id}-${b.id}-${idx}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(125,211,252,0.7)"
            strokeWidth="0.12"
          />
        ))}

        {nodes.map((node, idx) => (
          <Motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={mobile ? 0.3 : 0.38}
            fill="rgba(56,189,248,0.95)"
            animate={{ x: [0, rand(-1.4, 1.4), 0], y: [0, rand(-1.2, 1.2), 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: rand(12, 18), repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
          />
        ))}
      </svg>
    </div>
  )
}
