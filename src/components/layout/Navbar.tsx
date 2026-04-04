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
  const [prevPathname, setPrevPathname] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
    if (!isHome) setActiveSection(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

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

  const scrollToSection = useCallback(
    (id: string) => {
      setMobileOpen(false);
      if (isHome) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        const waitForElement = (attempts = 0) => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else if (attempts < 20) {
            requestAnimationFrame(() => waitForElement(attempts + 1));
          }
        };
        requestAnimationFrame(() => waitForElement());
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
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/10"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-teal flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
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
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
          {isHome && HOME_SECTIONS.slice(0, 4).map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeSection === id
                  ? "text-white bg-white/10"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
                }`}
            >
              {id.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
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
            className="md:hidden bg-bg-secondary/95 backdrop-blur-xl border-b border-border overflow-hidden"
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
                        : "text-text-secondary hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {isHome && HOME_SECTIONS.map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors capitalize text-left ${activeSection === id
                      ? "text-white bg-white/10"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
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
