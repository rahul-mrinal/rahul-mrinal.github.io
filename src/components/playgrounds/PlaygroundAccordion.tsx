import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiPlay } from "react-icons/fi";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PlaygroundAccordion({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors text-left"
      >
        <FiPlay
          size={14}
          className="text-accent shrink-0"
          style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
        />
        <span className="text-sm font-semibold text-accent flex-1">{title}</span>
        <FiChevronDown
          size={16}
          className="text-text-secondary shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-border bg-bg-secondary/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
