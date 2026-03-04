import { motion as Motion } from 'framer-motion'

export function FloatingJavaCode({ snippet, top, left, right, rotate = 0, duration = 8, delay = 0, mobile = false }) {
  const style = {
    top,
    left,
    right,
    opacity: mobile ? 0.12 : 1,
    filter: 'blur(0.6px)',
    textShadow: '0 0 6px rgba(34,211,238,0.25)',
    willChange: 'transform',
  }

  return (
    <Motion.pre
      className="absolute m-0 font-mono text-[11px] leading-5 text-[rgba(34,211,238,0.18)]"
      style={style}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {snippet}
    </Motion.pre>
  )
}
