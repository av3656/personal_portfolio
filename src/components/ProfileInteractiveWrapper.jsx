import { useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useMotionValue, useSpring } from 'framer-motion'

export function ProfileInteractiveWrapper({ children, imageSrc, imageAlt }) {
  const wrapperRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const smoothRotateX = useSpring(rotateX, { stiffness: 220, damping: 20, mass: 0.35 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 220, damping: 20, mass: 0.35 })

  const onMouseMove = (event) => {
    const el = wrapperRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    setSpotlight({ x: px, y: py })

    const normalizedX = (x - rect.width / 2) / (rect.width / 2)
    const normalizedY = (y - rect.height / 2) / (rect.height / 2)

    rotateY.set(normalizedX * 8)
    rotateX.set(-normalizedY * 8)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <>
      <Motion.div
        ref={wrapperRef}
        className="relative inline-block rounded-full"
        style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          resetTilt()
        }}
        onMouseMove={onMouseMove}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        role="button"
        tabIndex={0}
        aria-label="Open profile details"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
          }
        }}
      >
        <Motion.div
          className="absolute -inset-3 rounded-full"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}
        />

        <Motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(34,211,238,0.15), transparent 60%)`,
          }}
        />

        <AnimatePresence>
          {hovered && (
            <Motion.div
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-ai-surface/90 px-2.5 py-1 text-xs text-accent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              Click to know more
            </Motion.div>
          )}
        </AnimatePresence>

        {children}
      </Motion.div>

      <AnimatePresence>
        {open && (
          <Motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ai-navy/75 px-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <Motion.div
              className="relative w-full max-w-md rounded-2xl border border-ai-border bg-ai-card/90 p-5 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full border border-ai-border bg-ai-surface px-2 py-1 text-xs text-ai-text-secondary hover:text-accent"
              >
                Close
              </button>

              <div className="flex flex-col items-center gap-4 pt-2 text-center">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-40 w-40 rounded-full border border-ai-border object-cover shadow-lg"
                />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-ai-text-primary">Aman Verma</h3>
                  <p className="text-sm text-ai-text-secondary">
                    Backend-focused engineering student building scalable systems with Java, DSA, and cloud foundations.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-1 text-sm">
                    <a href="https://github.com/av3656" target="_blank" rel="noreferrer" className="text-accent hover:text-ai-violet-glow">GitHub</a>
                    <a href="https://www.linkedin.com/in/amanvermaavr0001" target="_blank" rel="noreferrer" className="text-accent hover:text-ai-violet-glow">LinkedIn</a>
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
