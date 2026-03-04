import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SkillsModal } from '../SkillsModal'
import { CursorTooltip } from '../CursorTooltip'
import { skillsCategories, skillsData } from '../../data/skillsData'

const badgeVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.05 * i, duration: 0.3 },
  }),
}

export function Skills() {
  const [modalType, setModalType] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef(null)
  const nextPositionRef = useRef({ x: 0, y: 0 })

  const selectedCategorySkills = useMemo(() => {
    if (!selectedCategory) return []
    return skillsData[selectedCategory] ?? []
  }, [selectedCategory])

  const selectedCategoryTitle = useMemo(() => {
    if (!selectedCategory) return ''
    return skillsCategories.find((category) => category.key === selectedCategory)?.title ?? ''
  }, [selectedCategory])

  const openCategoryModal = (categoryKey) => {
    setModalType('category')
    setSelectedCategory(categoryKey)
    setSelectedSkill(null)
  }

  const openSkillModal = (skill, categoryKey) => {
    setModalType('single')
    setSelectedCategory(categoryKey)
    setSelectedSkill(skill)
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedCategory(null)
    setSelectedSkill(null)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  const handleSkillMouseMove = (event) => {
    if (isMobile) return
    nextPositionRef.current = { x: event.clientX, y: event.clientY }
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      setMousePosition(nextPositionRef.current)
      rafRef.current = null
    })
  }

  return (
    <>
      <section
        id="skills"
        className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
        aria-label="Skills"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
                Skills
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
                A backend-leaning toolkit.
              </h2>
              <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
                I&apos;m building a strong foundation around Java and backend development while staying
                comfortable across the web stack.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {skillsCategories.map((category, idx) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="rounded-2xl border border-ai-border bg-ai-card/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-ai-border dark:bg-ai-card/80"
                role="button"
                tabIndex={0}
                onClick={() => openCategoryModal(category.key)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openCategoryModal(category.key)
                  }
                }}
              >
                <h3 className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">
                  {category.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(skillsData[category.key] ?? []).map((skill, i) => (
                    <motion.button
                      key={skill.name}
                      type="button"
                      custom={i}
                      variants={badgeVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.5 }}
                      onClick={(event) => {
                        event.stopPropagation()
                        openSkillModal(skill, category.key)
                      }}
                      onMouseEnter={() => {
                        if (!isMobile) setHoveredSkill(skill.name)
                      }}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onMouseMove={handleSkillMouseMove}
                      className="rounded-full border border-ai-border bg-ai-surface px-3 py-1 text-xs font-medium text-ai-text-secondary shadow-sm transition duration-200 hover:border-ai-violet hover:text-ai-violet-glow dark:border-ai-border dark:bg-ai-card dark:text-ai-text-secondary"
                      aria-label={`Open ${skill.name} skill details`}
                      title="Click to view detailed skill level"
                    >
                      {skill.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SkillsModal
        isOpen={modalType !== null}
        modalType={modalType}
        categoryTitle={selectedCategoryTitle}
        skills={selectedCategorySkills}
        selectedSkill={selectedSkill}
        onClose={closeModal}
      />
      <CursorTooltip
        visible={!isMobile && hoveredSkill !== null && modalType === null}
        x={mousePosition.x}
        y={mousePosition.y}
        text="Click to view detailed skill level"
      />
    </>
  )
}
