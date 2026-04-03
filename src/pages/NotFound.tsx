import { Link } from "react-router-dom";
import { FiHome, FiBookOpen } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-xl text-[#9398ab] mb-8">Page not found</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-semibold text-sm"
          >
            <FiHome size={16} />
            Home
          </Link>
          <Link
            to="/blog"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2a2d3a] text-[#9398ab] font-semibold text-sm hover:border-[#6c63ff] hover:text-white transition-all"
          >
            <FiBookOpen size={16} />
            Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
