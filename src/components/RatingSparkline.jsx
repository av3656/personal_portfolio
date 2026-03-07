import { useEffect, useId, useMemo, useRef, useState } from 'react'

export function RatingSparkline({ ratings = [] }) {
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const gradientId = useId().replace(/:/g, '')

  const normalizedRatings = useMemo(
    () => ratings.filter((value) => typeof value === 'number'),
    [ratings]
  )

  const { linePath, areaPath } = useMemo(() => {
    if (normalizedRatings.length < 2) {
      return {
        linePath: 'M 0 15 L 100 15',
        areaPath: 'M 0 30 L 0 15 L 100 15 L 100 30 Z',
      }
    }

    const minRating = Math.min(...normalizedRatings)
    const maxRating = Math.max(...normalizedRatings)
    const range = maxRating - minRating || 1

    const points = normalizedRatings.map((rating, index) => {
      const x = (index / (normalizedRatings.length - 1)) * 100
      const y = 26 - ((rating - minRating) / range) * 20
      return { x, y }
    })

    const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
    const area = `${line} L 100 30 L 0 30 Z`

    return { linePath: line, areaPath: area }
  }, [normalizedRatings])

  useEffect(() => {
    if (!pathRef.current) return
    const length = pathRef.current.getTotalLength()
    setPathLength(length)
  }, [linePath])

  return (
    <div className="mt-2 h-[30px] w-full">
      <svg viewBox="0 0 100 30" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill={`url(#${gradientId})`} />

        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength || undefined}
          strokeDashoffset={pathLength || undefined}
          className="sparkline-draw opacity-80"
        />
      </svg>
    </div>
  )
}
