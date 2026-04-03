import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { education, certifications, awards } from "../../data/profile";
import { FiBookOpen, FiAward, FiCheckCircle } from "react-icons/fi";

export default function Education() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="education" className="py-24 px-6 bg-[#0d0e14]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#ffd93d] mb-3">
            Education & Recognition
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Credentials
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <FiBookOpen className="text-[#ffd93d]" size={18} />
              <h4 className="text-white font-semibold">Education</h4>
            </div>
            <div className="space-y-4">
              {education.map((ed, i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-white font-medium text-sm">{ed.degree}</h5>
                    {ed.ongoing && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00c9a7] bg-[#00c9a7]/10 px-2 py-0.5 rounded-full">
                        Ongoing
                      </span>
                    )}
                  </div>
                  <p className="text-[#9398ab] text-xs">{ed.institution}</p>
                  <p className="text-[#6d7290] text-xs mt-1">{ed.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <FiCheckCircle className="text-[#6c63ff]" size={18} />
              <h4 className="text-white font-semibold">Certifications</h4>
            </div>
            <div className="space-y-4">
              {certifications.map((c, i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <h5 className="text-white font-medium text-sm mb-1">{c.name}</h5>
                  <p className="text-[#9398ab] text-xs">{c.issuer}</p>
                  {c.detail && (
                    <p className="text-[#6d7290] text-xs mt-1">{c.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <FiAward className="text-[#ff6b6b]" size={18} />
              <h4 className="text-white font-semibold">Awards</h4>
            </div>
            <div className="space-y-4">
              {awards.map((a, i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <h5 className="text-white font-medium text-sm">{a.title}</h5>
                  <p className="text-[#9398ab] text-xs">{a.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#6d7290] text-xs">{a.company}</span>
                    <span className="text-[#6d7290] text-xs">{a.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
