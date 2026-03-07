export async function getChessComRatings(username, signal) {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Chess.com ratings')
  }

  const data = await response.json()

  return {
    rapid: data?.chess_rapid?.last?.rating ?? null,
    blitz: data?.chess_blitz?.last?.rating ?? null,
    puzzle: data?.tactics?.highest?.rating ?? null,
  }
}

export async function getLichessRatings(username, signal) {
  const response = await fetch(`https://lichess.org/api/user/${username}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Lichess ratings')
  }

  const data = await response.json()

  return {
    rapid: data?.perfs?.rapid?.rating ?? null,
    puzzle: data?.perfs?.puzzle?.rating ?? null,
  }
}

export async function getLichessRatingHistory(username, signal) {
  const response = await fetch(`https://lichess.org/api/user/${username}/rating-history`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Lichess rating history')
  }

  const data = await response.json()
  const rapidEntry = data.find((entry) => entry?.name?.toLowerCase() === 'rapid')
  const puzzleEntry = data.find((entry) => entry?.name?.toLowerCase().includes('puzzle'))

  const mapPoints = (points = []) =>
    points
      .map((point) => point?.[3] ?? null)
      .filter((value) => typeof value === 'number')
      .slice(-14)

  return {
    rapid: mapPoints(rapidEntry?.points),
    puzzle: mapPoints(puzzleEntry?.points),
  }
}
