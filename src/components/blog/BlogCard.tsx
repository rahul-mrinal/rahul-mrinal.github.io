import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { getSeriesById } from "../../data/series";
import type { BlogPostMeta } from "../../data/blogPosts";

interface BlogCardProps {
  post: BlogPostMeta;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const series = getSeriesById(post.series);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index }}
    >
      <Link
        to={`/blog/${post.series}/${post.slug}`}
        className="glass-card rounded-xl p-6 block h-full hover:border-white/20 hover:-translate-y-1 transition-all group"
      >
        <div className="flex items-center gap-3 mb-4">
          {series && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                color: series.color,
                backgroundColor: `${series.color}15`,
              }}
            >
              {series.shortTitle}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-[#6d7290]">
            <FiClock size={12} />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#6c63ff] transition-colors">
          {post.title}
        </h3>

        <p className="text-[#9398ab] text-sm line-clamp-2 mb-4">{post.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium uppercase tracking-wider text-[#6d7290] bg-[#1a1c25] px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <FiArrowRight
            size={14}
            className="text-[#6d7290] group-hover:text-[#6c63ff] group-hover:translate-x-1 transition-all"
          />
        </div>
      </Link>
    </motion.div>
  );
}
