import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { CATEGORIES, getSeriesByCategory } from "../../data/series";
import { blogPosts } from "../../data/blogPosts";
import { FiArrowRight, FiBookOpen, FiSearch, FiCpu, FiTerminal } from "react-icons/fi";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  search: <FiSearch size={22} />,
  cpu: <FiCpu size={22} />,
  terminal: <FiTerminal size={22} />,
};

export default function FeaturedBlog() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="blog-preview" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6c63ff] mb-3">
            Blog
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Technical Writing
          </h3>
          <p className="text-[#9398ab] text-lg max-w-2xl">
            Deep-dive blog series on search engineering, AI systems, developer
            tools, and more. New topics added regularly.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {CATEGORIES.map((cat, i) => {
            const seriesInCat = getSeriesByCategory(cat.id);
            const postCount = blogPosts.filter((p) =>
              seriesInCat.some((s) => s.id === p.series)
            ).length;
            const hasContent = postCount > 0;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
              >
                <Link
                  to={hasContent ? `/blog?category=${cat.id}` : "/blog"}
                  className="glass-card rounded-xl p-6 block h-full hover:border-white/20 hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-[3px]"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <span style={{ color: cat.color }}>
                        {CATEGORY_ICONS[cat.icon]}
                      </span>
                    </div>
                    {!hasContent && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          color: cat.color,
                          backgroundColor: `${cat.color}12`,
                        }}
                      >
                        Coming Soon
                      </span>
                    )}
                    {hasContent && (
                      <span className="text-xs text-[#6d7290]">
                        {postCount} posts &middot; {seriesInCat.length} series
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-[#6c63ff] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-[#9398ab] text-sm line-clamp-2 mb-4">
                    {cat.description}
                  </p>

                  {hasContent && (
                    <div className="flex flex-wrap gap-1.5">
                      {seriesInCat.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{
                            color: s.color,
                            backgroundColor: `${s.color}12`,
                          }}
                        >
                          {s.shortTitle}
                        </span>
                      ))}
                      {seriesInCat.length > 4 && (
                        <span className="text-[10px] text-[#6d7290] px-2 py-0.5">
                          +{seriesInCat.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#6c63ff]/20 hover:-translate-y-0.5 transition-all"
          >
            <FiBookOpen size={16} />
            View All Posts
          </Link>
          <Link
            to="/blog/search-fundamentals/what-is-search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2a2d3a] text-[#9398ab] font-semibold text-sm hover:border-[#6c63ff] hover:text-white hover:-translate-y-0.5 transition-all"
          >
            Start Reading
            <FiArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
