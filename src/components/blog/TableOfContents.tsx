import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiList, FiX } from "react-icons/fi";

interface TableOfContentsProps {
  headings: string[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sectionEls = headings.map((_, i) =>
      document.getElementById(`section-${i}`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          const idx = parseInt(id.replace("section-", ""), 10);
          if (!isNaN(idx)) setActiveIndex(idx);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  if (headings.length < 2) return null;

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav className="hidden xl:block fixed top-28 right-8 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto" aria-label="Table of contents">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#6d7290] mb-3">
          On this page
        </h4>
        <ul className="space-y-1 border-l border-border">
          {headings.map((heading, i) => (
            <li key={i}>
              <button
                onClick={() => scrollTo(i)}
                className={`block w-full text-left text-sm pl-4 py-1.5 border-l-2 -ml-px transition-colors ${
                  activeIndex === i
                    ? "border-accent text-white"
                    : "border-transparent text-[#6d7290] hover:text-text-secondary hover:border-text-secondary/30"
                }`}
              >
                {heading}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile floating TOC button */}
      <div className="xl:hidden fixed bottom-8 left-8 z-40">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-14 left-0 w-64 glass-card rounded-xl p-4 mb-2 max-h-72 overflow-y-auto"
            >
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#6d7290] mb-2">
                On this page
              </h4>
              <ul className="space-y-1">
                {headings.map((heading, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollTo(i)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        activeIndex === i
                          ? "bg-accent/10 text-white"
                          : "text-text-secondary hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {heading}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-tertiary border border-border text-text-secondary hover:text-white hover:border-accent/40 transition-all shadow-lg"
          aria-label="Table of contents"
        >
          {mobileOpen ? <FiX size={20} /> : <FiList size={20} />}
        </button>
      </div>
    </>
  );
}
