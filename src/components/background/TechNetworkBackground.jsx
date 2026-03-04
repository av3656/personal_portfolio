import { motion as Motion } from 'framer-motion'

const desktopNodes = [
  { id: 1, x: 12, y: 22 },
  { id: 2, x: 26, y: 36 },
  { id: 3, x: 44, y: 20 },
  { id: 4, x: 58, y: 42 },
  { id: 5, x: 76, y: 28 },
  { id: 6, x: 88, y: 45 },
  { id: 7, x: 22, y: 66 },
  { id: 8, x: 46, y: 72 },
  { id: 9, x: 68, y: 64 },
]

const desktopEdges = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7], [7, 8], [8, 9], [4, 8], [5, 9],
]

const mobileNodes = desktopNodes.slice(0, 6)
const mobileEdges = desktopEdges.slice(0, 6)

export function TechNetworkBackground({ mobile = false }) {
  const nodes = mobile ? mobileNodes : desktopNodes
  const edges = mobile ? mobileEdges : desktopEdges
  const opacity = mobile ? 0.028 : 0.04

  const byId = new Map(nodes.map((n) => [n.id, n]))

  return (
    <Motion.div
      className="absolute inset-0 will-change-transform"
      style={{ opacity }}
      animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
      transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
        {edges.map(([from, to]) => {
          const a = byId.get(from)
          const b = byId.get(to)
          if (!a || !b) return null
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(125,211,252,0.55)"
              strokeWidth="0.15"
            />
          )
        })}

        {nodes.map((node, idx) => (
          <Motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={mobile ? 0.32 : 0.42}
            fill="rgba(56,189,248,0.9)"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.5, delay: idx * 0.25, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </Motion.div>
  )
}
