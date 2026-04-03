import { FiLinkedin } from "react-icons/fi";
import { profile } from "../../data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2d3a] bg-[#0a0b10]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6c63ff] to-[#00c9a7] flex items-center justify-center text-white font-bold text-xs">
            RM
          </div>
          <span className="text-sm text-[#9398ab]">
            &copy; {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9398ab] hover:text-[#6c63ff] transition-colors"
          aria-label="LinkedIn"
        >
          <FiLinkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
