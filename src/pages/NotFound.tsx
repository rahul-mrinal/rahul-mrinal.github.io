import { Link } from "react-router-dom";
import { FiHome, FiBookOpen } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <title>404 - Page Not Found</title>
      <div className="text-center">
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-8">Page not found</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-[#5a52e0] text-white font-semibold text-sm"
          >
            <FiHome size={16} />
            Home
          </Link>
          <Link
            to="/blog"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-secondary font-semibold text-sm hover:border-accent hover:text-white transition-all"
          >
            <FiBookOpen size={16} />
            Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
