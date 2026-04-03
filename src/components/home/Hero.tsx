import { motion } from "framer-motion";
import { FiLinkedin, FiArrowDown } from "react-icons/fi";
import { profile } from "../../data/profile";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#6c63ff]/8 blur-[120px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00c9a7]/6 blur-[100px] animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff6b6b]/4 blur-[140px]"
          style={{ animation: "pulse-glow 8s ease-in-out infinite" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2d3a] bg-[#12131a]/60 text-sm text-[#9398ab]">
            <span className="w-2 h-2 rounded-full bg-[#00c9a7] animate-pulse" />
            {profile.location}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-white">Hi, I'm </span>
          <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-xl sm:text-2xl text-[#9398ab] font-light mb-4 leading-relaxed"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg text-[#6d7290] max-w-2xl mx-auto mb-10"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#blog-preview"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#6c63ff]/20 hover:-translate-y-0.5 transition-all"
          >
            Read the Blog
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-[#2a2d3a] text-[#9398ab] font-semibold text-sm hover:border-[#6c63ff] hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <FiLinkedin size={16} />
            LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#9398ab]/40"
        >
          <FiArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
