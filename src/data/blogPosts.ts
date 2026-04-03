export interface BlogSection {
  heading: string;
  content: string;
  code?: string;
  language?: string;
  filename?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  series: string;
  seriesOrder: number;
  description: string;
  tags: string[];
  readTime: string;
  publishDate: string;
  interactiveDemo?: string;
}

export interface BlogPost extends BlogPostMeta {
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/01-search-fundamentals/search-fundamentals.html",
    sections: [
      {
        heading: "The Simplest Search - Brute Force",
        content:
          "Imagine you're in a library with 10 million books and no catalog. To find a book about 'machine learning', you'd walk through every shelf, pull out every book, and check whether its title contains those words. That's brute-force search - and it's O(N × M) where N is the number of documents and M is the average document length.\n\nThis is how many people first think about search. It works, but it doesn't scale.",
        code: `documents = [
    "the cat sat on the mat",
    "the dog chased the cat",
    "machine learning is amazing",
    "search engines power the web",
]

def brute_force_search(query, docs):
    """O(N × M) - check every word in every doc."""
    results = []
    query_lower = query.lower()
    for i, doc in enumerate(docs):
        if query_lower in doc.lower():
            results.append((i, doc))
    return results

print(brute_force_search("cat", documents))`,
      },
      {
        heading: "Why Brute Force Fails at Scale",
        content:
          "Google indexes over 100 billion web pages. If each page averages 2,000 words, brute-force search would mean checking 200 trillion words for every query. At 1 million queries per second, that's physically impossible.\n\nThe key insight: we need to preprocess documents so that at query time, we can jump directly to relevant results instead of scanning everything.",
      },
      {
        heading: "The Textbook Index Analogy",
        content:
          'Think about the index at the back of a textbook. Instead of reading the entire book to find where "neural networks" is discussed, you look up the term in the index and get page numbers. That\'s exactly what a search index does - it\'s a pre-built data structure that maps terms to documents.',
        code: `# A simple "index" - maps words to document IDs
index = {}
for doc_id, doc in enumerate(documents):
    for word in doc.lower().split():
        if word not in index:
            index[word] = set()
        index[word].add(doc_id)

# Now "cat" lookup is O(1)!
print(index.get("cat", set()))  # {0, 1}`,
      },
      {
        heading: "Key Takeaway",
        content:
          "Search is fundamentally about trading storage and preprocessing time for query-time speed. Every technique in this series - from inverted indexes to vector embeddings - is a variation of this core idea: build smart data structures offline so you can answer queries in milliseconds.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/01-search-fundamentals/bm25-masterclass.html",
    sections: [
      {
        heading: "Why BM25 Matters",
        content:
          "BM25 (Best Matching 25) is the default ranking algorithm in Elasticsearch, Solr, Lucene, and virtually every production search engine. Despite being published in 1994, it remains remarkably hard to beat for keyword search. Understanding BM25 deeply is non-negotiable for anyone working in search.",
      },
      {
        heading: "Part 1: Term Frequency (TF)",
        content:
          'The first building block: how often does the query term appear in a document? A document mentioning "python" 10 times is probably more relevant than one mentioning it once.\n\nBut raw TF has a problem - a document mentioning "python" 100 times isn\'t 100x more relevant than one mentioning it once. BM25 uses a saturation function to handle this.',
        code: `import math

def tf_raw(term, doc):
    """Raw term frequency - count occurrences."""
    return doc.lower().split().count(term.lower())

def tf_bm25(term, doc, k1=1.2):
    """BM25 saturating TF: tf / (tf + k1)
    As tf grows, this approaches 1.0 but never reaches it."""
    raw = tf_raw(term, doc)
    return raw / (raw + k1)

doc = "python is great python is used for python development"
print(f"Raw TF: {tf_raw('python', doc)}")       # 3
print(f"BM25 TF: {tf_bm25('python', doc):.3f}")  # 0.714`,
      },
      {
        heading: "Part 2: Inverse Document Frequency (IDF)",
        content:
          'Not all terms are equally useful for finding relevant documents. The word "the" appears in almost every document, so it shouldn\'t contribute much to relevance. IDF measures how rare a term is across the entire corpus - rare terms get higher weights.',
        code: `def idf(term, corpus):
    """IDF = log((N - df + 0.5) / (df + 0.5) + 1)
    where N = total docs, df = docs containing the term."""
    N = len(corpus)
    df = sum(1 for doc in corpus if term.lower() in doc.lower())
    return math.log((N - df + 0.5) / (df + 0.5) + 1)`,
      },
      {
        heading: "Part 3: Length Normalization",
        content:
          "Longer documents naturally contain more term occurrences. Without normalization, a 10,000-word document would always rank higher than a 100-word document. BM25's parameter `b` controls how much document length affects scoring - b=1 means full normalization, b=0 means none.",
        code: `def bm25_score(term, doc, corpus, k1=1.2, b=0.75):
    """Full BM25 score for a single term."""
    tf = tf_raw(term, doc)
    doc_len = len(doc.split())
    avg_dl = sum(len(d.split()) for d in corpus) / len(corpus)

    # Length-normalized TF with saturation
    tf_component = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc_len / avg_dl))

    return idf(term, corpus) * tf_component`,
      },
      {
        heading: "Key Takeaway",
        content:
          "BM25 = IDF × saturated TF with length normalization. The two key parameters are k1 (controls TF saturation - higher means raw count matters more) and b (controls length normalization - higher penalizes long documents more). Most engines default to k1=1.2, b=0.75.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Historical Relationship",
        content:
          "TF-IDF was the original relevance scoring method, dating back to the 1970s. BM25 evolved from it in the 1990s, adding two critical improvements: TF saturation and document length normalization. Understanding both helps you appreciate why BM25 became the industry standard.",
      },
      {
        heading: "Where BM25 Wins",
        content:
          "1. **Keyword stuffing**: TF-IDF rewards documents that repeat a term many times. BM25's saturation function caps this benefit.\n2. **Long documents**: TF-IDF naturally favors longer docs. BM25's length normalization levels the field.\n3. **Practical defaults**: BM25's k1 and b parameters have well-studied defaults that work across domains.",
      },
      {
        heading: "Key Takeaway",
        content:
          "TF-IDF is a good teaching tool, but BM25 is what you should use in production. The saturation and length normalization make it robust against common pathologies in real-world text.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/01-search-fundamentals/vector-indexing-deep-dive.html",
    sections: [
      {
        heading: "The Limits of Keywords",
        content:
          'BM25 is powerful, but it has a fundamental limitation: it only matches exact terms. Search for "automobile" and you won\'t find documents about "cars." Search for "how to fix a broken heart" and you\'ll get results about cardiac surgery, not relationship advice.\n\nVector search solves this by representing documents and queries as points in a high-dimensional space where semantic similarity maps to geometric proximity.',
      },
      {
        heading: "What is a Vector?",
        content:
          "A vector is just a list of numbers. In search, we use neural networks (embedding models) to convert text into vectors of 384-1536 dimensions. The key property: texts with similar meaning end up with similar vectors.",
        code: `import numpy as np

def cosine_similarity(a, b):
    """Measure similarity between two vectors.
    Returns 1.0 for identical directions, 0.0 for orthogonal."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Simulated embeddings (real ones come from models like all-MiniLM-L6-v2)
car_vec = np.array([0.8, 0.6, 0.1, 0.3])
automobile_vec = np.array([0.79, 0.62, 0.12, 0.28])
pizza_vec = np.array([0.1, 0.2, 0.9, 0.7])

print(f"car vs automobile: {cosine_similarity(car_vec, automobile_vec):.3f}")  # ~0.999
print(f"car vs pizza: {cosine_similarity(car_vec, pizza_vec):.3f}")            # ~0.507`,
      },
      {
        heading: "Key Takeaway",
        content:
          "Vector search captures meaning, not just keywords. But it comes with trade-offs: embedding models are slower and more expensive than BM25, and they can sometimes miss exact keyword matches. That's why modern search engines use both - which brings us to hybrid search.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Why Hybrid?",
        content:
          'BM25 excels at exact keyword matching - search for "error code 404" and it nails it. Vector search excels at semantic understanding - search for "page not found" and it finds the same content. Hybrid search combines both to cover all cases.',
      },
      {
        heading: "Reciprocal Rank Fusion (RRF)",
        content:
          "The most popular fusion method. For each document, compute: score = sum(1 / (k + rank)) across all retrieval methods. The constant k (typically 60) prevents the top result from dominating.",
        code: `def reciprocal_rank_fusion(ranked_lists, k=60):
    """Combine multiple ranked lists using RRF."""
    scores = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            if doc_id not in scores:
                scores[doc_id] = 0.0
            scores[doc_id] += 1.0 / (k + rank)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

bm25_results = ["doc_A", "doc_B", "doc_C", "doc_D"]
vector_results = ["doc_C", "doc_A", "doc_E", "doc_B"]

fused = reciprocal_rank_fusion([bm25_results, vector_results])
print(fused)  # doc_A and doc_C rank highest (appear in both)`,
      },
      {
        heading: "Key Takeaway",
        content:
          "Hybrid search with RRF is the current industry standard. It's simple, effective, and doesn't require tuning weights between BM25 and vector scores. Most modern search platforms (Elasticsearch, Weaviate, Pinecone) support it natively.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Why Metrics Matter",
        content:
          "You can't improve what you can't measure. Search evaluation metrics tell you how good your ranking is - are relevant documents appearing at the top? Are you missing relevant results? Are you showing too many irrelevant ones?",
      },
      {
        heading: "Precision and Recall",
        content:
          "**Precision** = relevant results / total results returned. **Recall** = relevant results returned / total relevant docs in corpus. There's always a tension: returning more results improves recall but can hurt precision.",
        code: `def precision_at_k(relevant, retrieved, k):
    """What fraction of the top-k results are relevant?"""
    top_k = retrieved[:k]
    return len(set(top_k) & set(relevant)) / k

def recall_at_k(relevant, retrieved, k):
    """What fraction of all relevant docs appear in top-k?"""
    top_k = retrieved[:k]
    return len(set(top_k) & set(relevant)) / len(relevant)

relevant = {"doc1", "doc3", "doc5"}
retrieved = ["doc1", "doc2", "doc3", "doc4", "doc5"]

print(f"P@3: {precision_at_k(relevant, retrieved, 3):.2f}")  # 0.67
print(f"R@3: {recall_at_k(relevant, retrieved, 3):.2f}")     # 0.67`,
      },
      {
        heading: "NDCG - The Gold Standard",
        content:
          "Normalized Discounted Cumulative Gain handles graded relevance (not just relevant/irrelevant). It penalizes relevant documents that appear lower in the ranking, using a logarithmic discount. NDCG@10 is the most commonly reported metric in search.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Use Precision@K for user-facing quality, Recall@K for completeness, MRR when you care about the first relevant result, and NDCG when you have graded relevance judgments. In practice, always prioritize NDCG - it's the metric search teams actually optimize.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/02-indexing/indexing-deep-dive.html",
    sections: [
      {
        heading: "Forward Index vs Inverted Index",
        content:
          "A forward index maps document ID → list of terms. An inverted index flips this: term → list of document IDs. This inversion is what makes search fast - given a query term, you can immediately look up which documents contain it.",
        code: `# Forward index: doc -> terms
forward = {
    "doc1": ["python", "is", "great"],
    "doc2": ["java", "is", "popular"],
    "doc3": ["python", "and", "java"],
}

# Inverted index: term -> docs
inverted = {}
for doc_id, terms in forward.items():
    for term in terms:
        if term not in inverted:
            inverted[term] = []
        inverted[term].append(doc_id)

# "python" -> ["doc1", "doc3"] - O(1) lookup!
print(inverted["python"])`,
      },
      {
        heading: "Key Takeaway",
        content:
          "The inverted index is the single most important data structure in search. Every search engine - from Lucene to Google - is built on this concept. Understanding how to build, update, and optimize inverted indexes is fundamental.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Why Chunk?",
        content:
          "LLMs have token limits. Search results are more precise when they point to specific passages rather than entire documents. Chunking breaks documents into indexable pieces, but the strategy matters enormously for retrieval quality.",
      },
      {
        heading: "Four Chunking Strategies",
        content:
          "1. **Fixed-size** - split every N characters/tokens. Simple but can break mid-sentence.\n2. **Sentence-based** - split on sentence boundaries. Preserves meaning but variable sizes.\n3. **Paragraph-based** - split on paragraph breaks. Natural content boundaries.\n4. **Semantic** - use embeddings to find topic shifts. Best quality but most expensive.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Start with paragraph-based chunking with overlap (10-20% of chunk size). Move to semantic chunking only if retrieval quality needs improvement. Always keep metadata linking chunks back to their source document.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Search vs Filter",
        content:
          "Search fields are analyzed (tokenized, stemmed) and scored by relevance. Filter fields use exact matching with no scoring. Understanding this distinction is crucial for designing an efficient index schema.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Design your schema upfront. Use text fields for content you want to search, keyword fields for exact-match filtering (categories, status), numeric fields for range queries (price, date), and boolean fields for flags.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Index Lifecycle",
        content:
          "Indexes aren't static. Documents are added, updated, and deleted constantly. The challenge is performing these operations without degrading search quality or availability.",
      },
      {
        heading: "Zero-Downtime Reindexing",
        content:
          "The alias swap pattern: create a new index version, populate it in the background, then atomically switch the alias from the old index to the new one. Users never experience downtime.",
        code: `# Alias swap pattern
# 1. Create new index: products_v2
# 2. Reindex all documents into products_v2
# 3. Atomic alias swap:
#    POST /_aliases
#    { "actions": [
#        { "remove": { "index": "products_v1", "alias": "products" } },
#        { "add":    { "index": "products_v2", "alias": "products" } }
#    ]}
# 4. Delete old index: products_v1`,
        language: "python",
      },
      {
        heading: "Key Takeaway",
        content:
          "Always use aliases in production. Never point applications directly at index names. This gives you the flexibility to reindex, upgrade mappings, and recover from issues without any downtime.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/03-query-processing/query-and-ranking.html",
    sections: [
      {
        heading: "Why Preprocess?",
        content:
          'Raw queries are messy. Users type "Running shoes!!" or "BEST python tutorial???" - your search engine needs to normalize this into a clean, matchable form. The preprocessing pipeline is the first thing that touches every query.',
      },
      {
        heading: "The Pipeline",
        content:
          "1. **Tokenize** - split into words\n2. **Lowercase** - normalize case\n3. **Remove punctuation** - strip noise\n4. **Remove stopwords** - drop common words like 'the', 'is', 'at'\n5. **Stem/Lemmatize** - reduce words to root forms ('running' → 'run')",
      },
      {
        heading: "Key Takeaway",
        content:
          "Apply the same preprocessing to both queries and documents at index time. Mismatched preprocessing is one of the most common causes of search bugs - if you stem at index time, you must stem at query time too.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "From Query to Results",
        content:
          "A modern search engine processes queries through multiple stages: preprocess → retrieve candidates (BM25 + vector) → fuse scores (RRF) → apply filters → re-rank → return top K. Understanding this end-to-end flow is essential for debugging and optimization.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Each stage in the pipeline trades off recall for precision. Candidate retrieval is broad and fast; re-ranking is narrow and expensive. Design your pipeline so that earlier stages are fast and high-recall, and later stages are precise.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Ranking vs Filtering",
        content:
          "Ranking scores documents on a continuous scale. Filtering is binary - a document either matches the filter or it doesn't. Filters narrow the candidate set; ranking orders what remains.",
      },
      {
        heading: "Pre-filter vs Post-filter",
        content:
          "Pre-filter narrows the corpus before ranking - faster but may miss relevant results in edge cases. Post-filter ranks first, then removes non-matching results - better recall but can leave you with fewer results than expected.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Pre-filter for hard constraints (e.g., 'in stock only'). Post-filter for soft constraints where you can fall back to showing all results. Implement facets to let users refine results interactively.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Why Spell Correction Matters",
        content:
          "Studies show 10-15% of search queries contain typos. Without spell correction, these queries return zero results - the worst possible user experience.",
      },
      {
        heading: "Edit Distance + Frequency",
        content:
          "The classic approach: find dictionary words within edit distance 1-2 of the query term, then rank corrections by word frequency. 'pythn' → 'python' (edit distance 1, high frequency) beats 'python' → 'pithon' (edit distance 1, low frequency).",
      },
      {
        heading: "Key Takeaway",
        content:
          "Spell correction and query expansion are cheap ways to dramatically improve search quality. Implement spell correction first (biggest impact), then add synonyms for common terms in your domain.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/04-ranking-relevance/query-and-ranking.html",
    sections: [
      {
        heading: "The Hiring Analogy",
        content:
          "Think of ranking like a hiring pipeline. L0 (resume screening) quickly narrows 10,000 applicants to 1,000 candidates. L1 (phone screen) applies lightweight scoring to get 100 strong candidates. L2 (final evaluation) does expensive, detailed assessment to pick the top 10.",
      },
      {
        heading: "Why Multiple Stages?",
        content:
          "You can't run an expensive neural re-ranker on 10 million documents - it would take minutes. But you can run BM25 on 10M docs in milliseconds to get 1,000 candidates, then re-rank those 1,000 with a more sophisticated model.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Every production search system uses multi-stage ranking. The art is choosing the right model complexity and candidate set size at each stage to balance latency, cost, and quality.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Score Scale Problem",
        content:
          "BM25 scores might range from 0-25. Vector cosine similarity ranges from -1 to 1. You can't just add them together. The three main approaches: min-max normalization + weighted sum, RRF (rank-based, score-agnostic), and learned fusion weights.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Start with RRF - it's parameter-free and works well out of the box. Move to learned fusion only if you have enough click data to train a model.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Field Boosting",
        content:
          "Not all fields are equal. A match in the title should score higher than a match in the body. Field boosting lets you assign weights: title^3.0, description^1.5, body^1.0.",
      },
      {
        heading: "Function Scoring",
        content:
          "Combine relevance with business signals: recency (newer products rank higher), popularity (click count, sales volume), and quality (review score). Function scoring blends these into the final rank.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Relevance tuning is iterative. Start with sensible field boosts, add function scoring for business signals, then validate with A/B tests. Never tune on gut feeling alone - always measure.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Six Signal Categories",
        content:
          "1. **Keyword** - BM25, exact match, phrase match\n2. **Semantic** - vector similarity, cross-encoder\n3. **Popularity** - clicks, purchases, views\n4. **Freshness** - recency decay, trending\n5. **Quality** - ratings, spam score, content length\n6. **Personal** - user history, collaborative filtering",
      },
      {
        heading: "Key Takeaway",
        content:
          "Great search combines multiple signal types. Start with keyword + semantic, add popularity and freshness, then personalization. Each signal addresses a different aspect of what makes a result 'good.'",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/05-system-design/system-design.html",
    sections: [
      {
        heading: "Why Estimate?",
        content:
          "Before building anything, you need to know: How many queries per second? How much data? How much memory for indexes? How many machines? Capacity estimation gives you the foundation for every architecture decision.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Always start system design with capacity estimation. It demonstrates an understanding of scale and guides your design decisions. Use the formula: storage = docs × avg_size × replication_factor × index_overhead.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Pizza Kitchen Analogy",
        content:
          "Sharding is like having multiple pizza ovens - each handles a portion of the orders. Replication is like having a backup oven - if one breaks, the others keep serving. For search, shards split the index across machines; replicas copy shards for redundancy and read scaling.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Shard by document count (each shard holds a subset of docs). Replicate for read throughput and fault tolerance. In search, queries hit all shards in parallel (scatter-gather), so latency is determined by the slowest shard.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "What to Cache in Search",
        content:
          "Three cache layers: query result cache (full result sets for popular queries), filter cache (pre-computed filter bitsets), and field data cache (sorted field values for facets). Each serves a different purpose and has different invalidation needs.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Cache popular queries aggressively (Zipf's law - a small percentage of queries account for most traffic). Use TTL-based invalidation with a short TTL for frequently-updated indexes. Always warm the cache after reindexing.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Requirements Gathering",
        content:
          "Start every system design with requirements. Functional: product search, autocomplete, filters, sorting. Non-functional: <200ms p99 latency, 10K QPS, 50M products, 99.9% availability.",
      },
      {
        heading: "High-Level Architecture",
        content:
          "API Gateway → Query Service → Search Cluster (Elasticsearch). Ingestion: Product DB → Kafka → Indexer → Search Cluster. Supporting: Cache (Redis), Feature Store, Monitoring (metrics + alerts).",
      },
      {
        heading: "Key Takeaway",
        content:
          "In system design discussions, structure your approach: requirements → capacity estimation → high-level design → deep dive on query flow → deep dive on ingestion → failure modes → monitoring. This demonstrates senior-level thinking.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/06-data-pipelines/data-pipelines.html",
    sections: [
      {
        heading: "Buffet vs Made-to-Order",
        content:
          "Batch processing is like a buffet - prepare everything at once, serve it all. Real-time is made-to-order - process each item as it arrives. Most search systems use a hybrid: batch for full reindexes, real-time for updates.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Start with batch (simpler, more reliable). Add real-time only when freshness requirements demand it. The hybrid approach - nightly batch + real-time delta updates - is the industry standard.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Assembly Line",
        content:
          "Extract: pull data from source systems (databases, APIs, files). Transform: clean, normalize, enrich (add embeddings, compute features). Load: push to the search index. Each stage can fail - your pipeline needs error handling at every step.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Build idempotent pipelines - re-running them should produce the same result. Use dead letter queues for failed documents. Monitor pipeline health: throughput, error rate, end-to-end latency.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Four Update Strategies",
        content:
          "1. **Full reindex** - rebuild everything (simple, slow, safe)\n2. **Partial update** - update only changed fields (fast, complex)\n3. **Upsert** - insert or update based on ID (good for real-time)\n4. **Alias swap** - build new index, swap atomically (zero downtime)",
      },
      {
        heading: "Key Takeaway",
        content:
          "Use upsert for real-time updates and alias swap for schema changes or full rebuilds. Always have a rollback plan - keep the previous index version until the new one is verified.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Five Quality Dimensions",
        content:
          "1. **Schema** - does the data match expected types?\n2. **Completeness** - are required fields present?\n3. **Freshness** - is the data up to date?\n4. **Consistency** - do related fields agree?\n5. **Uniqueness** - are there duplicates?",
      },
      {
        heading: "Key Takeaway",
        content:
          "Validate data at ingestion time, not query time. Bad data in the index is worse than missing data - it actively degrades search quality. Build automated quality checks into your pipeline.",
      },
    ],
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
    publishDate: "2026-04-03",
    interactiveDemo: "/topics/07-rag-systems/rag-systems.html",
    sections: [
      {
        heading: "The Open-Book Exam Analogy",
        content:
          "A plain LLM is like a closed-book exam - it can only use what it memorized during training. RAG is an open-book exam - the model retrieves relevant context from external documents before generating an answer. This means it can answer questions about your private data, stay current, and cite sources.",
      },
      {
        heading: "The 3 Problems RAG Solves",
        content:
          "1. **Knowledge cutoff** - LLMs don't know about events after their training date\n2. **Hallucination** - grounding answers in retrieved documents reduces fabrication\n3. **Private data** - your company's internal docs aren't in the training data",
      },
      {
        heading: "Key Takeaway",
        content:
          "RAG = Retrieve relevant context + Augment the prompt with that context + Generate an answer. The retrieval quality is the bottleneck - a perfect LLM with bad retrieval produces bad answers.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Index Card Analogy",
        content:
          "Imagine writing a cheat sheet for an exam on index cards. Too small (one sentence per card) and you lose context. Too large (entire chapters per card) and you can't find specific answers quickly. RAG chunking has the same trade-off.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Start with 512-token chunks with 50-100 token overlap. Test different sizes against your actual queries. The 'right' chunk size depends on your documents and question types - there's no universal answer.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Two Phases",
        content:
          "**Offline (indexing):** chunk documents → generate embeddings → store in vector database with metadata.\n**Online (querying):** embed the query → retrieve top-K chunks → re-rank for relevance → assemble prompt → send to LLM.",
      },
      {
        heading: "Key Takeaway",
        content:
          "The re-ranking step is often the difference between a good and great RAG system. Retrieve broadly (top 50-100), re-rank to find the best 3-5 chunks, and only send those to the LLM. This maximizes context quality within the token budget.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Four Metrics",
        content:
          "1. **Context relevance** - are the retrieved chunks actually relevant to the question?\n2. **Faithfulness** - does the answer stick to what's in the retrieved context?\n3. **Answer relevance** - does the answer actually address the question?\n4. **Chunk utilization** - how much of the retrieved context is actually used?",
      },
      {
        heading: "Key Takeaway",
        content:
          "Evaluate retrieval and generation separately. Bad retrieval + good generation = hallucinated answers that sound confident. Good retrieval + bad generation = wasted context. Both components need their own metrics.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "Four Advanced Patterns",
        content:
          "1. **HyDE** - generate a hypothetical answer, use it as the search query (better embeddings)\n2. **Multi-query** - rephrase the question multiple ways, retrieve for each, deduplicate\n3. **Parent-child** - index small chunks for precision, retrieve parent chunks for context\n4. **Self-RAG** - the model decides when to retrieve and critiques its own answers",
      },
      {
        heading: "Key Takeaway",
        content:
          "Don't over-engineer. Start with basic RAG, measure performance, then add advanced patterns to address specific failure modes. HyDE helps when queries are vague, multi-query helps for complex questions, parent-child helps for context-dependent answers.",
      },
    ],
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
    interactiveDemo: "/topics/10-advanced-search/advanced-search.html",
    sections: [
      {
        heading: "Three Approaches",
        content:
          "1. **Pointwise** - predict relevance score for each document independently\n2. **Pairwise** - predict which of two documents is more relevant (e.g., RankNet, LambdaMART)\n3. **Listwise** - optimize the entire ranking directly (e.g., ListNet, ApproxNDCG)",
      },
      {
        heading: "Key Takeaway",
        content:
          "LTR requires training data (typically from click logs). Start with pairwise approaches (LambdaMART is the industry workhorse) and use features like BM25 score, vector similarity, click-through rate, freshness, and field match signals.",
      },
    ],
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
    sections: [
      {
        heading: "The Position Bias Problem",
        content:
          "Users click position 1 far more than position 5, regardless of relevance. Raw click-through rates are biased by position. Click models correct for this bias to extract a true relevance signal from implicit feedback.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Never use raw CTR as a relevance signal - it's position-biased. Use debiased CTR or cascade click models. Combine implicit signals (clicks, dwell time) with sparse explicit signals (ratings) for the best training data.",
      },
    ],
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
    sections: [
      {
        heading: "Three Personalization Approaches",
        content:
          '1. **Profile boosting** - boost results matching user preferences (e.g., preferred brands)\n2. **Collaborative filtering** - "users like you also searched for..."\n3. **Contextual** - time of day, device, location, session history',
      },
      {
        heading: "Key Takeaway",
        content:
          "Personalization improves relevance but creates filter bubbles. Always balance personalization with diversity. A good rule: personalize within the top results, but keep exploratory results in the mix.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Trie Data Structure",
        content:
          "A trie (prefix tree) is the backbone of autocomplete. Each node represents a character; paths from root to nodes spell out prefixes. To find suggestions for 'pyt', traverse to the 'p→y→t' node and collect all completions below it.",
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.popularity = 0

class AutocompleteTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word, popularity=1):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.popularity += popularity

    def suggest(self, prefix, limit=5):
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []
            node = node.children[char]
        results = []
        self._collect(node, prefix, results)
        return sorted(results, key=lambda x: -x[1])[:limit]

    def _collect(self, node, prefix, results):
        if node.is_end:
            results.append((prefix, node.popularity))
        for char, child in node.children.items():
            self._collect(child, prefix + char, results)`,
      },
      {
        heading: "Key Takeaway",
        content:
          "Autocomplete must be fast (<50ms) because it runs on every keystroke. Use a trie for prefix matching, rank by popularity/recency, and add fuzzy matching for typo tolerance. Cache aggressively - the same prefixes are queried repeatedly.",
      },
    ],
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
    publishDate: "2026-04-03",
    sections: [
      {
        heading: "The Jaguar Problem",
        content:
          'Search "jaguar" - do you mean the car, the animal, the Jacksonville NFL team, or the macOS version? Without diversity, all 10 results might be about the car (most popular meaning). Diversity ensures coverage across intents.',
      },
      {
        heading: "Maximal Marginal Relevance (MMR)",
        content:
          "MMR balances relevance and diversity: score = λ × relevance(doc, query) - (1-λ) × max_similarity(doc, selected_docs). At each step, pick the document that's most relevant but least similar to what you've already selected.",
      },
      {
        heading: "Key Takeaway",
        content:
          "Diversity matters most for ambiguous queries. Use MMR as a simple, effective approach. Set λ between 0.5-0.7 for a good balance. For eCommerce, also diversify by category, brand, and price range.",
      },
    ],
  },
];

export function getPostBySlug(series: string, slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.series === series && p.slug === slug);
}

export function getPostsBySeries(seriesId: string): BlogPost[] {
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
