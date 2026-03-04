import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { AboutPage } from './pages/About'
import { SkillsPage } from './pages/Skills'
import { ProjectsPage } from './pages/Projects'
import { ExperiencePage } from './pages/Experience'
import { ResumePage } from './pages/Resume'
import { ContactPage } from './pages/Contact'
import { PageLoader } from './components/ui/PageLoader'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    document.body.style.overflow = 'hidden'

    const timer = window.setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading ? <PageLoader key="page-loader" /> : null}
      </AnimatePresence>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
