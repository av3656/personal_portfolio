import { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as d3 from 'd3'
import { FaAws, FaJava } from 'react-icons/fa6'
import { SiDocker, SiFastapi, SiGithub, SiPostgresql, SiSpringboot } from 'react-icons/si'
import { Reveal } from '../components/ui/Reveal'

const NODES = [
  { id: 'Java', icon: FaJava, radius: 34 },
  { id: 'Spring Boot', icon: SiSpringboot, radius: 24 },
  { id: 'REST APIs', icon: SiFastapi, radius: 24 },
  { id: 'Docker', icon: SiDocker, radius: 24 },
  { id: 'PostgreSQL', icon: SiPostgresql, radius: 24 },
  { id: 'AWS', icon: FaAws, radius: 24 },
  { id: 'GitHub', icon: SiGithub, radius: 24 },
]

const LINKS = [
  { source: 'Java', target: 'Spring Boot' },
  { source: 'Spring Boot', target: 'REST APIs' },
  { source: 'REST APIs', target: 'PostgreSQL' },
  { source: 'Docker', target: 'Spring Boot' },
  { source: 'GitHub', target: 'Docker' },
  { source: 'AWS', target: 'PostgreSQL' },
]

export function TechStack() {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = window.document.documentElement
    const syncTheme = () => setIsDark(root.classList.contains('dark'))
    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const svgElement = svgRef.current
    if (!container || !svgElement) return undefined

    const width = container.clientWidth || 720
    const height = container.clientHeight || 420
    const centerX = width / 2
    const centerY = height / 2
    const lineColor = isDark ? 'rgba(34,211,238,0.7)' : 'rgba(148,163,184,0.7)'
    const edgeColor = isDark ? 'rgba(56,189,248,0.35)' : 'rgba(148,163,184,0.7)'
    const labelColor = isDark ? 'rgb(103,232,249)' : 'rgb(51,65,85)'

    const nodes = NODES.map((node) => ({ ...node, x: centerX, y: centerY, scale: 1 }))
    const links = LINKS.map((link) => ({ ...link }))

    const svg = d3.select(svgElement)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet')

    const defs = svg.append('defs')
    const gridPattern = defs
      .append('pattern')
      .attr('id', 'tech-grid-pattern')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse')

    gridPattern
      .append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(56,189,248,0.3)')
      .attr('stroke-width', 0.6)

    const glowFilter = defs.append('filter').attr('id', 'line-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    glowFilter.append('feGaussianBlur').attr('stdDeviation', 1.5).attr('result', 'blur')
    glowFilter.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', (d) => d)

    svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'url(#tech-grid-pattern)').attr('opacity', 0.05)

    const lineLayer = svg.append('g')
    const particleLayer = svg.append('g')
    const nodeLayer = svg.append('g')

    const lineSelection = lineLayer
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', lineColor)
      .attr('stroke-width', 1.6)
      .attr('opacity', 0.7)
      .attr('filter', 'url(#line-glow)')

    const particleSelection = particleLayer
      .selectAll('circle')
      .data(links)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#38bdf8')
      .attr('opacity', 0.95)
      .attr('style', 'filter: drop-shadow(0 0 5px rgba(56,189,248,0.85));')

    const nodeSelection = nodeLayer
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'grab')

    nodeSelection
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', 'rgba(15,23,42,0.95)')
      .attr('stroke', 'rgba(56,189,248,0.4)')
      .attr('stroke-width', 1)
      .attr('style', 'filter: drop-shadow(0 0 16px rgba(56,189,248,0.55));')

    nodeSelection
      .append('foreignObject')
      .attr('x', -18)
      .attr('y', -18)
      .attr('width', 36)
      .attr('height', 36)
      .append('xhtml:div')
      .style('width', '36px')
      .style('height', '36px')
      .style('display', 'grid')
      .style('place-items', 'center')
      .style('pointer-events', 'none')
      .html((d) => renderToStaticMarkup(<d.icon size={26} color="#38bdf8" />))

    nodeSelection
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('dy', (d) => d.radius + 8)
      .attr('fill', labelColor)
      .attr('font-size', 11)
      .attr('font-weight', 500)
      .attr('letter-spacing', 0.4)
      .text((d) => d.id)

    const linkForce = d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(isMobile ? 95 : 120)

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(isMobile ? -170 : -250))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide().radius((d) => d.radius + 30))
      .velocityDecay(0.6)

    if (isMobile) {
      const mobileOrder = ['Java', 'Spring Boot', 'REST APIs', 'Docker', 'PostgreSQL', 'GitHub', 'AWS']
      simulation
        .force(
          'x',
          d3
            .forceX((d) => centerX)
            .strength(0.25),
        )
        .force(
          'y',
          d3
            .forceY((d) => {
              const idx = mobileOrder.indexOf(d.id)
              const normalized = idx === -1 ? 0 : idx
              return 50 + normalized * ((height - 100) / (mobileOrder.length - 1))
            })
            .strength(0.3),
        )
    }

    let rafId = null
    const dataStart = performance.now()

    const render = () => {
      lineSelection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      const elapsed = (performance.now() - dataStart) / 1000
      particleSelection
        .attr('cx', (d, i) => {
          const t = ((elapsed + i * 0.3) % 3) / 3
          return d.source.x + (d.target.x - d.source.x) * t
        })
        .attr('cy', (d, i) => {
          const t = ((elapsed + i * 0.3) % 3) / 3
          return d.source.y + (d.target.y - d.source.y) * t
        })

      nodeSelection.attr('transform', (d) => `translate(${d.x},${d.y}) scale(${d.scale || 1})`)
    }

    const requestRender = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        render()
      })
    }

    simulation.on('tick', requestRender)
    requestRender()

    nodeSelection
      .on('mouseenter', (_, hovered) => {
        hovered.scale = 1.2
        lineSelection.attr('stroke', (line) => {
          const sid = line.source.id
          const tid = line.target.id
          return sid === hovered.id || tid === hovered.id
            ? 'rgba(56,189,248,0.9)'
            : edgeColor
        })
        nodeSelection.select('circle').attr('style', (d) => {
          const intense = d.id === hovered.id ? '0.95' : '0.55'
          return `filter: drop-shadow(0 0 16px rgba(56,189,248,${intense}));`
        })
        requestRender()
      })
      .on('mouseleave', (_, hovered) => {
        hovered.scale = 1
        lineSelection.attr('stroke', lineColor)
        nodeSelection.select('circle').attr('style', 'filter: drop-shadow(0 0 16px rgba(56,189,248,0.55));')
        requestRender()
      })

    const drag = d3
      .drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
        requestRender()
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeSelection.call(drag)

    return () => {
      simulation.stop()
      if (rafId) cancelAnimationFrame(rafId)
      svg.selectAll('*').remove()
    }
  }, [isMobile, isDark])

  return (
    <section
      id="tech-stack"
      className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
      aria-label="Tech Stack Visualization"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Tech Stack Visualization
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
              Backend Tech Stack
            </h2>
            <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
              Technologies I use to build scalable backend systems.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div ref={containerRef} className="relative mx-auto h-[420px] w-full max-w-[720px]">
            <svg ref={svgRef} className="h-full w-full" aria-label="Backend stack graph visualization" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
