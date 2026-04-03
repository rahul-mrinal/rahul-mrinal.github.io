import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

const HOME_SECTIONS = ["about", "experience", "skills", "education", "blog-preview", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is currently in view using IntersectionObserver
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    HOME_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }

            // Find the most visible section
            if (visibleSections.size > 0) {
              let maxRatio = 0;
              let maxSection = "";
              visibleSections.forEach((ratio, section) => {
                if (ratio > maxRatio) {
                  maxRatio = ratio;
                  maxSection = section;
                }
              });
              setActiveSection(maxSection);
            } else {
              setActiveSection(null);
            }
          });
        },
        { threshold: [0, 0.25, 0.5, 0.75], rootMargin: "-80px 0px -20% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const scrollToSection = useCallback(
    (id: string) => {
      setMobileOpen(false);
      if (isHome) {
        // Already on home - just scroll
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to home first, then scroll after the page renders
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    [isHome, navigate]
  );

  const handleHomeClick = useCallback(
    (e: React.MouseEvent) => {
      if (isHome) {
        // Already on home - prevent default Link navigation and scroll to top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(null);
        setMobileOpen(false);
      }
      // If not on home, let the Link navigate normally (ScrollToTop will fire)
    },
    [isHome]
  );

  // Determine if "Home" nav item should appear active:
  // Only when on "/" AND no section is actively in view (i.e. user is at the hero/top)
  const isHomeActive = isHome && activeSection === null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0a0b10]/80 backdrop-blur-xl border-b border-[#2a2d3a]/60 shadow-lg shadow-black/10"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#00c9a7] flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
            RM
          </div>
          <span className="font-semibold text-white hidden sm:inline">Rahul Mrinal</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? isHomeActive
                : location.pathname === item.href || location.pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={item.href === "/" ? handleHomeClick : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-white bg-white/10"
                    : "text-[#9398ab] hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
          {HOME_SECTIONS.slice(0, 4).map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeSection === id
                  ? "text-white bg-white/10"
                  : "text-[#9398ab] hover:text-white hover:bg-white/5"
                }`}
            >
              {id.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#9398ab] hover:text-white transition-colors"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#12131a]/95 backdrop-blur-xl border-b border-[#2a2d3a] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? isHomeActive
                    : location.pathname === item.href || location.pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={item.href === "/" ? handleHomeClick : undefined}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? "text-white bg-white/10"
                        : "text-[#9398ab] hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {HOME_SECTIONS.map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors capitalize text-left ${activeSection === id
                      ? "text-white bg-white/10"
                      : "text-[#9398ab] hover:text-white hover:bg-white/5"
                    }`}
                >
                  {id.replace("-", " ")}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
