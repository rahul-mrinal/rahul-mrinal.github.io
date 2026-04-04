import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import Markdown from "react-markdown";
import CodeBlock from "../components/blog/CodeBlock";
import ReadingProgress from "../components/blog/ReadingProgress";
import SeriesNav from "../components/blog/SeriesNav";
import ShareButton from "../components/blog/ShareButton";
import TableOfContents from "../components/blog/TableOfContents";
import { getPostBySlug, getAdjacentPosts } from "../data/blogPosts";
import { getPostSections } from "../data/blogPostContent";
import { getSeriesById } from "../data/series";

export default function BlogPost() {
  const { series, slug } = useParams<{ series: string; slug: string }>();

  if (!series || !slug) return <Navigate to="/blog" replace />;

  const post = getPostBySlug(series, slug);
  if (!post) return <Navigate to="/blog" replace />;

  const sections = getPostSections(series, slug);
  const seriesInfo = getSeriesById(post.series);
  const { prev, next, total } = getAdjacentPosts(post);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <title>{`${post.title} - Rahul Mrinal`}</title>
      <ReadingProgress />
      <TableOfContents headings={sections.map((s) => s.heading)} />
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
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
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
            <span className="flex items-center gap-1 text-xs text-[#6d7290]">
              <FiCalendar size={12} />
              {new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed">{post.description}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium uppercase tracking-wider text-[#6d7290] bg-bg-tertiary px-2.5 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {post.interactiveDemo && (
              <a
                href={post.interactiveDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent/40 text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                <FiExternalLink size={14} />
                Open Interactive Playground
              </a>
            )}
            <ShareButton title={post.title} />
          </div>
        </motion.header>

        {/* Content sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              id={`section-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {section.heading}
              </h2>
              <div className="text-text-secondary leading-relaxed prose-content">
                <Markdown
                  components={{
                    p: ({ children }) => <p className="mb-3">{children}</p>,
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">{children}</strong>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                    code: ({ children }) => (
                      <code className="text-accent-teal bg-bg-tertiary px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-accent pl-4 italic text-text-secondary/80 my-4">{children}</blockquote>
                    ),
                  }}
                >
                  {section.content}
                </Markdown>
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
