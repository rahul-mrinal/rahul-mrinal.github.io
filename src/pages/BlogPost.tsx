import { useState, useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiArrowLeft } from "react-icons/fi";
import type { ComponentType } from "react";
import CodeBlock from "../components/blog/CodeBlock";
import ReadingProgress from "../components/blog/ReadingProgress";
import SeriesNav from "../components/blog/SeriesNav";
import ShareButton from "../components/blog/ShareButton";
import TableOfContents from "../components/blog/TableOfContents";
import PlaygroundAccordion from "../components/playgrounds/PlaygroundAccordion";
import PlaygroundComponent from "../components/playgrounds/PlaygroundComponent";
import { getPostBySlug, getAdjacentPosts } from "../data/blogPosts";
import { getSeriesById } from "../data/series";
import type { BlogFrontmatter } from "../types/mdx";

type MdxComponents = Record<string, ComponentType<Record<string, unknown>>>;

const MDX_MODULES = import.meta.glob<{
  default: ComponentType<{ components?: MdxComponents }>;
  frontmatter: BlogFrontmatter;
}>("/src/content/blog/**/*.mdx");

function buildComponents(headings: string[]): MdxComponents {
  return {
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children);
      const idx = headings.indexOf(text);
      return (
        <h2
          id={`section-${idx >= 0 ? idx : 0}`}
          className="text-xl sm:text-2xl font-bold text-white mb-4"
        >
          {children}
        </h2>
      );
    },
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3">{children}</p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        className="text-accent hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    code: ({
      className,
      children,
    }: {
      className?: string;
      children?: React.ReactNode;
    }) => {
      const language = className?.replace("language-", "");
      if (language) {
        return (
          <CodeBlock code={String(children).trimEnd()} language={language} />
        );
      }
      return (
        <code className="text-accent-teal bg-bg-tertiary px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-accent pl-4 italic text-text-secondary/80 my-4">
        {children}
      </blockquote>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="border-b border-border">{children}</thead>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="text-left text-white font-semibold px-3 py-2 text-xs uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="px-3 py-2 border-b border-border/50">{children}</td>
    ),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    PlaygroundAccordion: PlaygroundAccordion as ComponentType<any>,
    PlaygroundComponent: PlaygroundComponent as ComponentType<any>,
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}

export default function BlogPost() {
  const { series, slug } = useParams<{ series: string; slug: string }>();
  const [mdx, setMdx] = useState<{
    Content: ComponentType<{ components?: MdxComponents }>;
    frontmatter: BlogFrontmatter;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!series || !slug) return <Navigate to="/blog" replace />;

  const post = getPostBySlug(series, slug);
  if (!post) return <Navigate to="/blog" replace />;

  const seriesInfo = getSeriesById(post.series);
  const { prev, next, total } = getAdjacentPosts(post);

  useEffect(() => {
    const key = `/src/content/blog/${series}/${slug}.mdx`;
    const loader = MDX_MODULES[key];
    if (!loader) {
      setNotFound(true);
      return;
    }
    setMdx(null);
    loader().then((mod) => {
      setMdx({ Content: mod.default, frontmatter: mod.frontmatter });
    });
  }, [series, slug]);

  const headings = mdx?.frontmatter.headings ?? [];

  const mdxComponents = useMemo(() => buildComponents(headings), [headings]);

  if (notFound) return <Navigate to="/blog" replace />;

  const BASE = "https://rahul-mrinal.github.io";
  const postUrl = `${BASE}/blog/${series}/${slug}`;
  const blogPostJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": postUrl,
      "datePublished": post.publishDate,
      "dateModified": post.publishDate,
      "author": {
        "@type": "Person",
        "name": "Rahul Mrinal",
        "url": BASE,
      },
      "publisher": {
        "@type": "Person",
        "name": "Rahul Mrinal",
        "url": BASE,
      },
      "keywords": post.tags.join(", "),
      "inLanguage": "en-US",
      "isPartOf": {
        "@type": "Blog",
        "name": "Rahul Mrinal — Technical Blog",
        "url": `${BASE}/blog`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/` },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE}/blog` },
        { "@type": "ListItem", "position": 3, "name": seriesInfo?.title ?? series, "item": `${BASE}/blog?series=${series}` },
        { "@type": "ListItem", "position": 4, "name": post.title, "item": postUrl },
      ],
    },
  ];

  usePageMeta({
    title: `${post.title} — Rahul Mrinal`,
    description: post.description,
    keywords: `${post.tags.join(", ")}, Rahul Mrinal, ${seriesInfo?.title ?? ""}, blog, GitHub`,
    canonical: postUrl,
    ogType: "article",
    publishDate: post.publishDate,
    jsonLd: blogPostJsonLd,
  });

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <ReadingProgress />
      <TableOfContents headings={headings} />
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
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed">
            {post.description}
          </p>

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
            <ShareButton title={post.title} />
          </div>
        </motion.header>

        {/* MDX Content */}
        {!mdx ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-bg-tertiary rounded w-48 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-bg-tertiary/60 rounded w-full" />
                  <div className="h-4 bg-bg-tertiary/60 rounded w-5/6" />
                  <div className="h-4 bg-bg-tertiary/60 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-text-secondary leading-relaxed prose-content space-y-8"
          >
            <mdx.Content components={mdxComponents} />
          </motion.div>
        )}

        <SeriesNav current={post} prev={prev} next={next} totalInSeries={total} />
      </article>
    </main>
  );
}
