import { useCallback, useEffect, useRef, useState } from 'react'

const SECTION_IDS = ['intro', 'about', 'skills', 'projects', 'experience', 'resume', 'contact']

export function useActiveSectionForSidebar({ enabled = true, threshold = 0.6 } = {}) {
  const [activeSection, setActiveSection] = useState('intro')
  const ratiosRef = useRef(new Map())
  const manualLockRef = useRef(false)
  const manualTimerRef = useRef(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualLockRef.current) return

        entries.forEach((entry) => {
          const id = entry.target.id
          if (!id) return

          if (entry.isIntersecting) {
            ratiosRef.current.set(id, entry.intersectionRatio)
          } else {
            ratiosRef.current.delete(id)
          }
        })

        const visible = [...ratiosRef.current.entries()]
          .filter(([, ratio]) => ratio >= threshold)
          .sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1]
            return SECTION_IDS.indexOf(a[0]) - SECTION_IDS.indexOf(b[0])
          })

        if (visible.length > 0) {
          setActiveSection((prev) => (prev === visible[0][0] ? prev : visible[0][0]))
        }
      },
      {
        root: null,
        threshold: [0, threshold, 1],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      ratiosRef.current.clear()
    }
  }, [enabled, threshold])

  useEffect(
    () => () => {
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    },
    [],
  )

  const handleSidebarSectionClick = useCallback((id) => {
    setActiveSection(id)
    manualLockRef.current = true

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => {
      manualLockRef.current = false
    }, 650)

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return {
    activeSection,
    sectionIds: SECTION_IDS,
    handleSidebarSectionClick,
  }
}
