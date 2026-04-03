import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { profile } from "../../data/profile";
import { FiLinkedin, FiArrowUpRight } from "react-icons/fi";

export default function Contact() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="py-24 px-6 bg-[#0d0e14]" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#00c9a7] mb-3">
            Connect
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Let's build something great
          </h3>
          <p className="text-[#9398ab] text-lg mb-10">
            Interested in AI-powered platforms, search engineering, or distributed
            systems? Let's connect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-xl glass-card hover:border-[#6c63ff]/60 transition-all group hover:-translate-y-1"
          >
            <FiLinkedin size={22} className="text-[#6c63ff]" />
            <div className="text-left">
              <span className="text-white font-semibold text-sm block">LinkedIn</span>
              <span className="text-[#9398ab] text-xs">Connect with me</span>
            </div>
            <FiArrowUpRight
              size={16}
              className="text-[#9398ab] group-hover:text-[#6c63ff] transition-colors ml-2"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
