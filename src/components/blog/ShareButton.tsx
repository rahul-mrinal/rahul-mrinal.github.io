import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiShare2, FiCopy, FiCheck, FiLinkedin } from "react-icons/fi";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:border-accent/40 hover:text-white transition-all"
      >
        <FiShare2 size={14} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 w-48 glass-card rounded-xl p-2 z-50"
          >
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              {copied ? <FiCheck size={14} className="text-accent-teal" /> : <FiCopy size={14} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <FiLinkedin size={14} />
              LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X / Twitter
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
