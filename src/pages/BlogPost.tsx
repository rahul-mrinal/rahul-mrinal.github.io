import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import CodeBlock from "../components/blog/CodeBlock";
import SeriesNav from "../components/blog/SeriesNav";
import { getPostBySlug, getAdjacentPosts } from "../data/blogPosts";
import { getSeriesById } from "../data/series";

export default function BlogPost() {
  const { series, slug } = useParams<{ series: string; slug: string }>();

  if (!series || !slug) return <Navigate to="/blog" replace />;

  const post = getPostBySlug(series, slug);
  if (!post) return <Navigate to="/blog" replace />;

  const seriesInfo = getSeriesById(post.series);
  const { prev, next, total } = getAdjacentPosts(post);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#9398ab] hover:text-white transition-colors"
          >
            <FiArrowLeft size={14} />
            Back to all posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {seriesInfo && (
              <Link
                to={`/blog?series=${seriesInfo.id}`}
                className="text-xs font-semibold px-3 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{
                  color: seriesInfo.color,
                  backgroundColor: `${seriesInfo.color}15`,
                }}
              >
                {seriesInfo.title} &middot; Part {post.seriesOrder}
              </Link>
            )}
            <span className="flex items-center gap-1 text-xs text-[#6d7290]">
              <FiClock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-[#9398ab] leading-relaxed">{post.description}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium uppercase tracking-wider text-[#6d7290] bg-[#1a1c25] px-2.5 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {post.interactiveDemo && (
            <a
              href={post.interactiveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#6c63ff]/40 text-[#6c63ff] text-sm font-medium hover:bg-[#6c63ff]/10 transition-colors"
            >
              <FiExternalLink size={14} />
              Open Interactive Playground
            </a>
          )}
        </motion.header>

        {/* Content sections */}
        <div className="space-y-10">
          {post.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {section.heading}
              </h2>
              <div className="text-[#9398ab] leading-relaxed whitespace-pre-line">
                {section.content.split("\n").map((paragraph, pi) => {
                  if (!paragraph.trim()) return <br key={pi} />;
                  const formatted = paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-white font-semibold">$1</strong>'
                  );
                  return (
                    <p
                      key={pi}
                      className="mb-3"
                      dangerouslySetInnerHTML={{ __html: formatted }}
                    />
                  );
                })}
              </div>
              {section.code && (
                <CodeBlock
                  code={section.code}
                  language={section.language || "python"}
                  filename={section.filename}
                />
              )}
            </motion.section>
          ))}
        </div>

        <SeriesNav current={post} prev={prev} next={next} totalInSeries={total} />
      </article>
    </main>
  );
}
