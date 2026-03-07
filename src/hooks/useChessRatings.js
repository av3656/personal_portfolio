import { useEffect, useState } from 'react'

const INITIAL_RATINGS = {
  chesscom: {
    rapid: null,
    blitz: null,
    puzzle: null,
  },
  lichess: {
    rapid: null,
    puzzle: null,
  },
}

export function useChessRatings() {
  const [ratings, setRatings] = useState(INITIAL_RATINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchRatings = async () => {
      setLoading(true)
      setError(false)

      try {
        const [chessRes, lichessRes] = await Promise.all([
          fetch('https://api.chess.com/pub/player/aman-avr/stats', {
            signal: abortController.signal,
          }),
          fetch('https://lichess.org/api/user/av3656', {
            signal: abortController.signal,
            headers: {
              Accept: 'application/json',
            },
          }),
        ])

        if (!chessRes.ok || !lichessRes.ok) {
          throw new Error('Failed to fetch chess ratings')
        }

        const chessData = await chessRes.json()
        const lichessData = await lichessRes.json()

        setRatings({
          chesscom: {
            rapid: chessData?.chess_rapid?.last?.rating ?? null,
            blitz: chessData?.chess_blitz?.last?.rating ?? null,
            puzzle: chessData?.tactics?.highest?.rating ?? null,
          },
          lichess: {
            rapid: lichessData?.perfs?.rapid?.rating ?? null,
            puzzle: lichessData?.perfs?.puzzle?.rating ?? null,
          },
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()

    return () => abortController.abort()
  }, [])

  return { ratings, loading, error }
}
