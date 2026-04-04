import { FiLinkedin } from "react-icons/fi";
import { profile } from "../../data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-teal flex items-center justify-center text-white font-bold text-xs">
            RM
          </div>
          <span className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent transition-colors"
          aria-label="LinkedIn"
        >
          <FiLinkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
