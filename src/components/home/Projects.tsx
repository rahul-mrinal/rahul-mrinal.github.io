import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { projects } from "../../data/profile";
import { FiLayers, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Projects() {
  const { ref, isVisible } = useScrollReveal();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 px-6 bg-[#0d0e14]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            Projects
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Key AI &amp; architecture projects
          </h3>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-teal via-accent to-border" />

          {projects.map((project, idx) => {
            const isExpanded = expandedIdx === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 * idx }}
                className="relative pl-12 pb-10 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] top-1 w-[15px] h-[15px] rounded-full border-2 border-accent-teal bg-[#0d0e14] z-10">
                  <div className="absolute inset-[3px] rounded-full bg-accent-teal" />
                </div>

                <div className="glass-card rounded-xl p-6 hover:border-accent-teal/40 transition-all hover:-translate-y-0.5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{project.title}</h4>
                      <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                        <FiLayers size={14} />
                        <span>{project.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {project.role}
                    </span>
                  </div>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-accent/20 text-accent bg-accent/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Highlights — show first 2 always, rest on expand */}
                  <ul className="space-y-2">
                    {project.highlights.slice(0, 2).map((h, hi) => (
                      <li
                        key={hi}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-teal flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 mt-2 overflow-hidden"
                      >
                        {project.highlights.slice(2).map((h, hi) => (
                          <li
                            key={hi}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-teal flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  {project.highlights.length > 2 && (
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-teal hover:text-accent-teal/80 transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Show less <FiChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          Show {project.highlights.length - 2} more highlights <FiChevronDown size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
