import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function computeProgress(scrollY: number): number {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / maxScroll));
}

export default function ReadingProgress() {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setProgress(computeProgress(y));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[3px] overflow-hidden"
      initial={false}
      animate={{ opacity: scrollY > 100 ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="h-full"
        style={{
          background: "linear-gradient(90deg, #6c63ff 0%, #00c9a7 100%)",
        }}
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      />
    </motion.div>
  );
}
