import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { skills } from "../../data/profile";

export default function Skills() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#ff6b6b] mb-3">
            Skills
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Technical expertise
          </h3>
        </motion.div>

        <div className="space-y-8">
          {skills.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 25 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * gi }}
            >
              <h4
                className="text-sm font-semibold mb-4"
                style={{ color: group.color }}
              >
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={si}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.1 * gi + 0.03 * si }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium border cursor-default transition-colors"
                    style={{
                      borderColor: `${group.color}30`,
                      color: group.color,
                      backgroundColor: `${group.color}08`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
