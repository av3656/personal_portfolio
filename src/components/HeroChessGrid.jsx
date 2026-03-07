function getCellCenter(board, square) {
  return {
    x: board.offsetX + (square.col + 0.5) * board.cellWidth,
    y: board.offsetY + (square.row + 0.5) * board.cellHeight,
  }
}

export function HeroChessGrid({
  board,
  tour = [],
  stepIndex = 0,
  phase = 'running',
  cycleId = 0,
}) {
  const hasBoard = board.width > 0 && board.height > 0
  if (!hasBoard) return null

  const visitedSquares = tour.slice(0, stepIndex + 1)
  const segments = visitedSquares.slice(1).map((to, index) => ({
    from: visitedSquares[index],
    to,
    id: `${index}-${to.row}-${to.col}`,
  }))
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${phase === 'fade' ? 'hero-tour-fade' : ''}`}
      aria-hidden="true"
      key={`tour-${cycleId}`}
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <pattern
            id={`hero-chess-grid-${cycleId}`}
            width={board.cellWidth}
            height={board.cellHeight}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={board.cellWidth}
              height={board.cellHeight}
              fill="none"
              stroke="var(--hero-tour-grid)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          x={board.offsetX}
          y={board.offsetY}
          width={board.boardWidth}
          height={board.boardHeight}
          fill={`url(#hero-chess-grid-${cycleId})`}
          className="hero-tour-grid"
        />

        {segments.map((segment, index) => {
          const from = getCellCenter(board, segment.from)
          const to = getCellCenter(board, segment.to)
          const isLatest = index === segments.length - 1
          return (
            <line
              key={segment.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`hero-tour-line ${isLatest ? 'hero-tour-line-new' : ''}`}
            />
          )
        })}

        {visitedSquares.map((square, index) => {
          const point = getCellCenter(board, square)
          const isLatest = index === visitedSquares.length - 1
          return (
            <circle
              key={`${square.row}-${square.col}-${index}`}
              cx={point.x}
              cy={point.y}
              r={3}
              className={`hero-tour-node ${isLatest ? 'hero-tour-node-new' : ''}`}
            />
          )
        })}

      </svg>
    </div>
  )
}
