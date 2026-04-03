import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { experience } from "../../data/profile";
import { FiBriefcase } from "react-icons/fi";

export default function Experience() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="experience" className="py-24 px-6 bg-[#0d0e14]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#00c9a7] mb-3">
            Experience
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Professional journey
          </h3>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#6c63ff] via-[#00c9a7] to-[#2a2d3a]" />

          {experience.map((company, ci) => (
            <div key={ci} className="mb-12 last:mb-0">
              {company.roles.map((role, ri) => {
                const globalIndex = ci * 3 + ri;
                return (
                  <motion.div
                    key={ri}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * globalIndex }}
                    className="relative pl-12 pb-10 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[12px] top-1 w-[15px] h-[15px] rounded-full border-2 border-[#6c63ff] bg-[#0d0e14] z-10 group-hover:bg-[#6c63ff] transition-colors">
                      <div className="absolute inset-[3px] rounded-full bg-[#6c63ff]" />
                    </div>

                    <div className="glass-card rounded-xl p-6 hover:border-[#6c63ff]/40 transition-all hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{role.title}</h4>
                          <div className="flex items-center gap-2 text-[#9398ab] text-sm mt-1">
                            <FiBriefcase size={14} />
                            <span>
                              {company.company} &middot; {company.location}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#6c63ff] bg-[#6c63ff]/10 px-3 py-1 rounded-full whitespace-nowrap">
                          {role.period}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {role.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-2 text-sm text-[#9398ab]"
                          >
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#00c9a7] flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
