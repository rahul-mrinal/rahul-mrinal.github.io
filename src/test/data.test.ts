import { describe, it, expect } from "vitest";
import {
  blogPosts,
  getPostBySlug,
  getPostsBySeries,
  getAdjacentPosts,
} from "../data/blogPosts";
import { getPostSections } from "../data/blogPostContent";
import {
  CATEGORIES,
  SERIES,
  getSeriesById,
  getSeriesByCategory,
  getCategoryById,
  getSeriesColor,
} from "../data/series";

describe("blogPosts", () => {
  it("contains 36 posts", () => {
    expect(blogPosts).toHaveLength(36);
  });

  it("every post has required fields", () => {
    for (const post of blogPosts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.series).toBeTruthy();
      expect(post.seriesOrder).toBeGreaterThan(0);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.readTime).toBeTruthy();
      expect(post.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("has unique slugs within each series", () => {
    const seen = new Set<string>();
    for (const post of blogPosts) {
      const key = `${post.series}/${post.slug}`;
      expect(seen.has(key), `Duplicate: ${key}`).toBe(false);
      seen.add(key);
    }
  });
});

describe("getPostBySlug", () => {
  it("finds existing post", () => {
    const post = getPostBySlug("search-fundamentals", "what-is-search");
    expect(post).toBeDefined();
    expect(post!.title).toBe("What is Search?");
  });

  it("returns undefined for non-existent post", () => {
    expect(getPostBySlug("search-fundamentals", "nonexistent")).toBeUndefined();
  });

  it("returns undefined for wrong series", () => {
    expect(getPostBySlug("indexing", "what-is-search")).toBeUndefined();
  });
});

describe("getPostsBySeries", () => {
  it("returns posts sorted by seriesOrder", () => {
    const posts = getPostsBySeries("search-fundamentals");
    expect(posts).toHaveLength(6);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i].seriesOrder).toBeGreaterThan(posts[i - 1].seriesOrder);
    }
  });

  it("returns empty array for unknown series", () => {
    expect(getPostsBySeries("nonexistent")).toHaveLength(0);
  });
});

describe("getAdjacentPosts", () => {
  it("first post has no prev", () => {
    const first = getPostBySlug("search-fundamentals", "what-is-search")!;
    const { prev, next, total } = getAdjacentPosts(first);
    expect(prev).toBeNull();
    expect(next).toBeDefined();
    expect(next!.slug).toBe("bm25-from-scratch");
    expect(total).toBe(6);
  });

  it("last post has no next", () => {
    const last = getPostBySlug("search-fundamentals", "evaluation-metrics")!;
    const { prev, next } = getAdjacentPosts(last);
    expect(next).toBeNull();
    expect(prev).toBeDefined();
  });

  it("middle post has both prev and next", () => {
    const mid = getPostBySlug("search-fundamentals", "bm25-from-scratch")!;
    const { prev, next } = getAdjacentPosts(mid);
    expect(prev).toBeDefined();
    expect(next).toBeDefined();
  });
});

describe("getPostSections", () => {
  it("returns sections for existing post", () => {
    const sections = getPostSections("search-fundamentals", "what-is-search");
    expect(sections.length).toBeGreaterThan(0);
    expect(sections[0].heading).toBeTruthy();
  });

  it("returns empty array for non-existent post", () => {
    const sections = getPostSections("nonexistent", "nope");
    expect(sections).toHaveLength(0);
  });
});

describe("series helpers", () => {
  it("CATEGORIES has 3 entries", () => {
    expect(CATEGORIES).toHaveLength(3);
  });

  it("SERIES has 8 entries", () => {
    expect(SERIES).toHaveLength(8);
  });

  it("getSeriesById finds existing series", () => {
    const s = getSeriesById("search-fundamentals");
    expect(s).toBeDefined();
    expect(s!.title).toBe("Search Fundamentals");
  });

  it("getSeriesById returns undefined for unknown", () => {
    expect(getSeriesById("nonexistent")).toBeUndefined();
  });

  it("getSeriesByCategory returns sorted results", () => {
    const series = getSeriesByCategory("search-engineering");
    expect(series.length).toBe(8);
    for (let i = 1; i < series.length; i++) {
      expect(series[i].order).toBeGreaterThan(series[i - 1].order);
    }
  });

  it("getSeriesByCategory returns empty for unknown category", () => {
    expect(getSeriesByCategory("nonexistent")).toHaveLength(0);
  });

  it("getCategoryById finds existing category", () => {
    const cat = getCategoryById("search-engineering");
    expect(cat).toBeDefined();
    expect(cat!.title).toBe("Search Engineering");
  });

  it("getSeriesColor returns color for known series", () => {
    expect(getSeriesColor("search-fundamentals")).toBe("#6c63ff");
  });

  it("getSeriesColor returns default for unknown series", () => {
    expect(getSeriesColor("nonexistent")).toBe("#6c63ff");
  });
});
