import { useEffect, useState } from 'react'
import {
  getChessComRatings,
  getLichessRatingHistory,
  getLichessRatings,
} from '../services/chessRatings'

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

const REFRESH_INTERVAL_MS = 10 * 60 * 1000
const INITIAL_HISTORY = {
  rapid: [],
  puzzle: [],
}

export function useChessRatings(chessUsername = 'aman-avr', lichessUsername = 'av3656') {
  const [ratings, setRatings] = useState(INITIAL_RATINGS)
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let activeController = null

    const fetchRatings = async () => {
      setLoading(true)
      setError(false)
      activeController?.abort()
      activeController = new AbortController()

      try {
        const [chessRes, lichessRes, lichessHistoryRes] = await Promise.all([
          getChessComRatings(chessUsername, activeController.signal),
          getLichessRatings(lichessUsername, activeController.signal),
          getLichessRatingHistory(lichessUsername, activeController.signal),
        ])

        setRatings({
          chesscom: {
            rapid: chessRes.rapid,
            blitz: chessRes.blitz,
            puzzle: chessRes.puzzle,
          },
          lichess: {
            rapid: lichessRes.rapid,
            puzzle: lichessRes.puzzle,
          },
        })
        setHistory({
          rapid: lichessHistoryRes.rapid,
          puzzle: lichessHistoryRes.puzzle,
        })
        setLastUpdated(new Date())
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
    const intervalId = setInterval(fetchRatings, REFRESH_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
      activeController?.abort()
    }
  }, [chessUsername, lichessUsername])

  return { ratings, history, loading, error, lastUpdated }
}
