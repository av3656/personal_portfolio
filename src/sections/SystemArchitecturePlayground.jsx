import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { FaDatabase } from 'react-icons/fa'
import { FaHardDrive, FaLock, FaServer } from 'react-icons/fa6'
import { SiApachekafka, SiPostgresql, SiRedis, SiSpringboot } from 'react-icons/si'
import { Reveal } from '../components/ui/Reveal'

const NODE_WIDTH = 158
const NODE_HEIGHT = 62

const NODES = [
  {
    id: 'client',
    label: 'Client (Browser)',
    icon: FaHardDrive,
    description: 'Entry point where users interact with your frontend application.',
  },
  {
    id: 'loadBalancer',
    label: 'Load Balancer',
    icon: FaServer,
    description: 'Distributes incoming traffic across services for reliability.',
  },
  {
    id: 'apiGateway',
    label: 'API Gateway',
    icon: FaServer,
    description: 'Routes requests, enforces policies, and centralizes API management.',
  },
  {
    id: 'backend',
    label: 'Java Backend',
    icon: SiSpringboot,
    description: 'Runs Spring Boot services with core business logic and orchestration.',
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: FaLock,
    description: 'Validates identities, issues tokens, and protects secure endpoints.',
  },
  {
    id: 'database',
    label: 'PostgreSQL',
    icon: SiPostgresql,
    description: 'Primary relational data store for durable transactional records.',
  },
  {
    id: 'cache',
    label: 'Cache (Redis)',
    icon: SiRedis,
    description: 'Serves hot data quickly to reduce latency and database load.',
  },
  {
    id: 'queue',
    label: 'Message Queue',
    icon: SiApachekafka,
    description: 'Asynchronous event backbone for scalable service communication.',
  },
  {
    id: 'storage',
    label: 'File Storage (S3)',
    icon: FaDatabase,
    description: 'Stores static files and artifacts with high durability.',
  },
]

const CONNECTIONS = [
  ['client', 'loadBalancer'],
  ['loadBalancer', 'apiGateway'],
  ['apiGateway', 'backend'],
  ['backend', 'auth'],
  ['backend', 'database'],
  ['backend', 'cache'],
  ['backend', 'queue'],
  ['queue', 'storage'],
]

const DESKTOP_LAYOUT = {
  client: { x: 8, y: 45 },
  loadBalancer: { x: 24, y: 45 },
  apiGateway: { x: 40, y: 45 },
  backend: { x: 56, y: 45 },
  auth: { x: 56, y: 22 },
  database: { x: 77, y: 34 },
  cache: { x: 77, y: 56 },
  queue: { x: 66, y: 70 },
  storage: { x: 86, y: 70 },
}

const TABLET_LAYOUT = {
  client: { x: 10, y: 40 },
  loadBalancer: { x: 28, y: 40 },
  apiGateway: { x: 46, y: 40 },
  backend: { x: 64, y: 40 },
  auth: { x: 64, y: 19 },
  database: { x: 80, y: 32 },
  cache: { x: 80, y: 54 },
  queue: { x: 58, y: 70 },
  storage: { x: 80, y: 70 },
}

const MOBILE_LAYOUT = {
  client: { x: 50, y: 12 },
  loadBalancer: { x: 50, y: 23 },
  apiGateway: { x: 50, y: 34 },
  backend: { x: 50, y: 45 },
  auth: { x: 50, y: 56 },
  database: { x: 50, y: 67 },
  cache: { x: 50, y: 78 },
  queue: { x: 50, y: 89 },
  storage: { x: 50, y: 98 },
}

const EVOLUTION_STAGES = [
  {
    client: { x: 20, y: 48 },
    backend: { x: 50, y: 48 },
    database: { x: 80, y: 48 },
    apiGateway: { x: 35, y: 22 },
    loadBalancer: { x: 18, y: 22 },
    auth: { x: 53, y: 24 },
    cache: { x: 78, y: 30 },
    queue: { x: 62, y: 74 },
    storage: { x: 84, y: 74 },
  },
  DESKTOP_LAYOUT,
  {
    client: { x: 10, y: 45 },
    loadBalancer: { x: 26, y: 36 },
    apiGateway: { x: 42, y: 45 },
    backend: { x: 58, y: 55 },
    auth: { x: 58, y: 28 },
    database: { x: 78, y: 40 },
    cache: { x: 78, y: 62 },
    queue: { x: 62, y: 75 },
    storage: { x: 86, y: 75 },
  },
]
const EVOLUTION_STEP_MS = 3800

const ArchitectureLinks = memo(function ArchitectureLinks({ linkGeometries }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      {linkGeometries.map((link, index) => (
        <g key={link.id}>
          <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} className="architecture-link" />
          <circle r="3" className="architecture-flow-pulse">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin={`${(index % 6) * 0.35}s`}
              path={link.path}
            />
          </circle>
        </g>
      ))}
    </svg>
  )
})

const ArchitectureNode = memo(function ArchitectureNode({
  node,
  position,
  evolutionEnabled,
  hoveredNode,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}) {
  const Icon = node.icon
  if (!position) return null

  return (
    <div
      onPointerDown={(event) => onPointerDown(event, node.id)}
      onMouseEnter={() => onMouseEnter(node.id)}
      onMouseLeave={() => onMouseLeave(node.id)}
      className={`absolute select-none rounded-xl border border-ai-border bg-ai-surface/95 px-3.5 py-2.5 text-ai-text-primary shadow-[0_0_20px_rgba(120,220,255,0.15)] transition ${
        evolutionEnabled ? 'duration-[600ms] ease-out' : 'duration-200'
      }`}
      style={{
        width: NODE_WIDTH,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-accent" size={15} aria-hidden="true" />
        <span className="text-xs font-semibold">{node.label}</span>
      </div>

      {hoveredNode === node.id ? (
        <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-[220px] -translate-x-1/2 rounded-[10px] border border-ai-border bg-ai-surface/95 px-3 py-2 text-[11px] leading-relaxed text-ai-text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="font-semibold text-ai-text-primary">{node.label}</div>
          <div className="mt-0.5">{node.description}</div>
        </div>
      ) : null}
    </div>
  )
})

function pickLayout(width) {
  if (width < 768) return MOBILE_LAYOUT
  if (width < 1100) return TABLET_LAYOUT
  return DESKTOP_LAYOUT
}

function toPixelPosition(percentPos, width, height) {
  const x = (percentPos.x / 100) * width - NODE_WIDTH / 2
  const y = (percentPos.y / 100) * height - NODE_HEIGHT / 2
  return {
    x: Math.max(0, Math.min(width - NODE_WIDTH, x)),
    y: Math.max(0, Math.min(height - NODE_HEIGHT, y)),
  }
}

export function SystemArchitecturePlayground() {
  const containerRef = useRef(null)
  const dragRafRef = useRef(0)
  const evolutionRafRef = useRef(0)
  const dragEventRef = useRef(null)
  const draggingRef = useRef(null)
  const nodePositionsRef = useRef({})
  const lastEvolutionSwitchRef = useRef(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [nodePositions, setNodePositions] = useState({})
  const [hoveredNode, setHoveredNode] = useState(null)
  const [evolutionEnabled, setEvolutionEnabled] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      setContainerSize({ width: rect.width, height: rect.height })
    })
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  const applyLayout = (layout) => {
    if (!containerSize.width || !containerSize.height) return
    const next = {}
    NODES.forEach((node) => {
      next[node.id] = toPixelPosition(layout[node.id], containerSize.width, containerSize.height)
    })
    nodePositionsRef.current = next
    setNodePositions(next)
  }

  useEffect(() => {
    if (!containerSize.width || !containerSize.height) return

    applyLayout(pickLayout(containerSize.width))
  }, [containerSize.height, containerSize.width])

  useEffect(() => {
    if (!evolutionEnabled || containerSize.width < 768) return undefined

    const animateEvolution = (now) => {
      if (!lastEvolutionSwitchRef.current) {
        lastEvolutionSwitchRef.current = now
      }

      if (now - lastEvolutionSwitchRef.current >= EVOLUTION_STEP_MS) {
        setStageIndex((value) => (value + 1) % EVOLUTION_STAGES.length)
        lastEvolutionSwitchRef.current = now
      }

      evolutionRafRef.current = requestAnimationFrame(animateEvolution)
    }

    evolutionRafRef.current = requestAnimationFrame(animateEvolution)
    return () => {
      if (evolutionRafRef.current) cancelAnimationFrame(evolutionRafRef.current)
      lastEvolutionSwitchRef.current = 0
    }
  }, [containerSize.width, evolutionEnabled])

  useEffect(() => {
    if (!evolutionEnabled || !containerSize.width || containerSize.width < 768) return

    applyLayout(EVOLUTION_STAGES[stageIndex])
  }, [containerSize.height, containerSize.width, evolutionEnabled, stageIndex])

  useEffect(() => {
    const onPointerMove = (event) => {
      dragEventRef.current = event
      if (dragRafRef.current) return
      dragRafRef.current = requestAnimationFrame(() => {
        dragRafRef.current = 0
        const drag = draggingRef.current
        const latest = dragEventRef.current
        if (!drag || !latest || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const nextX = latest.clientX - rect.left - drag.offsetX
        const nextY = latest.clientY - rect.top - drag.offsetY
        setNodePositions((prev) => {
          const next = {
            ...prev,
            [drag.id]: {
              x: Math.max(0, Math.min(containerSize.width - NODE_WIDTH, nextX)),
              y: Math.max(0, Math.min(containerSize.height - NODE_HEIGHT, nextY)),
            },
          }
          nodePositionsRef.current = next
          return next
        })
      })
    }

    const onPointerUp = () => {
      draggingRef.current = null
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current)
    }
  }, [containerSize.height, containerSize.width])

  const handlePointerDown = (event, id) => {
    const position = nodePositions[id]
    if (!position || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    draggingRef.current = {
      id,
      offsetX: event.clientX - rect.left - position.x,
      offsetY: event.clientY - rect.top - position.y,
    }
  }

  const centers = useMemo(() => {
    const map = {}
    NODES.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return
      map[node.id] = {
        x: pos.x + NODE_WIDTH / 2,
        y: pos.y + NODE_HEIGHT / 2,
      }
    })
    return map
  }, [nodePositions])

  const linkGeometries = useMemo(
    () =>
      CONNECTIONS.map(([sourceId, targetId]) => {
        const source = centers[sourceId]
        const target = centers[targetId]
        if (!source || !target) return null
        return {
          id: `${sourceId}-${targetId}`,
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y,
          path: `M ${source.x} ${source.y} L ${target.x} ${target.y}`,
        }
      }).filter(Boolean),
    [centers]
  )

  return (
    <section
      id="architecture-playground"
      className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
      aria-label="System Architecture Playground"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Interactive Architecture
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
              System Architecture Playground
            </h2>
            <p className="max-w-2xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
              Drag components to design a scalable backend architecture.
            </p>
            <p className="mt-2 max-w-3xl text-xs text-ai-text-secondary/90 dark:text-ai-text-secondary">
              Designing backend systems is similar to chess strategy — every component must work
              together to control the board.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setEvolutionEnabled((value) => !value)
                setStageIndex(0)
              }}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              {evolutionEnabled ? 'Stop Architecture Evolution' : 'Show Architecture Evolution'}
            </button>
          </div>
        </Reveal>

        <Reveal>
          <div
            ref={containerRef}
            className="relative mx-auto h-[560px] w-full max-w-[1080px] overflow-hidden rounded-2xl border border-ai-border bg-ai-card/35"
          >
            <ArchitectureLinks linkGeometries={linkGeometries} />

            {NODES.map((node) => {
              const position = nodePositions[node.id]
              return (
                <ArchitectureNode
                  key={node.id}
                  node={node}
                  position={position}
                  evolutionEnabled={evolutionEnabled}
                  hoveredNode={hoveredNode}
                  onPointerDown={handlePointerDown}
                  onMouseEnter={setHoveredNode}
                  onMouseLeave={(id) => setHoveredNode((value) => (value === id ? null : value))}
                />
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
