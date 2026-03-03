import { useCallback, useEffect, useRef, useState } from 'react'

const SECTION_IDS = ['intro', 'about', 'skills', 'projects', 'experience', 'resume', 'contact']

export function useActiveSection({
  enabled = true,
  rootId = 'scroll-root',
  threshold = 0.6,
  rootMargin = '-40% 0px -40% 0px',
  debounceMs = 80,
} = {}) {
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0])
  const manualLockRef = useRef(false)
  const manualTimerRef = useRef(null)
  const debounceTimerRef = useRef(null)
  const ratiosRef = useRef(new Map())

  const updateActiveSection = useCallback(
    (id) => {
      if (!id) return
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        setActiveSection((prev) => (prev === id ? prev : id))
      }, debounceMs)
    },
    [debounceMs],
  )

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const rootElement = document.getElementById(rootId) || null
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)

    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualLockRef.current) return

        entries.forEach((entry) => {
          const id = entry.target.id
          if (!id) return
          if (entry.isIntersecting) ratiosRef.current.set(id, entry.intersectionRatio)
          else ratiosRef.current.delete(id)
        })

        const visibleIds = [...ratiosRef.current.entries()]
          .filter(([, ratio]) => ratio >= threshold)
          .sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1]
            return SECTION_IDS.indexOf(a[0]) - SECTION_IDS.indexOf(b[0])
          })

        if (visibleIds.length > 0) updateActiveSection(visibleIds[0][0])
      },
      {
        root: rootElement,
        rootMargin,
        threshold: [0, 0.25, 0.5, threshold, 0.75, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      ratiosRef.current.clear()
    }
  }, [enabled, rootId, rootMargin, threshold, updateActiveSection])

  useEffect(
    () => () => {
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    },
    [],
  )

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return

    setActiveSection(id)
    manualLockRef.current = true

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => {
      manualLockRef.current = false
    }, 700)

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return {
    activeSection,
    sectionIds: SECTION_IDS,
    scrollToSection,
  }
}
