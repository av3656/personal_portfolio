import { motion as Motion } from 'framer-motion'

const words = [
  'SYSTEM DESIGN',
  'BACKEND ENGINEERING',
  'JAVA DEVELOPMENT',
  'CLOUD ARCHITECTURE',
  'DATA STRUCTURES',
  'ALGORITHMS',
  'SCALABLE SYSTEMS',
  'API DESIGN',
  'MICROSERVICES',
  'SOFTWARE ENGINEERING',
]

function Row({ reverse = false, mobile = false }) {
  const line = `${words.join('   •   ')}   •   ${words.join('   •   ')}`
  return (
    <Motion.div
      className="whitespace-nowrap will-change-transform"
      animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
      transition={{ duration: mobile ? 80 : 62, ease: 'linear', repeat: Infinity }}
    >
      <span className="bg-gradient-to-r from-sky-300/40 via-indigo-300/25 to-cyan-200/35 bg-clip-text text-[clamp(84px,11vw,160px)] font-thin tracking-[0.08em] text-transparent">
        {line}
      </span>
    </Motion.div>
  )
}

export function TechTextMarquee({ mobile = false }) {
  if (mobile) return null

  return (
    <div className="absolute inset-x-0 top-[30%] overflow-hidden opacity-[0.06] blur-[0.6px]">
      <Row mobile={mobile} />
      <div className="mt-6">
        <Row reverse mobile={mobile} />
      </div>
    </div>
  )
}
