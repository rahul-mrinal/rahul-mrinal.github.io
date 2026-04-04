import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const SCROLL_THRESHOLD_PX = 400;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <FiArrowUp className="text-xl" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
