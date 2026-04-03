import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiSearch, FiCpu, FiTerminal } from "react-icons/fi";
import BlogCard from "../components/blog/BlogCard";
import { blogPosts } from "../data/blogPosts";
import { CATEGORIES, SERIES, getSeriesByCategory } from "../data/series";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  search: <FiSearch size={16} />,
  cpu: <FiCpu size={16} />,
  terminal: <FiTerminal size={16} />,
};

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialSeries = searchParams.get("series");

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [activeSeries, setActiveSeries] = useState<string | null>(initialSeries);

  const visibleSeries = useMemo(() => {
    if (activeCategory) return getSeriesByCategory(activeCategory);
    return SERIES;
  }, [activeCategory]);

  const filteredPosts = useMemo(() => {
    if (activeSeries) return blogPosts.filter((p) => p.series === activeSeries);
    if (activeCategory) {
      const seriesIds = new Set(visibleSeries.map((s) => s.id));
      return blogPosts.filter((p) => seriesIds.has(p.series));
    }
    return blogPosts;
  }, [activeSeries, activeCategory, visibleSeries]);

  const handleCategoryChange = (id: string | null) => {
    setActiveCategory(id);
    setActiveSeries(null);
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
  };

  const handleSeriesChange = (id: string | null) => {
    setActiveSeries(id);
    if (id) {
      const params: Record<string, string> = { series: id };
      if (activeCategory) params.category = activeCategory;
      setSearchParams(params);
    } else if (activeCategory) {
      setSearchParams({ category: activeCategory });
    } else {
      setSearchParams({});
    }
  };

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-[#9398ab] text-lg max-w-2xl">
            Deep-dive technical writing on search engineering, AI systems,
            developer tools, and more.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === null
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-[#9398ab] border border-[#2a2d3a] hover:border-white/20 hover:text-white"
              }`}
            >
              All Topics
              <span className="text-xs opacity-50">{blogPosts.length}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const catPostCount = blogPosts.filter((p) =>
                getSeriesByCategory(cat.id).some((s) => s.id === p.series)
              ).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    handleCategoryChange(isActive ? null : cat.id)
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border"
                  style={
                    isActive
                      ? {
                          color: cat.color,
                          borderColor: `${cat.color}60`,
                          backgroundColor: `${cat.color}12`,
                        }
                      : { color: "#9398ab", borderColor: "#2a2d3a" }
                  }
                >
                  {CATEGORY_ICONS[cat.icon]}
                  {cat.title}
                  {catPostCount > 0 && (
                    <span className="text-xs opacity-50">{catPostCount}</span>
                  )}
                  {catPostCount === 0 && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Category description + coming soon */}
        {activeCategoryData && filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-8 text-center mb-10"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${activeCategoryData.color}15` }}
            >
              <span style={{ color: activeCategoryData.color }}>
                {CATEGORY_ICONS[activeCategoryData.icon]}
              </span>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              {activeCategoryData.title}
            </h3>
            <p className="text-[#9398ab] mb-4">{activeCategoryData.description}</p>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{
                color: activeCategoryData.color,
                backgroundColor: `${activeCategoryData.color}15`,
              }}
            >
              Coming Soon
            </span>
          </motion.div>
        )}

        {/* Series filter (within active category) */}
        {visibleSeries.length > 1 && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSeriesChange(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSeries === null
                    ? "bg-white/8 text-white border border-white/15"
                    : "text-[#6d7290] border border-[#2a2d3a] hover:text-white hover:border-white/15"
                }`}
              >
                All Series
              </button>
              {visibleSeries.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    handleSeriesChange(activeSeries === s.id ? null : s.id)
                  }
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border"
                  style={
                    activeSeries === s.id
                      ? {
                          color: s.color,
                          borderColor: `${s.color}60`,
                          backgroundColor: `${s.color}12`,
                        }
                      : { color: "#6d7290", borderColor: "#2a2d3a" }
                  }
                >
                  {s.shortTitle}
                  <span className="ml-1 opacity-50">{s.postCount}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Start from beginning CTA */}
        {!activeCategory && !activeSeries && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <Link
              to="/blog/search-fundamentals/what-is-search"
              className="glass-card rounded-xl p-6 flex items-center justify-between gap-4 hover:border-[#6c63ff]/40 transition-all group"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff] block mb-1">
                  Start from the beginning
                </span>
                <span className="text-white font-semibold text-lg group-hover:text-[#6c63ff] transition-colors">
                  Search Fundamentals: What is Search?
                </span>
              </div>
              <FiArrowRight
                size={20}
                className="text-[#6d7290] group-hover:text-[#6c63ff] group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </Link>
          </motion.div>
        )}

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {filteredPosts.length === 0 && !activeCategoryData && (
          <div className="text-center py-20 text-[#9398ab]">
            No posts found.
          </div>
        )}
      </div>
    </main>
  );
}
