export type { BlogSection, BlogPostMeta, BlogPost } from "./types";
import type { BlogPostMeta } from "./types";
import { searchEngineeringPosts } from "./search-engineering";
import { agenticAiPosts } from "./agentic-ai";

export const blogPosts: BlogPostMeta[] = [
  ...searchEngineeringPosts,
  ...agenticAiPosts,
];

export function getPostBySlug(
  series: string,
  slug: string
): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.series === series && p.slug === slug);
}

export function getPostsBySeries(seriesId: string): BlogPostMeta[] {
  return blogPosts
    .filter((p) => p.series === seriesId)
    .sort((a, b) => a.seriesOrder - b.seriesOrder);
}

export function getAdjacentPosts(
  post: BlogPostMeta
): { prev: BlogPostMeta | null; next: BlogPostMeta | null; total: number } {
  const seriesPosts = getPostsBySeries(post.series);
  const idx = seriesPosts.findIndex((p) => p.slug === post.slug);
  return {
    prev: idx > 0 ? seriesPosts[idx - 1] : null,
    next: idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : null,
    total: seriesPosts.length,
  };
}
