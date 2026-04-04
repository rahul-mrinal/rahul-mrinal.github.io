export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Series {
  id: string;
  category: string;
  title: string;
  shortTitle: string;
  order: number;
  color: string;
  description: string;
  postCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "search-engineering",
    title: "Search Engineering",
    description:
      "From brute-force search to production RAG systems. A deep-dive into how search engines work under the hood.",
    icon: "search",
    color: "#6c63ff",
    order: 1,
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    description:
      "Multi-agent systems, tool use, planning, and autonomous AI workflows for enterprise applications.",
    icon: "cpu",
    color: "#00c9a7",
    order: 2,
  },
  {
    id: "dev-tools",
    title: "AI Dev Tools",
    description:
      "Hands-on exploration of Cursor, Claude Code, OpenClaw, and the tools reshaping how we build software.",
    icon: "terminal",
    color: "#ff6b6b",
    order: 3,
  },
];

export const SERIES: Series[] = [
  // Search Engineering
  {
    id: "search-fundamentals",
    category: "search-engineering",
    title: "Search Fundamentals",
    shortTitle: "Fundamentals",
    order: 1,
    color: "#6c63ff",
    description:
      "From brute-force search to BM25, vector search, hybrid retrieval, and evaluation metrics - the building blocks of every search engine.",
    postCount: 6,
  },
  {
    id: "indexing",
    category: "search-engineering",
    title: "Indexing",
    shortTitle: "Indexing",
    order: 2,
    color: "#00c9a7",
    description:
      "Inverted indexes, document chunking, metadata fields, and CRUD operations - the heart of search infrastructure.",
    postCount: 4,
  },
  {
    id: "query-processing",
    category: "search-engineering",
    title: "Query Processing",
    shortTitle: "Query Processing",
    order: 3,
    color: "#ff6b6b",
    description:
      "Query preprocessing, end-to-end retrieval flow, filtering, spell correction, and query expansion.",
    postCount: 4,
  },
  {
    id: "ranking-relevance",
    category: "search-engineering",
    title: "Ranking & Relevance",
    shortTitle: "Ranking",
    order: 4,
    color: "#ffd93d",
    description:
      "Multi-stage ranking, hybrid scoring, relevance tuning, field boosting, and the complete catalog of ranking signals.",
    postCount: 4,
  },
  {
    id: "system-design",
    category: "search-engineering",
    title: "System Design",
    shortTitle: "System Design",
    order: 5,
    color: "#6c63ff",
    description:
      "Capacity estimation, sharding, replication, caching strategies, and a full eCommerce search architecture walkthrough.",
    postCount: 4,
  },
  {
    id: "data-pipelines",
    category: "search-engineering",
    title: "Data Pipelines",
    shortTitle: "Pipelines",
    order: 6,
    color: "#00c9a7",
    description:
      "Batch vs real-time processing, ETL pipelines, index update strategies, and data quality practices.",
    postCount: 4,
  },
  {
    id: "rag-systems",
    category: "search-engineering",
    title: "RAG Systems",
    shortTitle: "RAG",
    order: 7,
    color: "#ff6b6b",
    description:
      "Retrieval-Augmented Generation end to end - chunking, retrieval pipelines, evaluation, and advanced patterns like HyDE and self-RAG.",
    postCount: 5,
  },
  {
    id: "advanced-search",
    category: "search-engineering",
    title: "Advanced Search",
    shortTitle: "Advanced",
    order: 8,
    color: "#ffd93d",
    description:
      "Learning to rank, click models, personalization, autocomplete, and search diversity - the cutting edge.",
    postCount: 5,
  },
];

export function getSeriesById(id: string): Series | undefined {
  return SERIES.find((s) => s.id === id);
}

export function getSeriesByCategory(categoryId: string): Series[] {
  return SERIES.filter((s) => s.category === categoryId).sort(
    (a, b) => a.order - b.order
  );
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSeriesColor(id: string): string {
  return getSeriesById(id)?.color ?? "#6c63ff";
}
