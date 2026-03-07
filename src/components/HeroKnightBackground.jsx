import { useEffect, useMemo, useRef, useState } from 'react'
import { HeroChessGrid } from './HeroChessGrid'

const KNIGHT_MOVES = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
]

const GRID_COLS = 8
const GRID_ROWS = 6
const MOVE_DURATION_MS = 2000
const STEP_PERIOD_MS = 5300
const TOUR_COMPLETE_PAUSE_MS = 6000
const TOUR_FADE_MS = 5000

const keyOf = (row, col) => `${row}-${col}`
const isInsideBoard = (row, col) => row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS

function countOnwardMoves(row, col, visited) {
  let count = 0
  for (const [dRow, dCol] of KNIGHT_MOVES) {
    const nextRow = row + dRow
    const nextCol = col + dCol
    if (isInsideBoard(nextRow, nextCol) && !visited.has(keyOf(nextRow, nextCol))) {
      count += 1
    }
  }
  return count
}

function buildKnightTour(startRow, startCol) {
  const totalSquares = GRID_ROWS * GRID_COLS
  const visited = new Set([keyOf(startRow, startCol)])
  const path = [{ row: startRow, col: startCol }]

  while (path.length < totalSquares) {
    const current = path[path.length - 1]
    const candidates = []

    for (const [dRow, dCol] of KNIGHT_MOVES) {
      const nextRow = current.row + dRow
      const nextCol = current.col + dCol
      if (!isInsideBoard(nextRow, nextCol)) continue
      if (visited.has(keyOf(nextRow, nextCol))) continue
      candidates.push({
        row: nextRow,
        col: nextCol,
        onward: countOnwardMoves(nextRow, nextCol, visited),
      })
    }

    if (!candidates.length) return null

    candidates.sort((a, b) => {
      if (a.onward !== b.onward) return a.onward - b.onward
      return Math.random() - 0.5
    })

    const next = candidates[0]
    visited.add(keyOf(next.row, next.col))
    path.push({ row: next.row, col: next.col })
  }

  return path
}

function generateTourWithRetries(maxRetries = 80) {
  for (let index = 0; index < maxRetries; index += 1) {
    const startRow = Math.floor(Math.random() * GRID_ROWS)
    const startCol = Math.floor(Math.random() * GRID_COLS)
    const path = buildKnightTour(startRow, startCol)
    if (path) return path
  }
  return null
}

export function HeroKnightBackground() {
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const lastStepTimeRef = useRef(0)
  const phaseStartTimeRef = useRef(0)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [tourPath, setTourPath] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState('running')
  const [cycleId, setCycleId] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setContainerSize({ width, height })
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  const resetTour = () => {
    const nextTour = generateTourWithRetries() ?? [{ row: 0, col: 0 }]
    setTourPath(nextTour)
    setStepIndex(0)
    setPhase('running')
    setCycleId((value) => value + 1)
    const now = performance.now()
    lastStepTimeRef.current = now
    phaseStartTimeRef.current = now
  }

  useEffect(() => {
    if (!containerSize.width || !containerSize.height) return
    resetTour()
  }, [containerSize.height, containerSize.width])

  const board = useMemo(() => {
    if (!containerSize.width || !containerSize.height) {
      return {
        width: 0,
        height: 0,
        boardWidth: 0,
        boardHeight: 0,
        offsetX: 0,
        offsetY: 0,
        cellWidth: 0,
        cellHeight: 0,
      }
    }

    const boardWidth = containerSize.width * 0.9
    const boardHeight = containerSize.height * 0.86
    const offsetX = (containerSize.width - boardWidth) / 2
    const offsetY = (containerSize.height - boardHeight) / 2
    const cellWidth = boardWidth / GRID_COLS
    const cellHeight = boardHeight / GRID_ROWS

    return {
      width: containerSize.width,
      height: containerSize.height,
      boardWidth,
      boardHeight,
      offsetX,
      offsetY,
      cellWidth,
      cellHeight,
    }
  }, [containerSize.height, containerSize.width])

  useEffect(() => {
    if (!tourPath.length) return undefined

    const animate = (now) => {
      if (phase === 'running') {
        if (stepIndex < tourPath.length - 1 && now - lastStepTimeRef.current >= STEP_PERIOD_MS) {
          setStepIndex((value) => value + 1)
          lastStepTimeRef.current = now
        } else if (stepIndex >= tourPath.length - 1 && now - lastStepTimeRef.current >= TOUR_COMPLETE_PAUSE_MS) {
          setPhase('fade')
          phaseStartTimeRef.current = now
        }
      } else if (phase === 'fade') {
        if (now - phaseStartTimeRef.current >= TOUR_FADE_MS) {
          resetTour()
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [phase, stepIndex, tourPath])

  const position = tourPath[stepIndex] || { row: 0, col: 0 }

  const transform = useMemo(() => {
    if (!board.width || !board.height) {
      return 'translate(0px, 0px) translate(-50%, -50%)'
    }

    const x = board.offsetX + (position.col + 0.5) * board.cellWidth
    const y = board.offsetY + (position.row + 0.5) * board.cellHeight

    return `translate(${x}px, ${y}px) translate(-50%, -50%)`
  }, [board, position.col, position.row])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <HeroChessGrid
        board={board}
        tour={tourPath}
        stepIndex={stepIndex}
        phase={phase}
        cycleId={cycleId}
      />

      <div
        className="absolute transition-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform,
          transitionDuration: `${MOVE_DURATION_MS}ms`,
        }}
      >
        <span
          className="pointer-events-auto relative z-0 select-none text-[68px] text-[rgba(30,100,160,0.08)] [filter:drop-shadow(0_0_8px_rgba(120,220,255,0.35))] dark:text-[rgba(120,220,255,0.12)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Knight's Tour algorithm visualization"
          role="img"
        >
          ♞
        </span>

        <div
          className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-[240px] -translate-x-1/2 rounded-[10px] border px-3.5 py-2.5 text-left text-[12px] leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur transition-all duration-200 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          } border-[rgba(0,120,200,0.25)] bg-[rgba(255,255,255,0.92)] text-[#0f2a3a] dark:border-[rgba(120,220,255,0.25)] dark:bg-[rgba(15,25,40,0.9)] dark:text-[#cdefff]`}
        >
          <div className="mb-1 text-[13px] font-semibold">Knight&apos;s Tour Algorithm</div>
          <div>
            This knight is solving the famous Knight&apos;s Tour problem — a classic algorithmic
            challenge where a knight must visit every square of a chessboard exactly once.
          </div>
        </div>
      </div>
    </div>
  )
}
