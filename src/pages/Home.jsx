import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Skills } from '../components/sections/Skills'
import { Projects } from '../components/sections/Projects'
import { Experience } from '../components/sections/Experience'
import { Resume } from '../components/sections/Resume'
import { Contact } from '../components/sections/Contact'
import { usePageMeta } from '../hooks/usePageMeta'

export function Home() {
  usePageMeta('Home', 'Portfolio landing page with intro, CTA, and overview.')
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Resume />
      <Contact />
    </>
  )
}
