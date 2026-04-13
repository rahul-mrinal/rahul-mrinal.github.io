import type { BlogPostMeta } from "./types";

export const searchEngineeringPosts: BlogPostMeta[] = [
  // ─── Series 1: Search Fundamentals ───────────────────────────────
  {
    slug: "what-is-search",
    title: "What is Search?",
    series: "search-fundamentals",
    seriesOrder: 1,
    description:
      "Start from the very beginning - brute-force scanning vs indexed retrieval, and why search is fundamentally an O(N) to O(1) problem.",
    tags: ["search", "brute-force", "indexing", "big-o"],
    readTime: "8 min",
    publishDate: "2026-03-26",
  },
  {
    slug: "bm25-from-scratch",
    title: "BM25 From Scratch",
    series: "search-fundamentals",
    seriesOrder: 2,
    description:
      "Build the BM25 ranking algorithm piece by piece - term frequency, IDF, length normalization, saturation, and the k1/b parameters.",
    tags: ["bm25", "tf-idf", "ranking", "algorithm"],
    readTime: "15 min",
    publishDate: "2026-03-26",
  },
  {
    slug: "tf-idf-vs-bm25",
    title: "TF-IDF vs BM25 - Side by Side",
    series: "search-fundamentals",
    seriesOrder: 3,
    description:
      "Compare TF-IDF and BM25 on keyword stuffing, long documents, and rare terms to see exactly where and why BM25 wins.",
    tags: ["tf-idf", "bm25", "comparison", "ranking"],
    readTime: "10 min",
    publishDate: "2026-03-26",
  },
  {
    slug: "vector-search",
    title: "Vector Search - From Zero",
    series: "search-fundamentals",
    seriesOrder: 4,
    description:
      "Understand embeddings, cosine similarity, and why vectors capture semantic meaning that keywords miss entirely.",
    tags: ["vectors", "embeddings", "cosine-similarity", "semantic"],
    readTime: "12 min",
    publishDate: "2026-03-26",
  },
  {
    slug: "hybrid-search",
    title: "Hybrid Search - Best of Both Worlds",
    series: "search-fundamentals",
    seriesOrder: 5,
    description:
      "Combine BM25 and vector search using Reciprocal Rank Fusion (RRF) to get the precision of keywords with the recall of semantics.",
    tags: ["hybrid", "rrf", "bm25", "vectors"],
    readTime: "10 min",
    publishDate: "2026-03-27",
  },
  {
    slug: "evaluation-metrics",
    title: "Search Evaluation Metrics",
    series: "search-fundamentals",
    seriesOrder: 6,
    description:
      "Master precision, recall, F1, MRR, MAP, and NDCG - the metrics that tell you if your search engine actually works.",
    tags: ["precision", "recall", "ndcg", "mrr", "map"],
    readTime: "12 min",
    publishDate: "2026-03-27",
  },

  // ─── Series 2: Indexing ──────────────────────────────────────────
  {
    slug: "inverted-index",
    title: "Inverted Index - Heart of Every Search Engine",
    series: "indexing",
    seriesOrder: 1,
    description:
      "Build an inverted index from scratch - the data structure that makes sub-second search across billions of documents possible.",
    tags: ["inverted-index", "data-structure", "posting-list"],
    readTime: "12 min",
    publishDate: "2026-03-27",
  },
  {
    slug: "document-chunking",
    title: "Document Chunking Strategies",
    series: "indexing",
    seriesOrder: 2,
    description:
      "Break large documents into optimal chunks for indexing - fixed-size, sentence-based, paragraph-based, and semantic chunking.",
    tags: ["chunking", "indexing", "preprocessing"],
    readTime: "10 min",
    publishDate: "2026-03-27",
  },
  {
    slug: "metadata-and-fields",
    title: "Metadata and Fields",
    series: "indexing",
    seriesOrder: 3,
    description:
      "Structure your index with field types - text, keyword, numeric, boolean, date - and understand when to search vs filter.",
    tags: ["metadata", "fields", "filtering", "schema"],
    readTime: "8 min",
    publishDate: "2026-03-28",
  },
  {
    slug: "index-operations",
    title: "Index Operations - CRUD & Reindexing",
    series: "indexing",
    seriesOrder: 4,
    description:
      "Create, update, delete, and reindex - including zero-downtime reindexing with aliases and versioning strategies.",
    tags: ["crud", "reindex", "aliases", "zero-downtime"],
    readTime: "10 min",
    publishDate: "2026-03-28",
  },

  // ─── Series 3: Query Processing ─────────────────────────────────
  {
    slug: "query-preprocessing",
    title: "Query Preprocessing Pipeline",
    series: "query-processing",
    seriesOrder: 1,
    description:
      "Build the full pipeline: tokenization, lowercasing, punctuation removal, stopword filtering, stemming, and lemmatization.",
    tags: ["tokenization", "stemming", "stopwords", "nlp"],
    readTime: "10 min",
    publishDate: "2026-03-28",
  },
  {
    slug: "retrieval-flow",
    title: "Complete Retrieval Pipeline",
    series: "query-processing",
    seriesOrder: 2,
    description:
      "Trace a query end-to-end through preprocessing, BM25 retrieval, vector search, RRF fusion, filtering, and final ranking.",
    tags: ["retrieval", "pipeline", "end-to-end"],
    readTime: "12 min",
    publishDate: "2026-03-28",
  },
  {
    slug: "filtering",
    title: "Filtering in Search",
    series: "query-processing",
    seriesOrder: 3,
    description:
      "Understand ranking vs filtering, pre-filter vs post-filter, faceted search, and the performance implications of each approach.",
    tags: ["filtering", "facets", "pre-filter", "post-filter"],
    readTime: "10 min",
    publishDate: "2026-03-29",
  },
  {
    slug: "spell-correction",
    title: "Spell Correction & Query Expansion",
    series: "query-processing",
    seriesOrder: 4,
    description:
      "Build 'Did you mean?' using edit distance and word frequency, plus synonym expansion for better recall.",
    tags: ["spell-check", "edit-distance", "synonyms", "query-expansion"],
    readTime: "10 min",
    publishDate: "2026-03-29",
  },

  // ─── Series 4: Ranking & Relevance ──────────────────────────────
  {
    slug: "multi-stage-ranking",
    title: "Multi-Stage Ranking - Millions to Top 10",
    series: "ranking-relevance",
    seriesOrder: 1,
    description:
      "Design a ranking pipeline with candidate generation (L0), lightweight scoring (L1), and heavy re-ranking (L2) - the hiring funnel analogy.",
    tags: ["ranking", "re-ranking", "pipeline", "l0-l1-l2"],
    readTime: "12 min",
    publishDate: "2026-03-29",
  },
  {
    slug: "hybrid-scoring",
    title: "Hybrid Scoring Methods",
    series: "ranking-relevance",
    seriesOrder: 2,
    description:
      "Three production methods for combining BM25 and vector scores - linear combination, RRF, and learned fusion.",
    tags: ["hybrid-scoring", "rrf", "fusion", "normalization"],
    readTime: "10 min",
    publishDate: "2026-03-29",
  },
  {
    slug: "relevance-tuning",
    title: "Relevance Tuning",
    series: "ranking-relevance",
    seriesOrder: 3,
    description:
      "Field boosting, function scoring (recency, popularity), query-time boosting, and A/B testing for search relevance.",
    tags: ["boosting", "function-score", "tuning", "a-b-testing"],
    readTime: "10 min",
    publishDate: "2026-03-30",
  },
  {
    slug: "ranking-signals",
    title: "Ranking Signals - The Complete Catalog",
    series: "ranking-relevance",
    seriesOrder: 4,
    description:
      "Keyword, semantic, popularity, freshness, quality, and personalization signals - how they combine into a ranking scorecard.",
    tags: ["signals", "features", "scoring", "personalization"],
    readTime: "12 min",
    publishDate: "2026-03-30",
  },

  // ─── Series 5: System Design ────────────────────────────────────
  {
    slug: "capacity-estimation",
    title: "Capacity Estimation for Search Systems",
    series: "system-design",
    seriesOrder: 1,
    description:
      "Back-of-envelope math for QPS, storage, memory, and bandwidth - the restaurant analogy for search capacity planning.",
    tags: ["capacity", "qps", "storage", "estimation"],
    readTime: "10 min",
    publishDate: "2026-03-30",
  },
  {
    slug: "sharding-and-replication",
    title: "Sharding & Replication",
    series: "system-design",
    seriesOrder: 2,
    description:
      "Split data across shards for throughput, replicate for availability - the pizza kitchen analogy for distributed search.",
    tags: ["sharding", "replication", "distributed", "scaling"],
    readTime: "12 min",
    publishDate: "2026-03-30",
  },
  {
    slug: "caching",
    title: "Caching for Search Systems",
    series: "system-design",
    seriesOrder: 3,
    description:
      "LRU, LFU, and TTL caching strategies for search - what to cache, when to invalidate, and the librarian analogy.",
    tags: ["caching", "lru", "lfu", "invalidation"],
    readTime: "12 min",
    publishDate: "2026-03-31",
  },
  {
    slug: "architecture-walkthrough",
    title: "eCommerce Search Architecture Walkthrough",
    series: "system-design",
    seriesOrder: 4,
    description:
      "Full system design deep-dive walkthrough - requirements, high-level design, query flow, ingestion pipeline, and failure modes.",
    tags: ["system-design", "architecture", "ecommerce", "walkthrough"],
    readTime: "18 min",
    publishDate: "2026-03-31",
  },

  // ─── Series 6: Data Pipelines ───────────────────────────────────
  {
    slug: "batch-vs-realtime",
    title: "Batch vs Real-Time Processing",
    series: "data-pipelines",
    seriesOrder: 1,
    description:
      "Two fundamental approaches to moving data - nightly rebuilds vs instant updates, and when to use each.",
    tags: ["batch", "real-time", "streaming", "processing"],
    readTime: "10 min",
    publishDate: "2026-03-31",
  },
  {
    slug: "etl-pipeline",
    title: "ETL Pipeline for Search",
    series: "data-pipelines",
    seriesOrder: 2,
    description:
      "Build the Extract-Transform-Load pipeline - handling messy data, dead letter queues, monitoring, and error recovery.",
    tags: ["etl", "pipeline", "data-quality", "dlq"],
    readTime: "10 min",
    publishDate: "2026-03-31",
  },
  {
    slug: "index-update-strategies",
    title: "Index Update Strategies",
    series: "data-pipelines",
    seriesOrder: 3,
    description:
      "Full reindex, partial update, upsert, and zero-downtime reindexing with alias swaps - keeping the index fresh.",
    tags: ["reindex", "upsert", "alias-swap", "freshness"],
    readTime: "10 min",
    publishDate: "2026-04-01",
  },
  {
    slug: "data-quality",
    title: "Data Quality - Garbage In, Garbage Out",
    series: "data-pipelines",
    seriesOrder: 4,
    description:
      "Schema validation, completeness checks, freshness monitoring, and duplicate detection - ensuring your index is trustworthy.",
    tags: ["data-quality", "validation", "monitoring", "deduplication"],
    readTime: "8 min",
    publishDate: "2026-04-01",
  },

  // ─── Series 7: RAG Systems ──────────────────────────────────────
  {
    slug: "what-is-rag",
    title: "What is RAG?",
    series: "rag-systems",
    seriesOrder: 1,
    description:
      "Retrieval-Augmented Generation explained - the open-book exam analogy, the three problems RAG solves, and the R-A-G pipeline.",
    tags: ["rag", "llm", "retrieval", "generation"],
    readTime: "10 min",
    publishDate: "2026-04-01",
  },
  {
    slug: "chunking-for-rag",
    title: "Chunking for RAG",
    series: "rag-systems",
    seriesOrder: 2,
    description:
      "Why chunk size and overlap matter enormously for RAG quality - the index card analogy and five chunking strategies.",
    tags: ["chunking", "rag", "overlap", "strategies"],
    readTime: "10 min",
    publishDate: "2026-04-01",
  },
  {
    slug: "retrieval-pipeline",
    title: "RAG Retrieval Pipeline",
    series: "rag-systems",
    seriesOrder: 3,
    description:
      "The complete RAG journey - offline (chunk → embed → store) and online (embed query → search → re-rank → prompt).",
    tags: ["retrieval", "embedding", "re-ranking", "pipeline"],
    readTime: "12 min",
    publishDate: "2026-04-02",
  },
  {
    slug: "rag-evaluation",
    title: "RAG Evaluation",
    series: "rag-systems",
    seriesOrder: 4,
    description:
      "Measure RAG quality with four metrics - context relevance, faithfulness, answer relevance, and chunk utilization.",
    tags: ["evaluation", "faithfulness", "relevance", "metrics"],
    readTime: "10 min",
    publishDate: "2026-04-02",
  },
  {
    slug: "advanced-rag",
    title: "Advanced RAG Patterns",
    series: "rag-systems",
    seriesOrder: 5,
    description:
      "HyDE, multi-query retrieval, parent-child chunking, and self-RAG - patterns that push beyond basic retrieve-and-generate.",
    tags: ["hyde", "multi-query", "self-rag", "advanced"],
    readTime: "14 min",
    publishDate: "2026-04-02",
  },

  // ─── Series 8: Advanced Search ──────────────────────────────────
  {
    slug: "learning-to-rank",
    title: "Learning to Rank (LTR)",
    series: "advanced-search",
    seriesOrder: 1,
    description:
      "Teach a machine to judge relevance - pointwise, pairwise, and listwise approaches with feature engineering for search.",
    tags: ["ltr", "machine-learning", "ranking", "features"],
    readTime: "14 min",
    publishDate: "2026-04-03",
  },
  {
    slug: "click-models",
    title: "Click Models - Learning from User Behavior",
    series: "advanced-search",
    seriesOrder: 2,
    description:
      "Implicit feedback, position bias, debiased CTR, and the cascade click model - turning clicks into training signal.",
    tags: ["clicks", "implicit-feedback", "position-bias", "ctr"],
    readTime: "12 min",
    publishDate: "2026-04-03",
  },
  {
    slug: "personalization",
    title: "Search Personalization",
    series: "advanced-search",
    seriesOrder: 3,
    description:
      "Same query, different results - user profiles, collaborative filtering, contextual personalization, and the filter bubble problem.",
    tags: ["personalization", "collaborative-filtering", "user-profiles"],
    readTime: "12 min",
    publishDate: "2026-04-03",
  },
  {
    slug: "autocomplete",
    title: "Autocomplete & Typeahead",
    series: "advanced-search",
    seriesOrder: 4,
    description:
      "Build autocomplete from a trie data structure - prefix search, popularity ranking, fuzzy matching, and real-time suggestions.",
    tags: ["autocomplete", "trie", "typeahead", "prefix-search"],
    readTime: "12 min",
    publishDate: "2026-04-04",
  },
  {
    slug: "search-diversity",
    title: "Search Diversity",
    series: "advanced-search",
    seriesOrder: 5,
    description:
      "Don't show 10 identical results - MMR, intent-aware diversification, and the Jaguar problem.",
    tags: ["diversity", "mmr", "intent", "ambiguity"],
    readTime: "10 min",
    publishDate: "2026-04-04",
  },
];
