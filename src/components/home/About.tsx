import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { profile } from "../../data/profile";
import { FiAward, FiUsers, FiCloud, FiCpu } from "react-icons/fi";

const highlights = [
  { icon: FiCpu, label: "~8 Years", sub: "AI & Engineering" },
  { icon: FiCloud, label: "AWS & Azure", sub: "Cloud Architect" },
  { icon: FiUsers, label: "Teams Led", sub: "Hiring & Mentoring" },
  { icon: FiAward, label: "4 Awards", sub: "PwC & Accenture" },
];

export default function About() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            About
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Building the future with AI
          </h3>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-text-secondary leading-relaxed text-lg mb-6">{profile.summary}</p>
            <ul className="space-y-3">
              {profile.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-2 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {highlights.map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-5 flex flex-col items-center text-center hover:border-accent/40 transition-colors group"
              >
                <item.icon
                  size={24}
                  className="text-accent mb-3 group-hover:scale-110 transition-transform"
                />
                <span className="text-white font-bold text-lg">{item.label}</span>
                <span className="text-text-secondary text-xs mt-1">{item.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
