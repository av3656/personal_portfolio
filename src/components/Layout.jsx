import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
}

export function Layout() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { activeSection, sectionIds, scrollToSection } = useActiveSection({
    enabled: isHomePage,
    rootId: 'scroll-root',
    threshold: 0.6,
    rootMargin: '-40% 0px -40% 0px',
    debounceMs: 80,
  })

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-surface-light text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Sidebar
        activeSection={activeSection}
        sectionIds={sectionIds}
        onSectionClick={scrollToSection}
      />

      <div className="mt-16 flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex min-h-[calc(100vh-4rem)] ${isHomePage ? 'snap-y snap-mandatory' : ''}`}
          >
            <div id="scroll-root" className="relative z-10 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </motion.main>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}
