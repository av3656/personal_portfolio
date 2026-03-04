import { useEffect, useState } from 'react'
import { TechBackgroundSlider } from './TechBackgroundSlider'
import { TechTextMarquee } from './TechTextMarquee'
import { FloatingCode } from './FloatingCode'
import { SectionDivider } from './SectionDivider'

export function VisualEnhancements() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#0f172a]/20 to-[#1e1b4b]/28" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.09),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(168,85,247,0.08),transparent_42%),radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_55%)]" />
      <TechBackgroundSlider mobile={mobile} />
      <TechTextMarquee mobile={mobile} />
      <FloatingCode mobile={mobile} />
      <SectionDivider mobile={mobile} />
    </div>
  )
}
