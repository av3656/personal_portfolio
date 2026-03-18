import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { Reveal } from "../ui/Reveal";

const projects = [
  {
    id: "packet-analyzer",
    title: "Network Packet Analyzer",
    description:
      "A Java-based tool for inspecting and analyzing network packets, helping understand protocols and low-level data flow.",
    tech: ["Java", "Sockets", "Networking"],
    github: "https://github.com/your-username/packet-analyzer",
    demo: "#",
    images: ["/previews/packet-1.svg", "/previews/packet-2.svg"],
  },
  {
    id: "backend-api",
    title: "Clean Backend API",
    description:
      "REST API with layered architecture, input validation, and clear separation of concerns for maintainable backend services.",
    tech: ["Java", "REST", "Design Patterns"],
    github: "https://github.com/your-username/backend-api",
    demo: "#",
    images: ['/previews/backend-1.svg', '/previews/backend-2.svg'],
  },
  {
    id: "dsa-visualizer",
    title: "DSA Visualizer",
    description:
      "Interactive visualizations for data structures and algorithms to build deeper intuition while solving problems.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/your-username/dsa-visualizer",
    demo: "#",
    images: ['/previews/dsa-1.svg', '/previews/dsa-2.svg'],
  },
];

export function Projects() {
  const [active, setActive] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const openModal = (project) => {
    setActive(project);
    setImageIndex(0);
  };

  const closeModal = () => {
    setActive(null);
  };

  const nextImage = () => {
    if (!active) return;
    setImageIndex((prev) => (prev + 1) % active.images.length);
  };

  return (
    <section
      id="projects"
      className="flex min-h-screen snap-start items-center bg-gradient-to-b from-ai-navy to-ai-surface px-4 py-24 dark:from-ai-navy dark:to-ai-surface"
      aria-label="Projects"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Projects
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
              Selected work with a backend mindset.
            </h2>
            <p className="max-w-xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
              A mix of systems-oriented projects and learning experiments that
              focus on clarity, structure, and performance.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <article
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ai-border bg-ai-card/80 shadow-sm shadow-slate-900/5 backdrop-blur transition hover:-translate-y-2 hover:border-ai-violet/30 hover:shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] dark:border-ai-border dark:bg-ai-card/80"
                onClick={() => openModal(project)}
              >
                <div className="relative h-40 overflow-hidden bg-ai-surface/60 dark:bg-ai-surface/60">
                  <img 
                    src={project.images[0]} 
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center bg-ai-navy/60 text-xs font-medium uppercase tracking-[0.25em] text-ai-text-secondary dark:text-ai-text-secondary"
                  >
                    Project Preview
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ai-navy/20 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ai-text-primary dark:text-ai-text-primary">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs text-ai-text-secondary dark:text-ai-text-secondary">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-ai-surface px-2 py-0.5 text-[10px] font-medium text-ai-text-secondary dark:bg-ai-surface dark:text-ai-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 text-ai-text-secondary">
                      <FiGithub aria-hidden="true" />
                      <FiExternalLink aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ai-navy/60 px-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-ai-border bg-ai-card/90 p-5 shadow-2xl"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full border border-ai-border bg-ai-card/80 p-1.5 text-ai-text-secondary hover:text-ai-text-primary"
                aria-label="Close project details"
              >
                <FiX size={16} />
              </button>

              <div className="flex flex-col gap-5 md:flex-row">
                <div className="md:w-2/3">
                  <div className="relative h-52 overflow-hidden rounded-2xl bg-ai-surface">
                    <img 
                      src={active.images[imageIndex]} 
                      alt={`${active.title} preview ${imageIndex + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {active.images.length > 1 && (
                    <button
                      type="button"
                      onClick={nextImage}
                      className="mt-3 text-xs font-medium text-ai-text-secondary underline-offset-4 hover:underline"
                    >
                      Next preview
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
                    Project
                  </p>
                  <h3 className="text-lg font-semibold text-ai-text-primary">
                    {active.title}
                  </h3>
                  <p className="text-xs text-ai-text-secondary">
                    {active.description}
                  </p>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ai-text-secondary">
                      Tech Breakdown
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-ai-surface px-3 py-1 text-[10px] font-medium text-ai-text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium">
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-ai-surface px-3 py-1.5 text-ai-text-primary hover:bg-ai-card"
                    >
                      <FiGithub size={14} />
                      GitHub
                    </a>
                    <a
                      href={active.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-ai-violet bg-ai-violet/10 px-3 py-1.5 text-ai-violet hover:bg-ai-violet/20"
                    >
                      <FiExternalLink size={14} />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
