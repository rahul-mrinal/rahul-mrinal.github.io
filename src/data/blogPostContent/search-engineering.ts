import type { BlogSection } from "../blogPosts/types";

export const searchEngineeringContent: Record<string, BlogSection[]> = {
  // ─── Series 1: Search Fundamentals ───────────────────────────────
  "search-fundamentals/what-is-search": [
    {
      heading: "The Simplest Search - Brute Force",
      content:
        "Imagine a massive warehouse with millions of boxes. A customer walks in and says, \"I need something about Italian cooking for beginners.\" Brute-force search means opening every single box to check. That's O(N x M) where N is the number of documents and M is the average document length.\n\nThis is how many people first think about search - scan every document, check for a match. It works for small collections, but it completely falls apart at scale. Try the interactive demo below to watch brute-force search scan through every vector one by one.",
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
      playground: "brute-force-search",
    },
    {
      heading: "Why Brute Force Fails at Scale",
      content:
        "Google indexes over 100 billion web pages. If each page averages 2,000 words, brute-force search would mean checking 200 trillion words for every query. At 1 million queries per second, that's physically impossible.\n\nThe key insight: we need to preprocess documents so that at query time, we can jump directly to relevant results instead of scanning everything.",
    },
    {
      heading: "Full-Text Search vs Structured Queries",
      content:
        "Before diving deeper, it helps to understand what makes search hard. There are two fundamentally different kinds of search:\n\n| Aspect | Full-Text Search | Structured Queries |\n|---|---|---|\n| Data type | Unstructured natural language (articles, web pages, PDFs) | Structured rows and columns with defined schemas |\n| Example query | \"best Italian pasta recipes for beginners\" | `SELECT * FROM recipes WHERE cuisine = 'Italian'` |\n| Matching | Fuzzy, ranked by degree of relevance | Exact - a row either matches the WHERE clause or it doesn't |\n| Techniques | BM25, TF-IDF, vector search, inverted indexes | B-trees, hash indexes, query planners |\n\nFull-text search is fundamentally harder because there's no binary \"match\" - only a spectrum of relevance. You must deal with ambiguity, synonyms, typos, context, and user intent.",
    },
    {
      heading: "The Search Pipeline",
      content:
        "Every search system - from Google to your internal Elasticsearch cluster - follows the same high-level pipeline:\n\n| Stage | What Happens |\n|---|---|\n| **Query** | User enters their information need - keywords, a question, or natural language |\n| **Understand** | Query processing: tokenization, lowercasing, stemming, synonym expansion, spell correction, intent classification |\n| **Retrieve** | Cast a wide net to find candidate documents from the corpus (high recall). Uses inverted indexes or ANN search. Typically returns hundreds to thousands of candidates |\n| **Rank** | Score and sort candidates by relevance. BM25, learned rankers, cross-encoders, or LLM-based rerankers apply here. Optimize for precision at the top |\n| **Return** | Return the top-k results with snippets, highlights, metadata, and facets |\n\nThe art of search engineering is optimizing each stage. Earlier stages prioritize speed and recall; later stages prioritize precision.",
    },
    {
      heading: "The Inverted Index",
      content:
        "The foundational data structure of text search. Instead of scanning every document (forward index: doc -> terms), we flip the mapping: **term -> list of documents containing that term**.\n\nThink about the index at the back of a textbook. Instead of reading every page to find \"photosynthesis,\" you flip to the index, find \"photosynthesis -> pages 42, 87, 156\" and go directly there.\n\n| Term | Posting List |\n|---|---|\n| `cat` | D1, D2 |\n| `sat` | D1 |\n| `dog` | D2 |\n| `mat` | D1, D3 |\n| `red` | D3 |\n\nQuery \"cat mat\" -> intersect posting lists -> D1 appears in both -> rank D1 highest. No full scan needed.\n\nBefore text enters the index, it goes through a processing pipeline: Raw Text -> Tokenize -> Lowercase -> Remove Stopwords -> Stem/Lemmatize -> Index. The same pipeline must run at both index time and query time - mismatched preprocessing is one of the most common causes of search bugs.",
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
      heading: "Vector Search and Cosine Similarity",
      content:
        "Keyword search fails when users express the same idea with different words. Search for \"automobile\" and BM25 won't find documents about \"cars.\" Vector search solves this by representing text as dense vectors (lists of floating-point numbers) in a high-dimensional space where **semantic similarity maps to geometric proximity**.\n\nAn embedding model (like Sentence-BERT or OpenAI's text-embedding-3) converts text into vectors of 384-3072 dimensions. The key property: texts with similar meanings end up with similar vectors. \"King\" - \"Man\" + \"Woman\" approximates \"Queen\" - embeddings capture semantic relationships as geometric relationships.\n\nThree main distance metrics measure similarity between vectors:\n\n| Metric | Formula | Range | Best For |\n|---|---|---|---|\n| **Cosine Similarity** | dot(a,b) / (norm(a) * norm(b)) | [-1, 1] | Text similarity, NLP - ignores magnitude, only cares about direction |\n| **Dot Product** | sum(a_i * b_i) | Unbounded | Recommendations, MIPS - when normalized, equivalent to cosine but faster |\n| **Euclidean Distance** | sqrt(sum((a_i - b_i)^2)) | [0, inf) | Spatial data, clustering - sensitive to scale, may need normalization |\n\nCosine similarity is the most common in NLP because it ignores magnitude - a 3-word sentence and a 300-word paragraph can still be \"close\" if they express the same idea. Try the interactive simulator below to compare two sentences.",
      code: `import numpy as np

def cosine_similarity(a, b):
    """Measure similarity between two vectors.
    Returns 1.0 for identical directions, 0.0 for orthogonal."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

car_vec = np.array([0.8, 0.6, 0.1, 0.3])
automobile_vec = np.array([0.79, 0.62, 0.12, 0.28])
pizza_vec = np.array([0.1, 0.2, 0.9, 0.7])

print(f"car vs automobile: {cosine_similarity(car_vec, automobile_vec):.3f}")  # ~0.999
print(f"car vs pizza: {cosine_similarity(car_vec, pizza_vec):.3f}")            # ~0.507`,
      playground: "cosine-similarity",
    },
    {
      heading: "Approximate Nearest Neighbor (ANN) Algorithms",
      content:
        "With millions of vectors, exact nearest-neighbor search (comparing the query against every vector) is too slow. ANN algorithms trade a tiny bit of accuracy for massive speed gains.\n\nImagine finding the closest coffee shop. Exact search means measuring the distance to every coffee shop on earth. ANN is like knowing \"I'm in downtown Manhattan\" and only checking shops in nearby neighborhoods. You might miss a shop 1 block outside your search zone, but you find a great one in 1ms instead of 1 hour.\n\n| Algorithm | How It Works | Speed | Memory | Recall@10 |\n|---|---|---|---|---|\n| **Flat (brute force)** | Compare against every vector | O(N) | 100% | 100% |\n| **HNSW** | Multi-layer graph with skip-list navigation. Top layers have long-range \"highway\" connections, bottom layers are dense local connections. Search starts at top, greedily descends | O(log N) | ~130% (graph overhead) | ~98% |\n| **IVF** | Cluster vectors with k-means, only search nearest clusters at query time. More \"probes\" = better recall but slower | O(N/k * nprobe) | 100% | ~95% |\n| **PQ** | Compress vectors by splitting into sub-vectors and quantizing each to a codebook entry. Distances approximated via lookup tables | Very fast | ~3% (32x compression) | ~85% |\n\nIn practice these are combined: FAISS uses IVF+PQ for memory-constrained billion-scale search. Pinecone, Weaviate, Qdrant, and Milvus all use HNSW as their default. Rule of thumb: under 1M vectors use HNSW; 1M-100M use HNSW with PQ rescoring; 100M-1B+ use IVF-PQ.",
    },
    {
      heading: "Hybrid Search - Combining Keyword and Semantic",
      content:
        "Neither keyword search nor vector search is perfect alone. Each has blind spots the other covers:\n\n| Scenario | BM25 (Keyword) | Vector (Semantic) | Hybrid |\n|---|---|---|---|\n| Exact ID / code lookup | Excellent | Poor | Excellent |\n| Synonym-heavy query | Poor | Excellent | Excellent |\n| Mixed: technical term + concept | Partial | Partial | Excellent |\n| Rare domain-specific jargon | Good | Varies | Excellent |\n| Conversational / vague query | Poor | Good | Good |\n\nHybrid search runs the query through two independent retrieval paths - BM25 on an inverted index and ANN on a vector index - then merges the results using **Reciprocal Rank Fusion (RRF)**.\n\nRRF is elegantly simple: for each document, compute score = sum(1 / (k + rank)) across all retrieval methods. The constant k (typically 60) smooths rankings so that rank #1 vs #2 isn't a dramatic difference. Documents ranked highly by both systems get the highest fused scores.\n\nThis dual-retrieval approach is the current industry standard, used by Elasticsearch 8+, Weaviate, Pinecone, Vespa, and virtually every production RAG pipeline.",
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
      playground: "hybrid-search-demo",
    },
    {
      heading: "Evaluation: Precision, Recall, and the F1 Trade-off",
      content:
        "How do you know if your search system is actually good? Two fundamental metrics:\n\n**Precision** = relevant results / total results returned. Of everything you showed the user, how much was actually useful?\n\n**Recall** = relevant results returned / total relevant docs in corpus. Of everything relevant that exists, how much did you find?\n\nThese two metrics are always in tension. A tiny, fine fishing net catches only target fish (high precision) but misses most of them (low recall). A massive net catches everything (high recall) but also catches a lot of junk (low precision).\n\n**F1 Score** = 2 * (Precision * Recall) / (Precision + Recall) - the harmonic mean that balances both. The harmonic mean is used instead of the arithmetic mean because it penalizes extreme imbalance: if Precision = 1.0 and Recall = 0.01, the arithmetic mean is 0.505 (sounds fine!) but the harmonic mean is 0.0198 (correctly shows the system is terrible).\n\n| System | Prioritize | Why |\n|---|---|---|\n| Legal discovery | Recall | Missing a relevant document can lose a case |\n| E-commerce search | Precision | Top results must be relevant - users won't scroll past page 1 |\n| RAG retrieval | Balance | Need enough relevant chunks (recall) but too much noise confuses the LLM |\n| Medical diagnosis | Recall | Missing a disease is worse than a false alarm |",
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
      playground: "precision-recall-slider",
    },
    {
      heading: "NDCG - The Gold Standard Ranking Metric",
      content:
        "Precision and recall treat search as a set problem - a doc is either retrieved or not. But **ranking order matters**. NDCG (Normalized Discounted Cumulative Gain) handles graded relevance (not just relevant/irrelevant) and penalizes relevant documents that appear lower in the ranking.\n\nThe formula works in steps:\n1. **DCG@K** = sum of (2^rel_i - 1) / log2(i + 1) for each result. The numerator exponentially rewards higher relevance grades. The log denominator discounts results at lower positions.\n2. **IDCG@K** = the ideal (best possible) DCG - sort all results by relevance descending.\n3. **NDCG@K** = DCG@K / IDCG@K, normalized to [0, 1]. A score of 1.0 means perfect ranking.\n\nExample: Results with graded relevance [3, 2, 0, 1] -> DCG = 7/1 + 3/1.585 + 0/2 + 1/2.322 = 9.324.\n\n| Metric | Graded Relevance? | Position-Aware? | Best For |\n|---|---|---|---|\n| Precision@K | No (binary) | Only via cutoff | Quick sanity check |\n| Recall@K | No (binary) | Only via cutoff | Retrieval stage evaluation |\n| MRR | No (binary) | Yes (first hit only) | Navigational / QA queries |\n| MAP | No (binary) | Yes (all hits) | General search evaluation |\n| NDCG | Yes (graded) | Yes (all positions) | Web search, recommendations - gold standard |\n\nNDCG@10 is the most commonly reported metric in search. Use the interactive calculator below to build intuition for how relevance grades and position affect the score.",
      playground: "ndcg-calculator",
    },
    {
      heading: "Key Takeaway",
      content:
        "Search is fundamentally about trading storage and preprocessing time for query-time speed. Every technique in this series - from inverted indexes to vector embeddings - is a variation of this core idea: build smart data structures offline so you can answer queries in milliseconds.\n\nThe modern search stack (2024+) combines: BM25 retrieval + Vector retrieval -> RRF fusion -> Cross-encoder rerank -> Top-k results. This multi-stage pipeline is used by virtually every production search and RAG system. Each stage narrows the candidate set while increasing the quality of ranking.",
    },
  ],

  "search-fundamentals/bm25-from-scratch": [
    {
      heading: "Why BM25 Matters",
      content:
        "BM25 (Best Matching 25) is the default ranking algorithm in Elasticsearch, Solr, Lucene, and virtually every production search engine. Despite being published in 1994, it remains remarkably hard to beat for keyword search. Understanding BM25 deeply is non-negotiable for anyone working in search.\n\nYou have a collection of documents and a user types a query. How do you rank which documents are most relevant? You can't just count word matches - that approach has four fatal problems:\n\n- **Longer docs win unfairly.** A 10,000-word document mentions \"python\" 50 times. A 200-word doc mentions it 10 times. Raw count says the big doc is better, but the small one is 10x more focused on Python.\n- **Common words dominate.** The word \"the\" appears in every document. Matching on \"the\" tells you nothing. But matching on \"eigenvalue\"? That's very informative.\n- **Diminishing returns.** If a doc mentions \"cat\" 100 times vs 50 times, is it really 2x more relevant? Probably not. After a point, more mentions don't add much.\n- **No principled scoring.** Raw counts give you absolute numbers with no meaningful scale.\n\nBM25 solves all four problems. Let's build up to it step by step.",
    },
    {
      heading: "Part 1: Term Frequency (TF)",
      content:
        'The first building block: how often does the query term appear in a document? A document mentioning "python" 10 times is probably more relevant than one mentioning it once.\n\nBut raw TF has a problem - a document mentioning "python" 100 times isn\'t 100x more relevant than one mentioning it once. BM25 uses a saturation function to handle this.\n\nCommon TF variants:\n\n- **Raw** - just count occurrences: `f(t,d)`\n- **Log-scaled** - compress high frequencies: `1 + log f(t,d)`\n- **Boolean** - only care about presence: `1 if f > 0 else 0`\n- **BM25-style** - saturating: `f(t,d) / (k₁ + f(t,d))` - approaches but never reaches 1\n\nThe BM25-style TF creates a **saturation curve** where the first few occurrences matter a lot, but additional ones give rapidly diminishing gains.',
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
        'Not all terms are equally useful for finding relevant documents. The word "the" appears in almost every document, so it shouldn\'t contribute much to relevance. IDF measures how rare a term is across the entire corpus - rare terms get higher weights.\n\nThink of it like diamonds vs sand. Diamonds are valuable because they\'re rare. The word "the" is like sand - everywhere, worthless for search. The word "eigendecomposition" is like a diamond - rare, and finding it in a document tells you a LOT about what that document is about.\n\nBM25 uses the Robertson-Sparck Jones IDF formula: `IDF(t) = ln((N - df(t) + 0.5) / (df(t) + 0.5) + 1)` where N is total documents and df(t) is documents containing term t. This prevents negative IDF values and handles edge cases.\n\n**IDF intuition with numbers** (corpus of 10,000 docs):\n- "the" appears in 9,950 docs → IDF ≈ 0.005 (worthless)\n- "python" appears in 500 docs → IDF ≈ 3.0 (moderately informative)\n- "asyncio" appears in 25 docs → IDF ≈ 6.0 (very informative)\n- "eigendecomposition" appears in 3 docs → IDF ≈ 8.1 (extremely targeted)',
      code: `def idf(term, corpus):
    """IDF = log((N - df + 0.5) / (df + 0.5) + 1)
    where N = total docs, df = docs containing the term."""
    N = len(corpus)
    df = sum(1 for doc in corpus if term.lower() in doc.lower())
    return math.log((N - df + 0.5) / (df + 0.5) + 1)`,
    },
    {
      heading: "TF-IDF: The Stepping Stone",
      content:
        "Before BM25, there was TF-IDF - simply multiply TF by IDF. High score means the term is frequent in this document AND rare across all documents. TF-IDF was a huge leap forward, but it still has weaknesses:\n\n- **No saturation** - TF grows linearly. 100 mentions vs 50 still matters too much.\n- **No length normalization** - longer documents naturally have higher TF, and TF-IDF doesn't correct for this.\n\nBM25 fixes both. It's essentially a **better-tuned, probabilistically-motivated version of TF-IDF**.",
    },
    {
      heading: "The Full BM25 Formula",
      content:
        "Here it is - the formula that powers Elasticsearch, Lucene, and most search engines on earth:\n\n**BM25(q, d) = Σ IDF(t) × f(t,d) × (k₁ + 1) / (f(t,d) + k₁ × (1 - b + b × |d| / avgdl))**\n\nBreaking it down:\n\n- **f(t, d)** - Raw term frequency in the document\n- **IDF(t)** - Inverse document frequency (rarity)\n- **k₁** - TF saturation parameter (typically 1.2–2.0)\n- **b** - Length normalization parameter (0–1, typically 0.75)\n- **|d|** - Length of the document\n- **avgdl** - Average document length across the corpus\n\nThe three layers: IDF asks \"how rare is this term?\", saturating TF asks \"how frequent, with diminishing returns?\", and length normalization adjusts for document length.",
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
      heading: "The Parameters: k₁ and b",
      content:
        "**k₁ - Saturation Control:**\n- k₁ = 0 → Binary model (only presence/absence matters)\n- k₁ = 1.2 → Default (moderate saturation, most common)\n- k₁ = 2.0 → Slower saturation (extra occurrences still help)\n- k₁ → ∞ → No saturation (linear TF, like raw counting)\n\n**b - Length Normalization:**\n- b = 0 → No length normalization (ignore doc length)\n- b = 0.75 → Default (moderate penalty for long docs)\n- b = 1.0 → Full normalization (strongly penalize long docs)\n\n**When to tune:** Increase k₁ for verbose collections (news articles, books) where repetition indicates topicality. Decrease for short documents (tweets, titles). Decrease b for collections with uniform document lengths. Increase when long docs tend to be unfocused.",
    },
    {
      heading: "Saturation: The Key Insight",
      content:
        "The saturation curve is what makes BM25 smarter than TF-IDF. The first few occurrences of a term contribute a lot to the score, but additional occurrences have rapidly diminishing returns. Drag the k₁ slider to see how it changes the curve shape.",
      playground: "bm25-tf-saturation",
    },
    {
      heading: "Live BM25 Playground",
      content:
        "Type a query and documents below. BM25 will rank them in real-time. Adjust k₁ and b to see how they affect the ranking. Watch how the scores change as you modify parameters - this builds intuition for tuning.",
      playground: "bm25-calculator",
    },
    {
      heading: "BM25 Variants",
      content:
        "Researchers have proposed improvements to the original BM25 (a.k.a. BM25 Okapi):\n\n- **BM25+** (2011) - Adds a small constant δ (typically 1) to the TF component. Solves the problem where BM25 can give a score of 0 to a document that contains the query term but is very long.\n- **BM25L** (2011) - Modifies the length normalization to be less aggressive for long documents.\n- **BM25F** (Field-aware) - Extends BM25 to handle structured documents with multiple fields (title, body, anchor text). Each field gets its own boost weight and length normalization. This is what Elasticsearch/Lucene uses for multi-field queries.\n\n| Variant | Key Change | Best For |\n|---|---|---|\n| BM25 (Okapi) | Original | General purpose - great default |\n| BM25+ | Floor on TF component | Corpora with high length variance |\n| BM25L | Softer length penalty | Long documents that are genuinely relevant |\n| BM25F | Per-field weights | Structured docs (web pages, products) |",
    },
    {
      heading: "BM25 vs Semantic Search",
      content:
        "In the age of embeddings and LLMs, is BM25 still relevant? **Absolutely.**\n\n| Aspect | BM25 | Semantic Search |\n|---|---|---|\n| Matching type | Exact keyword | Meaning-based similarity |\n| Handles synonyms | No | Yes |\n| Exact term matching | Excellent | Can miss exact matches |\n| Speed | Extremely fast | Slower (ANN search) |\n| Index size | Small | Large (dense vectors) |\n| ML needed | No | Yes |\n| Interpretable | Yes | No |\n\nModern search systems use **hybrid retrieval**: BM25 + semantic search combined via Reciprocal Rank Fusion. This is the approach used by Elasticsearch with vector search, Pinecone hybrid, Weaviate, and RAG pipelines. BM25 catches exact matches that embeddings miss, while semantic search catches conceptual matches that BM25 misses.",
    },
    {
      heading: "Key Takeaway",
      content:
        "BM25 = IDF × saturated TF with length normalization. The two key parameters are k₁ (controls TF saturation - higher means raw count matters more) and b (controls length normalization - higher penalizes long documents more). Most engines default to k₁=1.2, b=0.75. BM25 isn't outdated - it's *complementary*. Even the most advanced RAG systems use BM25 as a critical component.",
    },
  ],

  "search-fundamentals/tf-idf-vs-bm25": [
    {
      heading: "The Contenders",
      content:
        "Two algorithms dominate keyword-based search. TF-IDF, born in the 1970s, is the elegant foundation: how often a term appears in a doc times how rare it is across all docs. BM25, developed in the 1990s by Robertson & Sparck Jones, is the probabilistically motivated upgrade that fixes TF-IDF's biggest weaknesses.\n\nThink of it this way: TF-IDF is like counting how many times a student mentions a topic in their essay. BM25 is like a smarter grader who knows that mentioning \"machine learning\" 50 times doesn't make an essay twice as good as one that mentions it 25 times - and who also adjusts for essay length.\n\n| Property | TF-IDF | BM25 |\n|---|---|---|\n| Term frequency | Linear (unbounded) | Saturating (approaches a maximum) |\n| Length normalization | None | Built-in via parameter b |\n| Tunable parameters | None | k1 (saturation speed) and b (length penalty) |\n| Era | 1970s | 1990s |\n| Used by | Feature extraction, ML pipelines | Elasticsearch, Lucene, Solr |",
    },
    {
      heading: "TF-IDF Formula",
      content:
        "TF-IDF multiplies two components: how frequent a term is locally, and how rare it is globally.\n\n**TF-IDF(t, d) = f(t,d) x ln(N / df(t))**\n\nWhere f(t,d) is the count of term t in document d, N is total documents, and df(t) is documents containing t.\n\nThe **Term Frequency (TF)** component counts raw occurrences. More mentions = higher score. It grows linearly - this is the weakness BM25 fixes.\n\nThe **Inverse Document Frequency (IDF)** component measures rarity. \"the\" appears everywhere (low IDF). \"eigenvalue\" appears rarely (high IDF). Rare terms are more discriminative.\n\nSome implementations use log-TF: 1 + ln(f(t,d)) to slightly dampen growth, but it still doesn't saturate like BM25.",
    },
    {
      heading: "BM25 Formula",
      content:
        "BM25 adds two critical improvements: TF saturation and length normalization.\n\n**BM25(q, d) = sum over t in q: IDF(t) x f(t,d) x (k1 + 1) / (f(t,d) + k1 x (1 - b + b x |d| / avgdl))**\n\n**Saturation**: The TF component f*(k1+1)/(f+k1) approaches a maximum as frequency increases. The 10th mention of \"python\" adds far less than the 1st. This prevents keyword stuffing from gaming rankings.\n\n**Length Normalization**: The denominator includes |d|/avgdl, which penalizes documents longer than average. A 10,000-word doc mentioning \"python\" 50 times gets a lower score than a focused 200-word doc mentioning it 10 times.",
    },
    {
      heading: "Keyword Stuffing: Where BM25 Shines",
      content:
        "What happens when a term is repeated more and more? TF-IDF grows linearly forever - a document repeating \"python\" 100 times scores twice as high as one repeating it 50 times. BM25 saturates: after a certain point, additional repetitions yield almost no score gain.\n\nThis is why BM25 is resistant to keyword stuffing. In the playground, watch the TF-IDF line keep climbing while BM25 flattens out. The k1 parameter controls how quickly saturation happens: lower k1 means faster saturation (the first few mentions dominate), higher k1 means repetition still helps somewhat.",
    },
    {
      heading: "Long Document Bias",
      content:
        "Longer documents naturally contain more term occurrences. TF-IDF rewards them unfairly - a 10,000-word document mentioning \"machine learning\" 8 times beats a 200-word focused tutorial mentioning it 5 times, even though the short doc is clearly more relevant.\n\nBM25's b parameter controls length normalization strength: b=0 means no normalization (ignore document length), b=0.75 (default) gives moderate length penalty, and b=1.0 applies full normalization that strongly penalizes long documents. Try setting b=0 in the playground to see BM25 behave more like TF-IDF.",
    },
    {
      heading: "Side-by-Side Comparison",
      content:
        "Run both algorithms on the same query and corpus to see how rankings differ. BM25's saturation and length normalization consistently produce better rankings for real-world search:\n\n| Scenario | TF-IDF | BM25 | Winner |\n|---|---|---|---|\n| General web search | Biased toward long pages | Normalizes for length | BM25 |\n| Short uniform docs (tweets, titles) | Works fine | Slight advantage | BM25 |\n| Feature extraction for ML | Standard choice | Less common | TF-IDF |\n| Spam / keyword stuffing | Easily gamed | Saturates - resistant | BM25 |\n| Mixed-length corpora | Poor - long docs dominate | Length-normalized | BM25 |\n| Simplicity / teaching | Simpler to understand | More parameters | TF-IDF |\n| Production search engines | Outdated for ranking | Industry standard | BM25 |",
      playground: "tfidf-vs-bm25-compare",
    },
    {
      heading: "Key Takeaway",
      content:
        "BM25 = TF-IDF + Saturation + Length Normalization. It isn't a completely different algorithm - it's a principled refinement. The two key improvements are: (1) term frequency saturation preventing keyword stuffing, and (2) document length normalization for fair comparison between short focused docs and long unfocused ones.\n\nUse TF-IDF for feature engineering in ML pipelines and for educational purposes. Use BM25 for any production search or ranking system. Every modern search engine defaults to BM25 - and understanding the *why* behind each component makes you a better search engineer.\n\nTF-IDF (1970s) -> BM25 (1990s) -> Hybrid Search (2020s). The evolution continues, but BM25 remains a critical building block.",
    },
  ],

  "search-fundamentals/vector-search": [
    {
      heading: "The Limits of Keywords",
      content:
        "BM25 is powerful, but it has a fundamental limitation: it only matches exact terms. Search for \"automobile\" and you won't find documents about \"cars.\" Search for \"how to fix a broken heart\" and you'll get results about cardiac surgery, not relationship advice.\n\nKeyword search is like looking up a word in a dictionary - you need the exact word. Semantic search is like asking a knowledgeable friend - they understand what you *mean* even if you use different words. Vector search solves this by representing documents and queries as points in a high-dimensional space where semantic similarity maps to geometric proximity.",
    },
    {
      heading: "What Are Embeddings?",
      content:
        "An embedding is a dense vector (a list of floating-point numbers) that represents the *meaning* of text in a high-dimensional space. Texts with similar meanings get vectors that are close together. The key idea: \"King\" - \"Man\" + \"Woman\" approximates \"Queen.\" Embeddings capture semantic relationships as geometric relationships in vector space.\n\nThe process: text goes through a tokenizer, then a transformer encoder (12+ layers), then mean pooling over token embeddings produces a single vector (e.g., 384 dimensions).\n\n| Model | Year | Dimensions | Key Innovation |\n|---|---|---|---|\n| Word2Vec | 2013 | 100-300 | Word-level embeddings via skip-gram/CBOW. Showed arithmetic on word vectors works |\n| GloVe | 2014 | 50-300 | Global co-occurrence statistics. Better at capturing global patterns |\n| ELMo | 2018 | 1024 | Context-dependent word embeddings. \"Bank\" gets different vectors in \"river bank\" vs \"bank account\" |\n| BERT | 2018 | 768 | Bidirectional transformers. Deep contextual embeddings |\n| Sentence-BERT | 2019 | 384-768 | Fine-tuned for sentence-level similarity using siamese networks |\n| OpenAI text-embedding-3 | 2024 | 256-3072 | Matryoshka embeddings - truncate to any dimension |\n\nReal embeddings live in 384-3072 dimensions. When projected to 2D for visualization, information is lost - many concepts that appear overlapping in 2D are actually well-separated in the full space.",
    },
    {
      heading: "Distance Metrics: Cosine, Dot Product, Euclidean",
      content:
        "Given two vectors, there are three main ways to measure their similarity:\n\n**Cosine Similarity** = dot(a,b) / (norm(a) * norm(b)). Measures the angle between vectors. Range [-1, 1]. Most common in NLP because it ignores magnitude - a 3-word sentence and a 300-word paragraph can still be \"close\" if they express the same idea.\n\n**Dot Product** = sum(a_i * b_i). Measures both direction and magnitude. Preferred when vector norms carry meaning (e.g., popularity). When vectors are normalized, equivalent to cosine but faster to compute.\n\n**Euclidean Distance** = sqrt(sum((a_i - b_i)^2)). Straight-line distance in space. Lower = more similar. Sensitive to magnitude, so may need normalization first.\n\n| Metric | Best For | Note |\n|---|---|---|\n| Cosine | Text similarity, NLP | Ignores magnitude - only cares about direction |\n| Dot Product | Recommendations, MIPS | Faster to compute; equivalent to cosine when normalized |\n| Euclidean | Spatial data, clustering | Sensitive to scale - may need normalization first |\n\nTry the interactive simulator to compare two sentences and see cosine similarity in action.",
      code: `import numpy as np

def cosine_similarity(a, b):
    """Measure similarity between two vectors.
    Returns 1.0 for identical directions, 0.0 for orthogonal."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

car_vec = np.array([0.8, 0.6, 0.1, 0.3])
automobile_vec = np.array([0.79, 0.62, 0.12, 0.28])
pizza_vec = np.array([0.1, 0.2, 0.9, 0.7])

print(f"car vs automobile: {cosine_similarity(car_vec, automobile_vec):.3f}")  # ~0.999
print(f"car vs pizza: {cosine_similarity(car_vec, pizza_vec):.3f}")            # ~0.507`,
      playground: "cosine-similarity",
    },
    {
      heading: "ANN Algorithms: Making Vector Search Fast",
      content:
        "With millions of vectors, exact nearest-neighbor search is O(N) - too slow. Approximate Nearest Neighbor (ANN) algorithms trade a tiny bit of accuracy for massive speed gains.\n\n**HNSW (Hierarchical Navigable Small World)**: Builds a multi-layer graph where the top layers have few, long-range \"highway\" connections and the bottom layer has dense, short-range connections. Search starts at the top and greedily descends - like airport routing: intercontinental flights (top layer) get you close, regional flights (middle), then a taxi (bottom) takes you to the exact address. O(log N) search time, very high recall (~98%), but high memory usage.\n\n**IVF (Inverted File Index)**: Partitions the vector space into clusters using k-means. At query time, find the nearest cluster centroids and only search vectors in those clusters. Like a library with labeled sections - instead of scanning every book, go to the 1-2 relevant sections. With nlist=1000 and nprobe=10, you skip 99% of vectors.\n\n**PQ (Product Quantization)**: Compresses vectors by splitting them into sub-vectors and quantizing each to a codebook entry. A 768-dim vector (3072 bytes) compresses to just 8 bytes - a 384x reduction. A billion vectors goes from 3 TB to ~8 GB.\n\n| Algorithm | Speed | Memory | Recall@10 | Best For |\n|---|---|---|---|---|\n| HNSW | ~1ms @ 10M | High (full vectors + graph) | ~98% | Best recall, moderate scale |\n| IVF | ~2ms @ 100M | Medium | ~95% | Large scale, tunable speed/recall |\n| PQ | ~5ms @ 1B | Very low (compressed) | ~85% | Billion-scale, memory constrained |\n| IVF-PQ | ~3ms @ 1B | Very low | ~95% | Production billion-scale (FAISS) |\n| HNSW + PQ Rescore | ~2ms @ 100M | Medium-low | ~98% | Best quality at scale (Vespa, Qdrant) |\n\nRule of thumb: Under 1M vectors? Brute force or HNSW. 1M-100M? HNSW with PQ rescoring. 100M-1B+? IVF-PQ with proper nprobe tuning.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Vector search captures meaning, not just keywords. The pipeline is: text -> embedding model -> dense vector -> ANN index -> nearest neighbors. But it comes with trade-offs: embedding models are slower and more expensive than BM25, vectors require more storage, and they can sometimes miss exact keyword matches. That's why modern search engines use both keyword and vector search together - which brings us to hybrid search.",
    },
  ],

  "search-fundamentals/hybrid-search": [
    {
      heading: "Why Hybrid?",
      content:
        "Neither keyword search nor semantic search is perfect alone. Each has blind spots the other covers.\n\nKeyword search is like a librarian who only finds books by matching exact words in the title. Semantic search is like a librarian who understands what you *mean* but sometimes grabs a book about a related topic instead of the exact one you need. The best library uses both.\n\n| Query | BM25 (Keyword) | Vector (Semantic) |\n|---|---|---|\n| \"React useEffect cleanup\" | Exact match - nails it | May drift to hooks in general |\n| \"how to make code faster\" | Misses \"performance optimization\" | Understands intent |\n| \"error code 0x80070005\" | Exact match | Codes lost in embedding space |\n| \"alternatives to kubernetes\" | Needs \"kubernetes\" in doc | Finds Docker Swarm, Nomad |\n\nBM25 excels at exact keyword matching - search for \"error code 404\" and it nails it. Vector search excels at semantic understanding - search for \"page not found\" and it finds the same content. Hybrid search combines both to cover all cases.",
    },
    {
      heading: "The Score Fusion Challenge",
      content:
        "You can't simply add BM25 and vector scores - they live on completely different scales. BM25 scores range from 0 to ~25+, are unbounded, and depend on corpus size and term rarity. Vector cosine similarity ranges from -1 to 1, is bounded, and depends on embedding model quality.\n\nA BM25 score of 12.4 and a cosine similarity of 0.91 are not comparable. Two principled approaches have emerged to solve this:\n\n1. **Reciprocal Rank Fusion (RRF)** - uses only ranks, not scores. Score-agnostic and robust.\n2. **Linear Combination** - normalize scores to [0,1] and blend with a weight alpha. More control but requires tuning.",
    },
    {
      heading: "Reciprocal Rank Fusion (RRF)",
      content:
        "RRF elegantly sidesteps the score calibration problem by using only **ranks**, not scores.\n\n**RRF(d) = sum over rankers: 1 / (k + rank_r(d))**\n\nWhere k is a smoothing constant (default 60) and rank_r(d) is the position of document d in ranker r.\n\nWhy RRF works:\n- **Score-agnostic**: Only uses position, not raw scores. BM25 of 12.4 and cosine of 0.91 aren't compared - only their ranks.\n- **Robust to outliers**: The k constant prevents top-ranked documents from dominating. With k=60, rank 1 gets 1/61 vs rank 2's 1/62 - a tiny difference.\n- **Rewards consensus**: Documents ranked highly by *both* rankers get the highest fused scores.\n\nStep-by-step: get top-100 from BM25, get top-100 from vector search, for each unique doc compute score = 1/(k + rank_bm25) + 1/(k + rank_vector), sort by combined score. A doc ranked #1 in both gets: 1/(60+1) + 1/(60+1) = 0.0328. A doc ranked #1 in BM25 but #50 in vector gets: 1/(60+1) + 1/(60+50) = 0.0255.\n\nThe k=60 value was found empirically in the original paper (Cormack et al., 2009) to work well - it smooths out the difference between high ranks.",
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
      playground: "hybrid-search-demo",
    },
    {
      heading: "Weighted Linear Combination",
      content:
        "An alternative to RRF is a weighted linear combination of normalized scores:\n\n**Score(d) = alpha x normalized_BM25(d) + (1 - alpha) x normalized_vector(d)**\n\nWhere alpha controls the balance: alpha=0 means all vector, alpha=1 means all BM25. This approach uses actual score values and is tunable per-domain, but requires score normalization (typically min-max to [0,1]) and careful tuning of alpha.\n\n| Approach | Pros | Cons |\n|---|---|---|\n| RRF | No score normalization needed, no tuning, robust | Ignores score magnitude - rank #1 with score 0.99 and rank #1 with score 0.51 treated the same |\n| Weighted | Uses actual score values, tunable per-domain | Requires score normalization, needs tuning of alpha |\n\nDifferent query types benefit from different weights: exact match queries (\"error code 0x80070005\") favor BM25-heavy (alpha ~0.7), semantic queries (\"how to make website faster\") favor vector-heavy (alpha ~0.3), and ambiguous queries work best with balanced fusion or RRF.",
    },
    {
      heading: "Production Architecture",
      content:
        "A real hybrid search pipeline involves indexing, retrieval, fusion, and optional re-ranking:\n\n**Indexing**: Raw documents -> Tokenizer (inverted index) + Embedding Model (vector index/HNSW)\n\n**Query-time**: User Query -> BM25 retrieval (top-100 by keyword) in parallel with ANN retrieval (top-100 by embedding) -> Score Fusion (RRF) -> Cross-encoder re-ranker (optional, high-quality rescoring) -> Final results\n\nSystems that support this natively: Elasticsearch 8+ (kNN + BM25), Weaviate (hybrid search), Pinecone (sparse + dense vectors), Qdrant (hybrid queries), and Vespa (multi-phase ranking). Most RAG pipelines use hybrid search as the retrieval layer - BM25 catches exact matches (code snippets, error messages) while vectors catch semantic matches (concepts, paraphrases).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Hybrid search consistently outperforms either method alone. Research and production experience both confirm this. The fusion method matters less than the decision to combine.\n\n1. **RRF** is the go-to choice - no hyperparameters to tune (k=60 works great), score-agnostic, robust\n2. **Linear combination** gives more control but requires tuning alpha per use case\n3. **Cross-encoder re-ranking** on top of hybrid retrieval gives the best quality when latency allows\n\nThe modern stack: BM25 Retrieval + Vector Retrieval -> RRF Fusion -> Re-Rank (optional). This pipeline is the industry standard.",
    },
  ],

  "search-fundamentals/evaluation-metrics": [
    {
      heading: "Why Metrics Matter",
      content:
        "You can't improve what you can't measure. Search quality is subjective, but metrics make it objective. Imagine tuning a search engine by feel - \"the results look okay.\" That's like optimizing a car engine by listening to it purr. Metrics are the dashboard gauges: they tell you exactly what's working and what's not.\n\nMetrics serve three purposes: **compare algorithms** (is BM25 better than TF-IDF for your corpus?), **track regressions** (did your latest ranking pipeline change make things worse?), and **guide optimization** (low precision? add better filtering. Low recall? expand query terms).\n\n| Question | Metric |\n|---|---|\n| Are the returned results actually relevant? | **Precision** |\n| Did we find all the relevant results? | **Recall** |\n| How quickly does the user find what they need? | **MRR** |\n| Are the best results ranked at the top? | **NDCG** |\n| Balance between precision and recall? | **F1 Score** |",
    },
    {
      heading: "Precision and Recall",
      content:
        "**Precision@K** = relevant documents in top-K / K. Of everything you returned, how much was actually relevant? High precision means few irrelevant results shown to the user. Precision = 1.0 means every result was relevant. Precision = 0.2 means only 1 in 5 was relevant - terrible experience.\n\n**Recall@K** = relevant documents in top-K / total relevant in corpus. Of all the relevant documents that exist, how many did you actually find? Recall = 1.0 means you found everything. Recall = 0.1 means the user is missing 90% of what they need.\n\nA search engine is like a fishing net. Precision asks: \"Of all the fish I caught, what fraction are the type I wanted?\" Recall asks: \"Of all the target fish in the lake, what fraction did my net catch?\" A tiny, fine net catches only target fish (high precision) but misses most (low recall). A massive net catches everything (high recall) but also junk (low precision).\n\n**F1 Score** = 2 * (Precision * Recall) / (Precision + Recall). The harmonic mean - it penalizes extreme imbalance. If Precision = 1.0 and Recall = 0.01, the arithmetic mean = 0.505 (sounds fine!) but the harmonic mean = 0.0198 (correctly shows the system is terrible).\n\n| System | Prioritize | Why |\n|---|---|---|\n| Legal discovery | Recall | Missing a relevant document can lose a case |\n| E-commerce search | Precision | Top results must be relevant - users won't scroll past page 1 |\n| RAG retrieval | Balance | Need enough relevant chunks (recall) but too much noise confuses the LLM |\n| Medical diagnosis | Recall | Missing a disease is worse than a false alarm |\n\nUse the interactive demo below to toggle document retrieval and watch precision, recall, and F1 update live.",
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
      playground: "precision-recall-slider",
    },
    {
      heading: "MRR - Mean Reciprocal Rank",
      content:
        "How quickly does the user find the **first** relevant result? MRR measures this by averaging 1/rank of the first relevant result across all queries.\n\n**MRR = (1/|Q|) * sum(1 / rank_i)**\n\nMRR captures the \"I'm feeling lucky\" quality of your search engine. If the first result is always relevant (rank 1), MRR = 1.0. If users typically scroll to the 5th result, MRR = 0.2.\n\n| First relevant at rank | Reciprocal Rank | User Experience |\n|---|---|---|\n| 1 | 1.000 | Perfect - first result is what they need |\n| 2 | 0.500 | Good - second result works |\n| 3 | 0.333 | Okay - user scans a bit |\n| 5 | 0.200 | Mediocre - user digs through results |\n| 10 | 0.100 | Poor - user might give up |\n\nMRR is ideal for navigational queries (\"take me to X\") and Q&A systems where users just need the one right answer.",
    },
    {
      heading: "MAP - Mean Average Precision",
      content:
        "MAP extends precision to consider the full ranking, not just a single cutoff. For each query: at every rank position where a relevant doc appears, compute precision at that cutoff. Average those precision values. Then average across all queries.\n\n**AP(q) = (1/|Rel|) * sum(P(k) * rel(k))**\n\nExample: Results are [R, N, R, N, R] (R=relevant, N=not). P@1 = 1/1 = 1.0, P@3 = 2/3 = 0.67, P@5 = 3/5 = 0.60. AP = (1.0 + 0.67 + 0.60) / 3 = 0.756.\n\nMAP rewards systems that rank relevant docs higher. It's widely used in information retrieval benchmarks like TREC.",
    },
    {
      heading: "NDCG - The Gold Standard",
      content:
        "Precision and recall treat relevance as binary - relevant or not. But a \"highly relevant\" doc at position 3 is worse than a \"perfectly relevant\" doc at position 1. NDCG (Normalized Discounted Cumulative Gain) handles **graded relevance** (e.g., 0 = irrelevant, 1 = marginally relevant, 2 = relevant, 3 = highly relevant).\n\nThe formula works in steps:\n\n1. **DCG@K** = sum of (2^rel_i - 1) / log2(i + 1). The numerator exponentially rewards higher relevance grades (a grade-3 doc contributes 7, while grade-1 contributes only 1). The log denominator discounts results at lower positions.\n2. **IDCG@K** = the ideal DCG - sort all results by relevance descending. This is the best possible score.\n3. **NDCG@K** = DCG@K / IDCG@K, normalized to [0, 1]. A score of 1.0 means perfect ranking.\n\nWorked example: Results with graded relevance [3, 2, 0, 1].\n- DCG = (2^3-1)/log2(2) + (2^2-1)/log2(3) + (2^0-1)/log2(4) + (2^1-1)/log2(5)\n- DCG = 7/1 + 3/1.585 + 0/2 + 1/2.322 = 7 + 1.893 + 0 + 0.431 = 9.324\n\nNDCG@10 is the most commonly reported metric in search. Most search competitions (TREC, Kaggle) use it as the primary metric. Use the calculator below to assign relevance grades and watch DCG, IDCG, and NDCG compute step by step.",
      playground: "ndcg-calculator",
    },
    {
      heading: "Metric Comparison",
      content:
        "Each metric captures a different aspect of search quality:\n\n| Metric | Measures | Relevance Type | Position-Aware? | Best For |\n|---|---|---|---|---|\n| Precision@K | How clean the results are | Binary | No | Web search, user-facing results |\n| Recall@K | How complete the results are | Binary | No | Legal discovery, medical search |\n| F1 | Balance of P and R | Binary | No | Single summary metric |\n| MRR | Speed to first relevant result | Binary | Yes (first only) | Q&A, navigational search |\n| MAP | Average precision across recall levels | Binary | Yes (all hits) | IR benchmarks |\n| NDCG@K | Ranking quality with graded relevance | Graded (0-3+) | Yes (all positions) | General ranking evaluation - gold standard |\n\nFor most search systems, use NDCG. For a quick sanity check, Precision@5 tells stakeholders \"of the first 5 results, how many are good?\" They understand it immediately.",
    },
    {
      heading: "Key Takeaway",
      content:
        "There is no single \"best\" metric - each captures a different aspect of search quality. Match the metric to the task: Precision when showing garbage is unacceptable (e-commerce, ads). Recall when missing a relevant result is costly (legal, medical, security). MRR when users just need the one right answer (Q&A, autocomplete). NDCG when ranking order matters and relevance isn't binary (web search, recommendations).\n\nIn practice, track **multiple metrics** simultaneously. A change that improves NDCG but tanks Precision@1 probably isn't worth it. The workflow: define relevance -> choose metrics -> measure baseline -> iterate and improve.",
    },
  ],

  // ─── Series 2: Indexing ──────────────────────────────────────────
  "indexing/inverted-index": [
    {
      heading: "What is Indexing?",
      content:
        "Imagine you have 10 million documents and a user types a query. You *could* open every single document, read every single word, and check for matches. But that's insane. **Indexing** is the process of building data structures *ahead of time* so that queries can be answered in milliseconds instead of hours.\n\nThink of the index at the back of a textbook. When you want to learn about \"binary search,\" you don't read the entire 800-page book. You flip to the index, find \"binary search -> page 247,\" and go directly there. A search index does the same thing for every word across millions of documents.\n\nWithout an index, the time complexity is O(N x M) where N is the number of documents and M is the average tokens per document. With 10 million documents averaging 1,000 tokens each, every query scans **10 billion tokens**. With an index, you look up 2-3 query terms in a hash map and intersect posting lists - **microseconds**, not seconds.",
    },
    {
      heading: "Types of Indexes in Search",
      content:
        "| Index Type | What It Stores | Used For |\n|---|---|---|\n| **Inverted Index** | Term -> list of documents | Full-text keyword search (BM25) |\n| **Vector Index** | Document -> dense embedding | Semantic / similarity search (ANN) |\n| **Columnar Index** | Field -> sorted values | Filtering, faceting, sorting |\n| **Geospatial Index** | Coordinates -> regions | Location-based queries |\n| **B-Tree / LSM** | Key -> value | Exact key lookups, range queries |",
    },
    {
      heading: "Forward Index vs Inverted Index",
      content:
        "A **forward index** maps *documents to terms*. An **inverted index** flips this - it maps *terms to documents*. The inverted index is the single most important data structure in information retrieval.\n\nTo find \"cat\" in a forward index, you must scan ALL documents - slow! In an inverted index, you look up \"cat\" and immediately get back [Doc 1, Doc 2, Doc 3] - instant!\n\nThe inverted index is built in steps: (1) **Tokenize** - split raw text into individual tokens, (2) **Normalize** - lowercase, stem/lemmatize, remove stop words so \"Running\" and \"run\" map to the same entry, (3) **Build posting lists** - for each unique term, record which documents it appeared in and the term frequency, (4) **Store & compress** - persist the index to disk with compression.",
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
      heading: "Positional Indexes for Phrase Queries",
      content:
        "If a user searches for \"machine learning\" (in quotes - a phrase query), we need to know not just *which* documents contain both words, but *where* they appear. A positional index stores token positions alongside each posting.\n\nTo verify the phrase \"machine learning\", we check: does any document have `machine` at position *p* and `learning` at position *p+1*? This enables exact phrase matching, proximity queries, and highlighted snippets.",
    },
    {
      heading: "Build an Inverted Index",
      content:
        "Type documents below and watch the inverted index build live. Toggle positional indexing and stop word removal to see how they affect the index structure and statistics.",
      playground: "inverted-index-builder",
    },
    {
      heading: "Key Takeaway",
      content:
        "The inverted index is the backbone of every search system - from Elasticsearch and Apache Lucene to Pinecone and modern RAG pipelines. It's what makes full-text search fast: O(1) term lookup instead of O(N) document scan. Master this data structure and every search technology becomes intuitive.",
    },
  ],

  "indexing/document-chunking": [
    {
      heading: "Why Chunk?",
      content:
        "Modern language models and embedding models have **finite context windows** - typically 512 to 8,192 tokens. A 50-page research paper doesn't fit. Even if it did, cramming everything in dilutes relevance. Chunking solves both problems.\n\nFour reasons to chunk: (1) **Token limits** - embedding models truncate beyond their max tokens, silently losing content, (2) **Relevance dilution** - if a relevant paragraph is buried in 50 pages of unrelated text, the overall document score gets diluted, (3) **Better retrieval precision** - returning a specific chunk lets the reader or LLM find the exact answer faster, (4) **Memory & speed** - processing smaller chunks is faster at query time, especially for reranking.",
    },
    {
      heading: "Chunking Strategies Compared",
      content:
        "| Strategy | How It Splits | Best For | Watch Out For |\n|---|---|---|---|\n| **Fixed-size** | Every N characters/tokens | Uniform-length docs, fast prototyping | Mid-word/mid-sentence breaks |\n| **Sentence-based** | Sentence boundaries (. ? !) | Prose, articles, documentation | Run-on sentences, abbreviations |\n| **Paragraph-based** | Double newlines | Structured writing, reports | Wildly varying paragraph sizes |\n| **Semantic** | Embedding similarity drops | Multi-topic documents | High cost, threshold tuning |\n| **Recursive** | Hierarchical separators (paragraph -> sentence -> char) | Code, markdown, structured text | More complex implementation |\n\nThe recursive approach (used by LangChain) tries a hierarchy of separators - first double newlines, then single newlines, then sentences, then characters - and only falls back to the next level when chunks exceed the maximum size.",
    },
    {
      heading: "Overlap: Preventing Information Loss",
      content:
        "When you split text at a boundary, context at the edges is lost. **Overlap** solves this by including some text from the previous chunk at the start of the next chunk. The total number of chunks with overlap is approximately ceil((N - O) / (C - O)) where C is chunk size, O is overlap, and N is total text length.\n\nOverlap duplicates text, increasing storage and embedding costs. At 20% overlap the overhead is ~25%. At 50% overlap it doubles. Recommended overlap by chunk size: 128 tokens -> 20-30 tokens (15-25%), 256 tokens -> 30-50 tokens (12-20%), 512 tokens -> 50-80 tokens (10-15%).\n\nA better approach: **sentence-aware overlap**. Instead of overlapping by a fixed character count, overlap by whole sentences. The last 1-2 sentences of chunk N become the first 1-2 sentences of chunk N+1.",
    },
    {
      heading: "Chunk Size Trade-off",
      content:
        "Chunk size creates a fundamental trade-off between retrieval precision and context preservation. Small chunks (< 100 tokens) lack context and produce poor embeddings. Large chunks (> 2000 tokens) cause relevance dilution and may exceed model limits. Most practitioners find 200-500 tokens works best. Use the slider below to explore how the two metrics move in opposite directions.",
      playground: "chunk-size-tradeoff",
    },
    {
      heading: "Content-Specific Recommendations",
      content:
        "| Content Type | Strategy | Chunk Size | Notes |\n|---|---|---|---|\n| **Technical Documentation** | Split by headings/sections, then sentence-based within | 256-512 tokens | Include heading text in every chunk for context |\n| **Legal / Regulatory Text** | Split by clause or article number | 512-1024 tokens | High overlap (20-30%) to preserve cross-references |\n| **Source Code** | Split by function/class/method | Varies | Use AST-aware chunking when possible, include imports |\n| **Chat / Conversation Logs** | Split by turn or time gap | 100-300 tokens | Keep speaker attribution with each chunk |",
    },
    {
      heading: "Key Takeaway",
      content:
        "Every downstream component - embedding, indexing, retrieval, and generation - is affected by your chunking decisions. Start with sentence-based chunking at 200-400 tokens with 10-15% overlap, measure retrieval quality on your real queries, and iterate. The best chunking strategy is the one you've tested against your data.",
    },
  ],

  "indexing/metadata-and-fields": [
    {
      heading: "Why Fields Matter",
      content:
        "A search index isn't a blob of text - it's a structured collection of **fields**, each with its own type and behavior. Just like a database table has columns with specific data types, a search index has fields that determine how data is stored, analyzed, and queried.\n\nMetadata is like the label on a jar. The text content is the stuff inside (the actual food). The label tells you the brand, price, expiration date, and ingredients - you don't need to taste the food to filter by these attributes. Similarly, metadata lets you filter, sort, and facet without full-text searching the content.",
    },
    {
      heading: "The Five Fundamental Field Types",
      content:
        "| Type | Stored As | Operations Supported | Use Cases |\n|---|---|---|---|\n| **Text (Analyzed)** | Tokenized, lowercased, stemmed terms in inverted index | Full-text search with BM25 scoring | Titles, descriptions, body content |\n| **Keyword** | Exact string, not analyzed | Exact match, filtering, sorting, faceting, aggregation | Categories, tags, IDs, status values |\n| **Numeric** | Integer or float in BKD tree | Range queries, sorting, aggregations | Price, rating, counts, scores |\n| **Boolean** | Single bit | Exact match filtering | in_stock, is_active, has_discount |\n| **Date** | Timestamp in BKD tree | Date range queries, sorting by recency | created_at, published_date, last_modified |\n\nKeyword fields are stored as-is. \"New York City\" only matches the exact string \"New York City\" - not \"new york\" or \"York\". Text fields are tokenized: \"New York City\" becomes [\"new\", \"york\", \"city\"] and matches any of those terms. Vector (dense) fields store float arrays from embedding models for semantic similarity via ANN search.",
    },
    {
      heading: "Search vs Filter: Two Different Operations",
      content:
        "**Full-text search** finds relevant documents using text analysis and scoring. The engine tokenizes the query, looks up terms in the inverted index, and scores documents by relevance (BM25). Results are ranked.\n\n**Filtering** includes or excludes documents using exact criteria - no scoring involved. The engine uses metadata indexes (keyword, numeric, boolean) for fast exact filtering.\n\nThe real power is combining both: \"wireless headphones\" with filters brand=Sony, price < $400, in_stock=true. The engine first applies the filter (cheap bitset operation), then runs BM25 only on the filtered subset - dramatically faster than scoring all documents first.",
    },
    {
      heading: "Multi-Field Mappings and Analyzers",
      content:
        "Sometimes you need the same content indexed in multiple ways. A product name should be *searchable* (text field with analysis) and also *sortable* (keyword field for exact alphabetical sorting). Multi-field mappings solve this by indexing a single source field into multiple internal representations.\n\nText fields pass through an **analysis pipeline**: Raw Text -> Character Filter -> Tokenizer -> Token Filter -> Indexed Terms. Common analyzers: `standard` (tokenize + lowercase), `language` (language-aware stemming + stop words), `edge_ngram` (prefix n-grams for autocomplete), `pattern` (split on regex).\n\n| Use Case | Primary Type | Sub-field | Purpose |\n|---|---|---|---|\n| Search + Sort | text | keyword (.raw) | Sort by exact name |\n| Search + Autocomplete | text | text (.autocomplete, edge_ngram) | Type-ahead |\n| Facet + Search | text | keyword (.facet) | Term aggregations |",
    },
    {
      heading: "Schema Design Rules and Anti-Patterns",
      content:
        "**The Five Questions** for every field: (1) Will users search it? -> `text`, (2) Will users filter it? -> `keyword`/`numeric`/`boolean`/`date`, (3) Will users sort by it? -> `keyword` or `numeric`/`date`, (4) Will users aggregate it? -> `keyword` for term aggs, `numeric` for stats, (5) Does it need to be stored at all?\n\n**Common anti-patterns:** Putting everything in one text field (lose ability to boost title over body), using text type for IDs (analyzer breaks exact match), over-indexing every field (doubles index size), ignoring null values (breaks aggregations).\n\n**Rule of thumb:** If users *type free-form queries* -> `text`. If users *select from a dropdown* -> `keyword` or `boolean`. If users *drag a range slider* -> `numeric` or `date`.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Your schema defines what operations are possible on your index. Choose field types intentionally: text for full-text search, keywords for exact filtering and facets, numerics for ranges, booleans for toggles, and dates for temporal queries. Get the schema right, and everything downstream falls into place.",
    },
  ],

  "indexing/index-operations": [
    {
      heading: "The Index Lifecycle",
      content:
        "A search index is a living data structure. Documents flow in, get updated, become outdated, and eventually need to be removed. The lifecycle: Create Schema -> Index Documents -> Search & Query -> Update / Delete -> Reindex.\n\nWhen you index a document, it doesn't become searchable immediately. Search engines use a buffer-and-flush model: new documents land in an in-memory buffer first (not yet searchable), then periodically the buffer is flushed to a new **segment** on disk (now searchable). In Elasticsearch, the default refresh interval is 1 second - this is **near-real-time (NRT) search**.",
    },
    {
      heading: "CRUD Operations",
      content:
        "**Create**: Single document inserts are simple but slow for large datasets. Bulk/batch inserts (500-5,000 documents per request) are 10-100x faster because they amortize network overhead. Tip: disable refresh during bulk loads for 2-5x throughput.\n\n**Update**: Documents in search indexes are **immutable** under the hood. An \"update\" actually deletes the old version and creates a new one. Partial updates send only changed fields (engine merges internally); full replaces overwrite everything. Use optimistic concurrency (version numbers) to prevent lost updates.\n\n**Delete**: Hard delete marks the document as deleted (space reclaimed during next segment merge). Soft delete sets a `deleted: true` field and filters it from queries - recoverable but grows index size.",
    },
    {
      heading: "Segment Merging",
      content:
        "Each refresh creates a new **segment** - an immutable mini-index. Over time, you accumulate hundreds of small segments. Searching across many segments is slow, so the engine periodically merges them into larger segments. Segments are never modified after creation - only merged into new segments. \"Deleting\" a document just marks it as deleted (a tombstone). This immutability enables lock-free concurrent reads and simple crash recovery.",
    },
    {
      heading: "Zero-Downtime Reindexing with Alias Swap",
      content:
        "When you need to change the schema (can't modify existing mappings), the solution is **index aliases**: (1) Create new index with updated schema (products_v2), (2) Reindex all docs from source of truth into v2, (3) Validate document counts and sample queries, (4) Atomic alias swap - remove alias from v1 and add to v2 in a single transaction, (5) Keep v1 for 24-48h for rollback, then delete.\n\nYour app always references the alias (\"products\"), never the versioned index name. Infrastructure change, zero code change.",
      code: `# Alias swap pattern - ATOMIC, zero downtime
POST /_aliases
{
  "actions": [
    { "remove": { "index": "products_v1", "alias": "products" } },
    { "add":    { "index": "products_v2", "alias": "products" } }
  ]
}`,
      language: "python",
    },
    {
      heading: "Schema Evolution and Versioning",
      content:
        "| Change | In-Place? | Solution |\n|---|---|---|\n| Add a new field | Yes | Dynamic mapping adds it automatically |\n| Change field type | No | Reindex with alias swap |\n| Change analyzer | No | Reindex with alias swap |\n| Delete a field | Sort of | Field stays in mapping; reindex to reclaim space |\n| Add sub-fields | Yes | Update mapping, reindex existing docs |\n\nVersioning strategies: **Alias swap** (zero downtime, 2x cost during reindex), **Blue-Green** (2x cost always, instant rollback), **Rolling/incremental** (fast but can't handle schema changes), **Delete + Rebuild** (minutes-hours of downtime).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Treat your index like a deployment. Master CRUD operations for day-to-day management, but invest early in alias-based reindexing for zero-downtime schema migrations. The alias swap pattern is the single most important operational pattern in search engineering. Always use aliases in production, never point apps at versioned index names, batch inserts for bulk operations, validate before swapping, and keep old indexes for rollback.",
    },
  ],

  // ─── Series 3: Query Processing ─────────────────────────────────
  "query-processing/query-preprocessing": [
    {
      heading: "Why Preprocess?",
      content:
        "Before a search query ever touches an index, it goes through a **preprocessing pipeline** that normalizes, expands, and cleans the raw user input. Each step dramatically affects recall and precision.\n\nImagine you're a translator. Someone speaks to you with an accent, slang, and grammatical errors. Before translating, you mentally clean up the sentence, guess the intended words, and expand abbreviations. Query preprocessing does the same thing - it turns messy human input into a clean, structured representation that the search engine can work with.",
    },
    {
      heading: "The Six Preprocessing Steps",
      content:
        "**1. Tokenization** - Split raw query into tokens. Language-aware tokenizers handle contractions (\"can't\" -> [\"ca\", \"n't\"]), currency, and numbers correctly.\n\n**2. Lowercasing** - Convert tokens to lowercase so \"Python\", \"PYTHON\", and \"python\" all match. Exception: entity-sensitive contexts where \"WHO\" (organization) != \"who\" (pronoun).\n\n**3. Stemming vs Lemmatization** - Reduce words to root forms.\n\n| Aspect | Stemming | Lemmatization |\n|---|---|---|\n| Method | Rule-based suffix stripping | Dictionary + morphological analysis |\n| Speed | Very fast | Slower (needs POS tagging) |\n| \"running\" | -> \"run\" | -> \"run\" (verb) |\n| \"better\" | -> \"better\" (fails) | -> \"good\" (adjective) |\n| Best for | High recall, speed-critical | Precision, user-facing suggestions |\n\n**4. Stop Word Removal** - Remove common words (\"the\", \"is\", \"at\") that carry little search value. Modern systems with good IDF weighting often skip this step entirely.\n\n**5. Spell Correction** - Uses edit distance, n-gram overlap, and language models to fix typos. EditDistance(\"recieve\", \"receive\") = 1.\n\n**6. Query Expansion** - Add synonyms or related terms. Methods: thesaurus-based (static dictionary), embedding-based (nearest neighbors in vector space), query logs (other users who searched X also searched Y).",
    },
    {
      heading: "Interactive Preprocessing Pipeline",
      content:
        "Type any query and watch each preprocessing step applied live - tokenization, lowercasing, spell correction, stop word removal, stemming, and synonym expansion.",
      playground: "query-preprocessor",
    },
    {
      heading: "Query to Embeddings",
      content:
        "For vector/semantic search, the preprocessed query must be converted into a **dense vector** (embedding). The embedding model used to encode documents at indexing time **must be the same model** used to encode queries at search time - each model learns its own latent space.\n\n| Type | Design | Best For | Example Models |\n|---|---|---|---|\n| **Symmetric** | Same encoder for query and doc | Semantic similarity, duplicate detection | `all-MiniLM-L6-v2`, `gte-base` |\n| **Asymmetric** | Short query vs long document, may use instruction prefixes | Search, Q&A retrieval, RAG | `e5-large` (with \"query:\" prefix), `msmarco-distilbert` |\n\nQuery embedding is generated at search time (latency matters: 5-50ms). Document embedding is generated at index time (batch processing, latency less critical). The sweet spot is a model small enough for real-time inference but large enough to capture semantic nuance.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Apply the same preprocessing to both queries and documents at index time. Mismatched preprocessing is the #1 cause of \"search returns nothing\" bugs. The preprocessing pipeline is the foundation everything else builds on.",
    },
  ],

  "query-processing/retrieval-flow": [
    {
      heading: "The Big Picture",
      content:
        "A modern retrieval pipeline is a **funnel**: each stage narrows the candidate set while increasing the quality of scoring. The philosophy is simple - use cheap methods on many documents, expensive methods on few.\n\nThe pipeline: User Query -> Preprocess -> Dual Retrieval (BM25 + Vector) -> Score Fusion (RRF) -> Filtering -> Re-Ranking (Cross-encoder) -> Top-K Results.",
    },
    {
      heading: "Stage-by-Stage Breakdown",
      content:
        "**Stages 1-2: Query Understanding** - The raw query is preprocessed and converted to both a set of tokens for BM25 lookup and a dense vector embedding for ANN search.\n\n**Stage 3: Dual Retrieval** - Two parallel paths: BM25 (inverted index lookup, ~1-5ms, great for exact matches) and Vector Search (ANN search via HNSW/IVF, ~5-20ms, great for conceptual matches).\n\n**Stage 4: Score Fusion** - Merge the two candidate sets via RRF or linear interpolation.\n\n**Stage 5: Re-Ranking** - A cross-encoder (BERT-based) re-scores the merged candidates by processing the query-document pair *together*, capturing fine-grained interactions. 100-1000x slower per document, but the most impactful stage.\n\n**Stages 6-7: Filter & Return** - Apply hard constraints (in-stock, permissions, geo), return top-k with metadata and snippets.",
    },
    {
      heading: "Latency Budget",
      content:
        "| Stage | Latency | Candidates |\n|---|---|---|\n| Preprocessing | 1-3ms | - |\n| BM25 retrieval | 1-5ms | ~1000 |\n| Vector retrieval | 5-20ms | ~1000 |\n| Merge (RRF) | <1ms | ~200-1000 |\n| Cross-encoder re-rank | 20-100ms | ~50-100 |\n| Filtering | 1-5ms | ~10-50 |\n| **Total** | **30-130ms** | **10-20 returned** |\n\nDifferent use cases have different budgets: Autocomplete (50ms, no re-ranking), Full Search (200-500ms, standard pipeline), RAG Pipeline (1-3s, can afford expensive re-ranking), Batch/Analytics (minutes, use most accurate models).",
    },
    {
      heading: "Design Trade-offs",
      content:
        "**Recall vs Precision** - Early stages maximize recall (include everything possibly relevant). Later stages maximize precision (show only the best).\n\n**Latency vs Quality** - Better scoring models produce higher quality rankings but cost more time. The pipeline exists to apply expensive methods only where they matter most.\n\n**The 80/20 Rule** - Re-ranking typically uses 80% of the latency budget but processes only 1% of the documents.\n\nMetrics to track per stage: Recall@K (>95% after retrieval), NDCG@10 (>0.6 after re-ranking), P50/P99 latency (total <300ms P99), empty result rate (<2%), candidate overlap between BM25 and vector (30-60% - too high means redundant).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Modern retrieval is a multi-stage funnel. Start broad and cheap, progressively narrow and score more expensively. The key design decision is where to draw each boundary - too aggressive early filtering kills recall, too much re-ranking blows the latency budget. When in doubt, retrieve more candidates and let re-ranking sort them out.",
    },
  ],

  "query-processing/filtering": [
    {
      heading: "Ranking vs Filtering",
      content:
        "These are fundamentally different operations. **Ranking** assigns a continuous score to every document - all documents survive, they're just reordered. **Filtering** makes a binary decision: include or exclude. No middle ground. A filtered-out document is invisible regardless of how relevant it might be.\n\n| Property | Ranking | Filtering |\n|---|---|---|\n| Output type | Continuous score | Boolean (yes/no) |\n| Effect on results | Reorders | Removes |\n| Reversibility | Trivial (re-sort) | Must re-query |\n| Impact on recall | None - all docs survive | Decreases (docs removed) |\n| User expectation | \"Show me the best\" | \"Exclude everything that isn't X\" |",
    },
    {
      heading: "Filter Types and Data Structures",
      content:
        "| Type | Operator | Example | Data Structure |\n|---|---|---|---|\n| **Category** | = / IN | category IN (\"shoes\", \"boots\") | Bitmap index |\n| **Range** | BETWEEN | price BETWEEN 50 AND 200 | Sorted array / B-tree |\n| **Boolean** | = true/false | in_stock = true | Bitset (1 bit per doc) |\n| **Date Range** | >, < | created_at > 2024-01-01 | Range tree / sorted |\n| **Multi-value** | CONTAINS | tags CONTAINS \"organic\" | Inverted index on tags |\n| **Geo** | WITHIN | location WITHIN 10km | Geohash / R-tree |\n\nFor low-cardinality fields (<100 values), bitmap indexes work best - combine with bitwise AND/OR at billions of bits per second. For high-cardinality fields (>10K values), use hash indexes or B-trees. Elasticsearch maintains a filter cache of frequently used filters as Roaring Bitmaps - reusing a cached filter is microseconds even on billions of docs.",
    },
    {
      heading: "Pre-filter vs Post-filter",
      content:
        "**Pre-filtering** narrows the search space before retrieval: faster (smaller search space), exact top-k from filtered set, but may degrade ANN recall if too many HNSW nodes are filtered out.\n\n**Post-filtering** retrieves first, then removes non-matching results: simple to implement, full recall, but wastes compute on filtered-out docs and may return fewer results than expected.\n\nThe **HNSW graph problem**: if you pre-filter 80% of nodes, the remaining graph is sparse and disconnected - ANN search can't navigate. Solutions include partition indexes (separate HNSW per category), filterable HNSW (skip non-matching nodes during traversal), or over-retrieve + post-filter (retrieve 5x candidates).\n\n**Best practice**: Apply hard filters pre-retrieval (security, language, tenant) and soft filters post-retrieval (availability, recency preference).",
    },
    {
      heading: "Faceted Search and the Zero-Results Problem",
      content:
        "Facets show users how many results are available for each filter value, helping them navigate without dead ends. The biggest danger of aggressive filtering: **zero results**. An empty result page is worse than showing slightly wrong results.\n\nFallback strategies: (1) **Progressive relaxation** - remove filters one at a time until results appear, (2) **Show near-misses** - \"No exact matches. Showing results that match 3 of 4 filters\", (3) **Suggest alternatives** - \"Try removing the price filter\", (4) **Soft filters** - convert some filters to ranking signals (prefer in-stock, don't require it).\n\nTrack your zero-result rate as a KPI. If more than 5% of filtered queries return zero results, your filter UX needs work.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Filtering is a binary gate; ranking is a continuous spectrum. The critical design decision is *when* to filter (pre vs post) and *what* to filter vs rank. Apply hard constraints as filters, soft preferences as ranking signals. Always show facet counts so users can self-navigate without hitting dead ends.",
    },
  ],

  "query-processing/spell-correction": [
    {
      heading: "The Typo Problem",
      content:
        "Studies show that **10-15% of search queries** contain spelling errors. On mobile, the rate jumps to 20%+. Without spell correction, these queries return zero or irrelevant results.\n\n| Platform | Typo Rate | Most Common Error |\n|---|---|---|\n| Desktop browser | ~10% | Adjacent key substitution |\n| Mobile (phone) | ~20% | Missing letter (fat-finger) |\n| Voice-to-text | ~25% | Phonetic confusion |\n| Non-native speakers | ~30% | Phonetic spelling |\n\nFour common typo types: **insertion** (\"thhe\" -> \"the\"), **deletion** (\"th\" -> \"the\"), **substitution** (\"tge\" -> \"the\"), **transposition** (\"hte\" -> \"the\").",
    },
    {
      heading: "Edit Distance (Levenshtein)",
      content:
        "The **Levenshtein distance** between two strings is the minimum number of single-character edits (insertions, deletions, substitutions) needed to transform one into the other. Dynamic programming fills an (m+1) x (n+1) matrix bottom-up.\n\nEdit distance 1 covers ~80% of typos; distance 2 covers ~95%. For a 5-letter word, edit distance 1 generates ~280 candidates, edit distance 2 generates ~78,000 - but only a tiny fraction will be real dictionary words.\n\nTry the interactive calculator below to visualize the DP matrix and optimal alignment path.",
      playground: "edit-distance-calculator",
    },
    {
      heading: "Correction Candidates and SymSpell",
      content:
        "Given a misspelled word, find all dictionary words within edit distance 1-2, then rank by **word frequency** (a common word is more likely to be the intended target).\n\nThe probabilistic foundation: By Bayes' theorem, P(c|w) is proportional to P(w|c) x P(c). P(c) is the language model prior (how common is \"wireless\" vs \"wisely\"?). P(w|c) is the error model (how likely is the typo \"wireles\" given intended \"wireless\"?).\n\n**SymSpell** (Symmetric Delete Distance) is the production solution: precompute all delete-1 and delete-2 forms of every dictionary word at index time. At query time, compute only delete forms of the input. If any overlap, the words are within edit distance 2. This is ~1000x faster than brute force - SymSpell processes 1M corrections/sec on a single CPU core.",
    },
    {
      heading: "Auto-Correct vs \"Did You Mean?\"",
      content:
        "The decision of *when* to correct is as important as *how*:\n\n**Auto-correct**: Silently fix the query and show results for the corrected version. Use when confidence is very high (>95%) and the original query returns zero results.\n\n**Suggest (\"Did you mean?\")**: Show results for the original query but offer the correction as a link. Use when the original query has some results or confidence is moderate.\n\nConfidence signals: edit distance 1 = high confidence, original results = 0 = high confidence, correction is 100x more common = high confidence, adjacent key on QWERTY = high confidence.\n\nContext-aware correction uses **n-gram context**: \"over there\" -> keep as-is, \"there apples\" -> suggest \"three apples\".",
    },
    {
      heading: "Query Expansion (Synonyms)",
      content:
        "Even correctly spelled queries miss relevant documents when users and authors use different vocabulary. Synonym expansion bridges this gap.\n\n| Method | Source | Pros | Cons |\n|---|---|---|---|\n| **Curated synonym lists** | Domain experts | Highest precision | High maintenance cost |\n| **Learned embeddings** | Embedding space neighbors | High recall, low maintenance | Noisy (\"dog\" and \"cat\" are similar but not synonyms) |\n| **Query logs** | User search patterns | Real user vocabulary | Requires traffic |\n| **LLM rewriting** | Language model | Best intent reformulation | Expensive, 500ms+ latency |\n\nRisks of over-expansion: query drift (\"Java\" programming -> \"coffee\"), noise injection, and increased latency. Mitigation: give original terms 2x weight, use context-aware disambiguation, limit expansion depth, and always A/B test.",
    },
    {
      heading: "Key Takeaway",
      content:
        "The best search engine understands what users *meant*, not just what they typed. Spell correction fixes the \"how they typed it\" problem; query expansion fixes the \"what words they chose\" problem. Together they dramatically improve recall. Implement spell correction first (biggest impact on day 1), then add synonyms for common terms in your domain.",
    },
  ],

  // ─── Series 4: Ranking & Relevance ──────────────────────────────
  "ranking-relevance/multi-stage-ranking": [
    {
      heading: "The Hiring Analogy",
      content:
        "Think of ranking like a hiring pipeline. You don't give every applicant a 5-hour deep evaluation. Stage 1: resume screening (fast, low cost) narrows 10,000 -> 500. Stage 2: phone screen narrows 500 -> 50. Stage 3: final evaluation narrows 50 -> 5. Each stage is more expensive but more accurate, applied to fewer candidates.",
    },
    {
      heading: "The Three Layers",
      content:
        "**L0 - Candidate Generation**: Rapidly narrow the entire corpus to a manageable set. Input: millions-billions of documents. Output: ~1,000-10,000 candidates. Methods: inverted index (BM25), ANN search (HNSW). Latency: 1-20ms. Quality: high recall, moderate precision.\n\n**L1 - Lightweight Scoring**: Score candidates with a fast model using more features than L0. Input: ~1,000-10,000 candidates. Output: ~100-500. Methods: bi-encoder similarity, lightweight LTR (XGBoost). Features: BM25 score, cosine similarity, popularity, freshness.\n\n**L2 - Heavy Re-Ranking**: Maximize precision on the final result page. Input: ~100-500. Output: ~10-20. Methods: cross-encoder (BERT-based), GPT re-ranker, ColBERT. Cross-attention between query and doc captures token-level interactions that bi-encoders miss.\n\nA cross-encoder takes ~20ms per document. Scoring 1M documents = 5.5 hours. Scoring 100 candidates = 2 seconds. The funnel makes the expensive model tractable.",
    },
    {
      heading: "Why Multi-Stage?",
      content:
        "You can't run an expensive neural re-ranker on 10 million documents. But you can run BM25 on 10M docs in milliseconds to get 1,000 candidates, then re-rank those with a more sophisticated model.\n\nThe total latency is approximately: L0 (corpus/throughput) + L1 (candidates x per-doc cost) + L2 (survivors x per-doc cost). Each stage uses progressively fewer documents but more expensive scoring.\n\n| Model | Type | Latency (10 docs) | Quality |\n|---|---|---|---|\n| ms-marco-MiniLM | Cross-encoder | ~50ms | Good baseline |\n| Cohere Rerank | API cross-encoder | ~100ms | Production-grade |\n| BGE Reranker v2 | Cross-encoder | ~80ms | Strong multilingual |\n| GPT-4 / Claude | LLM-as-judge | ~2000ms | Highest quality |\n| ColBERT v2 | Late interaction | ~30ms | Good speed/quality |",
    },
    {
      heading: "Key Takeaway",
      content:
        "Every production search system uses multi-stage ranking. The art is choosing the right model complexity and candidate set size at each stage to balance latency, cost, and quality. Start with BM25 + vector retrieval -> RRF fusion -> cross-encoder re-rank.",
    },
  ],

  "ranking-relevance/hybrid-scoring": [
    {
      heading: "The Score Scale Problem",
      content:
        "BM25 and vector search produce scores on completely different scales. BM25 ranges from 0 to ~25+ (unbounded, right-skewed), while cosine similarity ranges from -1 to 1 (bounded, roughly normal). Naively adding them: 14.2 + 0.91 = 15.11 - BM25 contributes 94% of the final score, making vector similarity nearly irrelevant.\n\nIn production systems, BM25 scores for top results typically cluster between 8 and 18, while vector similarities cluster between 0.7 and 0.95. The gap in magnitude is the core problem that fusion methods must solve.",
    },
    {
      heading: "Method 1: Min-Max + Weighted Sum",
      content:
        "Normalize both score sets to [0, 1] using min-max scaling: norm(s) = (s - s_min) / (s_max - s_min). Then combine with alpha: hybrid(d) = alpha x norm_bm25(d) + (1 - alpha) x norm_vec(d).\n\nalpha = 1.0 -> pure keyword, alpha = 0.0 -> pure semantic, alpha = 0.5 -> equal weight. Pros: simple, one tunable parameter. Cons: sensitive to outliers, requires scores from both retrievers, normalization is query-dependent.\n\nTuning guidance: alpha ~0.7 for technical docs/error codes/SKUs (keyword-heavy), alpha ~0.5 for general search (balanced), alpha ~0.3 for natural language questions (semantic-heavy).",
    },
    {
      heading: "Method 2: Reciprocal Rank Fusion (RRF)",
      content:
        "Ignore scores entirely - combine using only rank positions: RRF(d) = sum over rankers: 1 / (k + rank_r(d)). k = 60 is the standard constant (empirically optimal from Cormack et al. 2009).\n\nWith k=60: rank 1 gets 1/61 = 0.0164, rank 2 gets 1/62 = 0.0161 - only 2% difference. This prevents top-ranked documents from dominating. Documents ranked highly by *both* systems get the highest fused scores.\n\nPros: no normalization needed, robust to outliers, parameter-free (k=60 works everywhere). Cons: ignores score magnitude - rank #1 with score 0.99 and rank #1 with score 0.51 are treated the same.",
    },
    {
      heading: "Score Normalizer",
      content:
        "Enter raw BM25 and vector scores to see how min-max normalization and alpha weighting produce fused results. Experiment with different alpha values to see how rankings shift.",
      playground: "score-normalizer",
    },
    {
      heading: "Method 3: Learned Fusion",
      content:
        "Train a model to learn optimal weights from real user behavior (clicks, purchases, dwell time). For each query-document pair, extract features (bm25_score, vector_sim, bm25_rank, vector_rank, title_match, doc_freshness, click_rate) and train a LambdaMART or XGBoost model optimized for NDCG.\n\nRequires click data (10k+ queries with clicks). Start with RRF, graduate to learned fusion once you have sufficient data.\n\n| Criterion | Min-Max + Weighted | RRF | Learned Fusion |\n|---|---|---|---|\n| Complexity | Low | Low | High |\n| Needs Scores | Yes | No (ranks only) | Yes |\n| Outlier Robust | No | Yes | Depends on model |\n| Needs Training Data | No | No | Yes (10k+ queries) |\n| Best For | Stable distributions | General purpose | High-traffic production |",
    },
    {
      heading: "Key Takeaway",
      content:
        "There is no single best fusion method. RRF is the safest default - score-agnostic, outlier-resistant, requires no tuning. Graduate to weighted sum when you understand your score distributions, and to learned fusion when you have enough click data. The biggest mistake is not combining signals at all.",
    },
  ],

  "ranking-relevance/relevance-tuning": [
    {
      heading: "Why Tune?",
      content:
        "Default BM25 ranking treats all fields equally. In practice, a match in the title is far more valuable than a match deep in the description. Without tuning, a laptop accessory guide mentioning \"wireless headphones\" once in a long description ranks above actual wireless headphones products.\n\n| Metric | Before Tuning | After Tuning | Improvement |\n|---|---|---|---|\n| NDCG@10 | 0.42 | 0.67 | +59.5% |\n| Click-Through Rate | 12.3% | 18.7% | +52.0% |\n| Zero-Result Rate | 8.1% | 5.2% | -35.8% |",
    },
    {
      heading: "Field Boosting",
      content:
        "Weight different fields differently: score(d, q) = boost_title x BM25(d_title, q) + boost_body x BM25(d_body, q) + boost_tags x BM25(d_tags, q).\n\n| Field | Typical Boost | Why |\n|---|---|---|\n| Title | 3.0-5.0x | Concise summary - match here is strong signal |\n| Headers (H1-H3) | 2.0-3.0x | Section headers indicate topic structure |\n| Body | 1.0x (baseline) | Most content lives here - matches less targeted |\n| Tags/categories | 2.0-4.0x | Curated metadata - high signal |\n| Comments | 0.3-0.5x | User-generated, noisy - low signal |\n\nField boosting is like an audio mixer. Each field is a track (vocals, bass, drums). The boost slider controls how loud that track is in the final mix.",
      playground: "field-boost-playground",
    },
    {
      heading: "Function Scoring",
      content:
        "Beyond text relevance, inject **business signals** directly into the score:\n\n**Recency boost**: boost = e^(-lambda x age_days). Exponential decay - recent docs score higher. News sites use aggressive decay; encyclopedias don't.\n\n**Popularity boost**: boost = log2(1 + views). Log-scaled to prevent viral content from dominating. 1000 views = 10x boost, not 1000x.\n\n**Query-time boosts**: Applied per-query. If query contains \"buy\" or \"price\" -> boost product pages. If user is on mobile -> boost mobile-friendly pages. Boost categories the user has clicked on before.\n\nIn Elasticsearch, use `function_score` query with `score_mode: \"sum\"` for additive or `score_mode: \"multiply\"` for multiplicative. Additive nudges rankings; multiplicative amplifies relevant + popular docs.",
    },
    {
      heading: "A/B Testing Relevance",
      content:
        "Never ship relevance changes without measurement. The workflow: Define metrics (NDCG, CTR, dwell time) -> Randomize users into A/B -> Run experiment 1-2 weeks -> Statistical significance test (p < 0.05 with 1,000-10,000+ queries per variant) -> Ship or rollback.\n\nCommon pitfalls: **Position bias** (users click position 1 regardless - use interleaving to eliminate), **Novelty effect** (new rankings get more clicks because they look different - run 2+ weeks).\n\nThe tuning workflow: (1) Establish baseline, (2) Build 100-500 query-document judgment pairs, (3) Tune one variable at a time, (4) Offline evaluation against judgment set, (5) A/B test in production, (6) Monitor and re-evaluate monthly.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Relevance tuning is not a one-time task - it's a continuous feedback loop. Start with field boosting (title > tags > description), add function scoring for business signals (recency, popularity), and validate every change with A/B tests. The goal is not perfect ranking - it's measurably better ranking than what you had yesterday.",
    },
  ],

  "ranking-relevance/ranking-signals": [
    {
      heading: "What is a Signal?",
      content:
        "A ranking signal is any feature or measurement that contributes to determining how relevant a document is to a query. Modern search systems combine dozens of signals: score(d, q) = sum of w_i x signal_i(d, q).\n\nThink of ranking like a hiring committee. Each committee member (signal) evaluates the candidate (document) from a different angle - resume keywords, cultural fit, experience, references. The final hiring decision combines all perspectives with different weights.",
    },
    {
      heading: "The Six Signal Categories",
      content:
        "**1. Keyword Signals** - BM25 score, exact phrase match, field match (title vs body), term proximity, query coverage. Layered strategy: first try exact match (instant, highest precision), then phrase match, then BM25 as fallback.\n\n**2. Semantic Signals** - Bi-encoder (vector search) for first-stage retrieval, cross-encoder for re-ranking. ColBERT-style token-level matching for a middle ground.\n\n**3. Popularity Signals** - Click-through rate (position-normalized), dwell time, page views, purchases, bounce rate. Use time-windowed or exponentially-decayed counts to avoid biasing toward old content. Cold start: use Bayesian smoothing (clicks + alpha) / (impressions + beta).\n\n**4. Freshness Signals** - Publish date, last modified, crawl freshness, content velocity (how often the page changes). Not all queries benefit from freshness - use query classification to detect time-sensitive vs. evergreen queries.\n\n**5. Quality Signals** - User ratings (Bayesian average to avoid 1-review-5-stars bias), spam score, content depth, readability (Flesch-Kincaid), domain authority.\n\n**6. Personalization Signals** - User history (clicks, purchases), location, user segment, language preference, device context. Balance with diversity to avoid filter bubbles.",
    },
    {
      heading: "Signal Mixer",
      content:
        "Adjust the weight of each signal category and watch the radar chart reshape. Use presets to see how different search types (e-commerce, news, knowledge base, social feed) prioritize different signals.",
      playground: "signal-mixer",
    },
    {
      heading: "Learning to Rank (LTR)",
      content:
        "Modern systems use **Learning to Rank** - a machine learning model trained on human relevance judgments: FinalScore(q, d) = F(s1, s2, ..., sn) where F is typically a gradient-boosted tree (LambdaMART, XGBoost).\n\n| Approach | Training | Models |\n|---|---|---|\n| **Pointwise** | Predict absolute relevance per doc | Linear regression, neural net |\n| **Pairwise** | Learn which doc in a pair is more relevant | RankNet, LambdaRank |\n| **Listwise** | Optimize the entire ranking list (NDCG) | LambdaMART, ListNet |\n\nEvaluation metrics: NDCG@k (ranking quality, industry standard), MAP (average precision across recall levels), MRR (speed to first relevant result), Recall@k (critical for L0 evaluation).",
    },
    {
      heading: "Key Takeaway",
      content:
        "No single signal is sufficient. Keyword signals catch what users type, semantic signals catch what they mean, popularity encodes collective wisdom, freshness handles time-sensitivity, quality filters noise, and personalization tailors results. Start with keyword + semantic, add popularity and freshness, then personalization. The art is finding the right mix for your use case.",
    },
  ],

  // ─── Series 5: System Design ────────────────────────────────────
  "system-design/capacity-estimation": [
    {
      heading: "Why Estimate?",
      content:
        "Before building anything, you need to know: How many queries per second? How much data? How much memory for indexes? How many machines? Capacity estimation is the foundation of every architecture decision and the first thing to discuss in a system design interview.\n\nGet capacity wrong and everything downstream falls apart. Under-provision and you hit latency walls during peak traffic. Over-provision and you burn budget on idle hardware. The goal is a principled estimate backed by simple math.",
    },
    {
      heading: "The Core Formulas",
      content:
        "Four key calculations drive every search system design:\n\n| Formula | Purpose |\n|---|---|\n| **Storage** = Documents × Avg Size × Index Overhead (1.5×) | How much disk you need per replica |\n| **Cluster Storage** = Storage × Replication Factor | Total disk across the cluster |\n| **Shards** = ceil(Storage / Max Shard Size) | How many primary shards to create |\n| **Nodes** = (Shards × Replication Factor) / Shards per Node | Minimum cluster size |\n\nIndex overhead (1.5×) accounts for the inverted index, doc values, norms, and stored fields that Lucene maintains alongside raw data. For dense vector indexes add another ~150 GB per 50M documents at 768 dimensions.",
    },
    {
      heading: "Scale Estimation Example",
      content:
        "For a large eCommerce system (50M products, 5 KB avg doc, 10K peak QPS):\n\n| Metric | Estimate | Rationale |\n|---|---|---|\n| Raw data | 250 GB | 50M × 5 KB |\n| With index overhead | 375 GB | 250 × 1.5 |\n| Vector embeddings | 150 GB | 50M × 768 dims × 4 bytes |\n| Total per replica | ~525 GB | Text index + vectors |\n| With 2 replicas | ~1.6 TB | 3 copies total |\n| Primary shards | 18 | 525 GB / 30 GB target |\n| Total shard copies | 54 | 18 × 3 |\n| Data nodes | 8-12 | Headroom for rolling upgrades |\n\nUse the interactive capacity estimator to plug in your own numbers and see how storage, shard count, and node requirements scale.",
      playground: "capacity-estimator",
    },
    {
      heading: "QPS and Bandwidth Planning",
      content:
        "Read throughput drives replica count: Required shard-copies = Peak QPS / QPS per shard. A typical Elasticsearch shard handles 100-500 QPS depending on query complexity and hardware. With 18 shards and 300 QPS/shard, a single replica set handles 5,400 QPS - you need at least 2 replica sets for 10K QPS.\n\nBandwidth = QPS × Avg Response Size. At 10K QPS with 5 KB responses, that's 50 MB/s outbound - well within a 10 Gbps network but worth tracking. Autocomplete multiplies this by 5× (one request per keystroke).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Always start system design with capacity estimation. Show your math: \"50M products × 5 KB = 250 GB raw. With 1.5× index overhead = 375 GB. At 30 GB/shard = 13 primary shards. With 2 replicas = 39 shard copies across ~10 nodes.\" Concrete numbers backed by reasoning demonstrate deep expertise and guide every downstream decision.",
    },
  ],

  "system-design/sharding-and-replication": [
    {
      heading: "The Pizza Kitchen Analogy",
      content:
        "Sharding is like having multiple pizza ovens - each handles a portion of the orders. Replication is like having a backup oven - if one breaks, the others keep serving. For search, shards split the index across machines; replicas copy shards for redundancy and read scaling.\n\nThe combined capacity formula: Capacity = Shards × QPS per shard × (Replicas + 1). Sharding multiplies data capacity; replication multiplies read capacity.",
    },
    {
      heading: "Sharding Strategies",
      content:
        "How you distribute data across shards determines query patterns and performance:\n\n| Strategy | How | Pros | Cons | Best For |\n|---|---|---|---|---|\n| **Hash-based** | hash(doc_id) % N | Even distribution, no hotspots | Range queries hit all shards | General eCommerce |\n| **Range-based** | A-M on shard 0, N-Z on shard 1 | Range queries target one shard | Uneven distribution, hotspots | Time-series, alphabetical |\n| **Custom routing** | Route by tenant_id or category | Co-locate related docs | Requires domain knowledge, can create skew | Multi-tenant, category-heavy |\n\nElasticsearch defaults to hash-based routing on `_id`. Override with the `routing` parameter when queries always filter by a specific field - this converts scatter-gather into single-shard queries.",
    },
    {
      heading: "Scatter-Gather: The Cost of Distribution",
      content:
        "Every distributed search query fans out to all shards, then merges results. Total latency = max(shard latencies) + merge time. A single slow shard (straggler) sets the floor for every query - this is why tail latency (p99) matters most.\n\nThe probability of at least one slow shard: P(straggler) = 1 - (1 - p)^N where p is the per-shard straggler rate and N is the number of shards. With 20 shards and a 2% straggler rate, there's a 33% chance of a slow shard on any given query.\n\nOptimization strategies: adaptive replica selection (route to least-loaded replica), hedged requests (send to two replicas, use first response), shard pruning (skip shards that can't match), and custom routing (single-shard queries when possible).",
    },
    {
      heading: "Shard Calculator",
      content:
        "Size your cluster based on data volume, document size, and redundancy needs. Adjust the sliders to see how shard count, total copies, and cluster storage change with different configurations.",
      playground: "shard-calculator",
    },
    {
      heading: "Replica Types and Failover",
      content:
        "Replicas serve reads and provide fault tolerance. The write path goes to the primary shard only, which replicates to replicas (sync or async). The read path can go to any replica - more replicas = more read throughput.\n\nRead QPS capacity = QPS per node × (replicas + 1) × shards. With 2 replicas and 3 availability zones, you survive an entire zone failure. Elasticsearch uses sync replication by default - a write isn't acknowledged until all in-sync replicas confirm.\n\nCross-zone replica placement ensures no shard and its replica share a failure domain. This is the standard setup for production search clusters.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Shard for throughput and capacity. Replicate for availability and read scaling. Scatter-gather is the cost: total latency = max(shard latencies). Minimize shard count where possible, watch tail latency religiously, and use hedged requests to tame stragglers.",
    },
  ],

  "system-design/caching": [
    {
      heading: "The Librarian's Desk",
      content:
        "Imagine a librarian who keeps the most requested books on their desk instead of walking to the stacks. When someone asks for \"Harry Potter,\" it's right there (cache hit, ~0.1ms). When someone asks for an obscure book, the librarian walks to the shelves (cache miss, ~50-200ms). The desk has limited space, so the librarian removes the book that hasn't been asked for the longest time. That's LRU caching.\n\nCaching is the single most impactful optimization for search latency and cost. A well-designed cache can reduce search engine load by 40-60%.",
    },
    {
      heading: "What to Cache in Search",
      content:
        "Not all data is equal. Cache the expensive-to-compute, frequently-accessed layers:\n\n| Cache Layer | What | TTL | Hit Rate Target |\n|---|---|---|---|\n| **Query result cache** | Full serialized response for (query, filters, sort, page) | 5-15 min | 30-50% |\n| **Filter cache** | Pre-computed bitsets for common filters (brand, in_stock) | 5 min | 80-95% |\n| **Embedding cache** | Pre-computed query embeddings | 24 hours | 20-40% |\n| **Autocomplete cache** | Suggestions for popular prefixes | 1 hour | 60-80% |\n| **Field data cache** | Uninverted field values for sorting/aggregations | Until evicted | ~100% |\n\nEffective QPS on ES = Total QPS × (1 - Cache Hit Ratio). At 40% cache hit ratio: 10K QPS × 0.6 = 6K QPS reaching Elasticsearch.",
    },
    {
      heading: "LRU vs LFU vs W-TinyLFU",
      content:
        "| Strategy | Best For | Weakness | Complexity |\n|---|---|---|---|\n| **LRU** | General-purpose, changing workloads | Frequency-blind - one-time queries evict popular ones | O(1) |\n| **LFU** | Stable popularity distribution | Slow to adapt - once-popular items clog the cache | O(log n) |\n| **W-TinyLFU** | Production caches (Caffeine) | Requires tuning window size | Sketch-based |\n\nW-TinyLFU (used by Caffeine in the JVM world) combines a small LRU admission window with frequency-based eviction. It adapts to workload shifts while maintaining near-optimal hit rates.",
    },
    {
      heading: "Cache Invalidation and Zipf's Law",
      content:
        "Cache invalidation strategies: TTL-based (simple, bounded staleness), event-driven (Kafka consumer invalidates on product change), tag-based (tag entries with product IDs, invalidate all containing a changed product), and write-through (update cache simultaneously with index).\n\nZipf's law makes caching powerful: the frequency of the n-th most common query is proportional to 1/n. The top 1% of queries account for ~30% of traffic. The top 10K queries cover ~60-70% of traffic. Caching these gives disproportionate benefit.\n\nAlways warm the cache after deployments, restarts, or reindexing. Pre-load the top 10K queries from yesterday's analytics to avoid cold-start latency spikes.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Cache popular queries aggressively (Zipf's law means a small cache handles most traffic). Layer caches: Client → CDN → Application (Redis) → Search Engine internal. Use TTL + event-driven invalidation as a hybrid. Warm caches proactively after deploys. Effective Latency = (1 - hit_rate) × miss_latency + hit_rate × hit_latency.",
    },
  ],

  "system-design/architecture-walkthrough": [
    {
      heading: "Requirements Gathering",
      content:
        "Start every system design with requirements. Functional: product search, autocomplete, filters, faceted navigation, sorting, spell correction, synonyms, pagination. Non-functional: <200ms p99 latency, 10K QPS, 50M products, 99.9% availability, price/stock updates within 5 minutes.\n\nDefine the API early - it anchors the discussion:\n\n`GET /api/v1/search?q=wireless+headphones&brand=Sony&price_max=200&sort=relevance&page=1&size=20`\n\nResponse includes results, facets, spell suggestions, and metadata. Mention versioning (/v1/) to show you think about backward compatibility.",
    },
    {
      heading: "Capacity Estimation",
      content:
        "Use the interactive calculator to size your cluster. Plug in your product count, QPS target, and average document size to see storage, shard count, and estimated nodes.\n\nThe key formulas: Storage = Products × Avg Size × 1.5 (index overhead). Shards = ceil(Index Size / 30 GB). Nodes = Total Shard Copies / Shards per Node. Always add 30-50% headroom for traffic spikes.",
      playground: "capacity-estimator",
    },
    {
      heading: "High-Level Architecture",
      content:
        "Two main data flows: the query path (read) and the ingestion path (write).\n\n**Query path:** Client → API Gateway (rate limiting, auth) → Query Service (parse, spell check, synonym expansion) → Redis Cache → Search Cluster (BM25 + kNN) → Re-Ranker → Response\n\n**Ingestion path:** Product DB → CDC (Debezium) → Kafka → Enrichment Service (taxonomy, embeddings) → Index Writer → Search Cluster\n\n| Component | Responsibility | Technology |\n|---|---|---|\n| API Gateway | Rate limiting, auth, routing | Kong, Envoy, AWS ALB |\n| Query Service | Parse, enrich, classify queries | Custom service |\n| Search Cluster | Inverted index + vector index | Elasticsearch, OpenSearch |\n| Cache | Query results, embeddings, filters | Redis Cluster |\n| Message Queue | Decouple ingestion, buffering | Apache Kafka |\n| Monitoring | Metrics, alerting, dashboards | Prometheus + Grafana |",
    },
    {
      heading: "Query Flow and Latency Budget",
      content:
        "The query service processes each request through a multi-stage pipeline with a strict 200ms p99 budget:\n\n| Stage | Latency | % of Budget |\n|---|---|---|\n| Network + Gateway | 10ms | 5% |\n| Cache check | 1ms | 0.5% |\n| Query parsing + understanding | 15ms | 7.5% |\n| L1 Retrieval (BM25 + kNN) | 80ms | 40% |\n| L2 Re-ranking | 50ms | 25% |\n| Business rules + formatting | 10ms | 5% |\n| Buffer | 34ms | 17% |\n\nL1 retrieval is the bottleneck (~40% of latency). Caching eliminates it entirely for repeated queries. The re-ranking layer uses 25% of the budget but processes only the top 200 candidates - expensive per-doc but applied to few docs.",
    },
    {
      heading: "Failure Modes and Graceful Degradation",
      content:
        "Design for failure at every layer:\n\n| Failure | Impact | Mitigation | Recovery |\n|---|---|---|---|\n| ES node dies | Shards unavailable | Replicas promoted, auto-rebalance | ~30s |\n| Redis cache down | All queries hit ES directly | Circuit breaker, bypass cache | ~5s |\n| Kafka broker failure | Ingestion stalls | Replication factor 3, producer retries | ~30s |\n| Bad ranking model | Quality degradation | Canary deploy (5% traffic), auto-rollback | ~2 min |\n\nGraceful degradation priority: (1) disable re-ranking, (2) disable vector search (BM25 only), (3) disable facets, (4) serve from cache only, (5) show trending products. A degraded search experience is always better than an error page.",
    },
    {
      heading: "Monitoring and the Feedback Loop",
      content:
        "End your design with monitoring - it shows maturity. Track: p50/p95/p99 latency, QPS, error rate, zero-result rate, index freshness, cache hit ratio. Alert on: latency > 200ms, error rate > 0.5%, zero-result rate > 10%, index lag > 15 min.\n\nThe feedback loop: Deploy ranking model → Collect click/purchase data → Analyze quality metrics → Train improved model → A/B test → Ship. The best search teams run 50+ A/B tests per year.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Structure your approach: requirements → capacity estimation → API design → high-level architecture → deep dive on query flow → deep dive on ingestion → failure modes → monitoring. This demonstrates senior-level thinking. Always show your math, discuss trade-offs, and end with observability.",
    },
  ],

  // ─── Series 6: Data Pipelines ───────────────────────────────────
  "data-pipelines/batch-vs-realtime": [
    {
      heading: "Buffet vs Made-to-Order",
      content:
        "Batch processing is like a buffet - prepare everything at once, serve it all. Real-time is made-to-order - process each item as it arrives. The most fundamental architectural decision in any search pipeline is: how frequently do you update your index?",
    },
    {
      heading: "Batch Ingestion",
      content:
        "Scheduled bulk reindexing at fixed intervals - nightly, hourly, or on-demand. The simplest approach and often the right starting point.\n\nThe pattern: Data Sources → Scheduler (Cron/Airflow) → Batch ETL Job → Build New Index → Alias Swap.\n\nAdvantages: simple to build/test/debug, consistency guaranteed (full snapshot from source of truth), easy rollback (point alias back), can leverage Spark/dbt, lower infrastructure cost (no always-on streaming).",
    },
    {
      heading: "Real-Time Ingestion",
      content:
        "Event-driven, near-instant updates. Every change in the source system triggers an index update within seconds.\n\nThe pattern: CDC (Debezium) / App Events → Kafka → Stream Processor (Flink/Kafka Streams) → Search Index (Upsert). Failed messages route to a Dead Letter Queue.\n\nAdvantages: near-instant freshness, no expensive full reindexing, better UX for time-sensitive data, natural fit for event-driven architectures.",
    },
    {
      heading: "The Comparison",
      content:
        "| Dimension | Batch | Real-Time |\n|---|---|---|\n| Latency | Minutes–hours | Seconds |\n| Complexity | Low | High |\n| Consistency | Strong (snapshot) | Eventual |\n| Error recovery | Re-run the batch | DLQ, retries, offset management |\n| Infrastructure cost | Pay only during batch window | Always-on consumers + brokers |\n| Handles deletes | Naturally (missing = deleted) | Requires explicit delete events |\n| Data drift risk | None (full rebuild) | High (bugs accumulate) |\n\nToggle between batch and real-time to compare how each approach handles the same pipeline stages.",
      playground: "batch-vs-realtime",
    },
    {
      heading: "Hybrid: The Production Answer",
      content:
        "Almost every production search system uses a hybrid approach: real-time for incremental updates (keeps the index fresh) plus periodic batch for full reindex (catches anything the real-time stream missed and corrects drift). The batch acts as a consistency checkpoint.\n\n| Scenario | Approach |\n|---|---|\n| MVP or prototype | Batch only |\n| eCommerce product search | Hybrid - real-time for price/stock, batch for catalog rebuild |\n| News / social feed | Real-time heavy |\n| Internal knowledge base | Batch (hourly) |\n| Marketplace (eBay-style) | Hybrid - listings go live immediately, nightly quality cleanup |",
    },
    {
      heading: "Key Takeaway",
      content:
        "Start with batch (simpler, more reliable). Add real-time only when freshness requirements demand it. The hybrid approach - nightly batch + real-time delta updates - is the industry standard. The batch path acts as a safety net that corrects any drift accumulated by the real-time path.",
    },
  ],

  "data-pipelines/etl-pipeline": [
    {
      heading: "The Assembly Line",
      content:
        "An ETL pipeline is like a factory assembly line. Raw materials enter one end (Extract), each station performs a single well-defined job (Transform), and finished products emerge at the other end (Load). If a sheet is warped, it's pulled off the line - not jammed through.\n\nEach stage can be tested independently, scaled horizontally, and failures are isolated. Clean boundaries prevent cascading failures.",
    },
    {
      heading: "Extract: Getting Data Out",
      content:
        "The extraction strategy depends on your source system:\n\n| Source Type | Method | Considerations |\n|---|---|---|\n| Relational DB | SQL queries, CDC (Debezium) | Use read replicas, avoid lock contention |\n| REST API | Paginated GET, webhooks | Rate limiting, pagination cursors |\n| File stores | S3 listing + download | Track processed files |\n| Event streams | Kafka consumer, SQS | Offset tracking, exactly-once vs at-least-once |\n| NoSQL (MongoDB) | Change streams, periodic export | Oplog size limits |\n\nCDC (Change Data Capture) is the gold standard: reads the database's write-ahead log for zero-impact, guaranteed capture of every change.",
    },
    {
      heading: "Transform: Making Data Search-Ready",
      content:
        "Raw data is never directly indexable. The transform stage shapes it for search:\n\n**Cleaning** - Strip HTML, fix encoding, remove nulls, deduplicate. **Normalizing** - Standardize dates (ISO 8601), prices (cents integers), lowercase text, canonicalize categories. **Enriching** - NER, language detection, sentiment analysis, geo-coding, taxonomy classification. **Embedding Generation** - Dense vectors for semantic search via batch GPU inference.\n\nEach transform should be a pure function: doc in, doc out, no side effects. Validate before expensive operations like embedding generation.",
    },
    {
      heading: "Load: Pushing to the Index",
      content:
        "Always use bulk operations. Single inserts achieve ~50 docs/sec; bulk inserts achieve ~5,000 docs/sec; parallel bulk workers reach ~20,000+ docs/sec.\n\nBest practices: batch 500-2000 docs per request, disable refresh during bulk load (`refresh_interval=-1`), set replicas to 0 during load then restore, use alias swapping for zero-downtime reindexing.",
    },
    {
      heading: "Error Handling: Dead Letter Queues",
      content:
        "When a message fails after all retries, route it to a Dead Letter Queue for later inspection. Each DLQ entry records: the original document, the error message and stack trace, and the timestamp and retry count.\n\nIn most pipelines, 0.1-1% of documents hit the DLQ - that's normal. Set up alerts when DLQ depth exceeds a threshold. Use exponential backoff with jitter: delay = min(base × 2^attempt + random(0, jitter), max_delay).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Build idempotent pipelines - re-running them should produce the same result. Use dead letter queues for failed documents. Monitor pipeline health: throughput, error rate, end-to-end latency. Every document should have a deterministic ID so upserts are safe to replay.",
    },
  ],

  "data-pipelines/index-update-strategies": [
    {
      heading: "Four Update Strategies",
      content:
        "| Strategy | Mechanism | Latency | Consistency | When to Use |\n|---|---|---|---|---|\n| **Full Reindex** | Build new index, swap alias | High | Perfect | Schema changes, major migrations |\n| **Partial Update** | Update specific fields of existing docs | Low | Good | Price changes, stock updates |\n| **Upsert** | Insert if new, update if exists | Low | Good | Real-time CDC streams |\n| **Delete + Reinsert** | Remove old doc, add new version | Low | Risk of gap | Simple systems, small indexes |",
    },
    {
      heading: "Zero-Downtime Reindexing with Aliases",
      content:
        "The most important operational pattern in search engineering. Never point your application directly at an index name - always use an alias.\n\nThe workflow: (1) Create new index with updated mapping (products-v3), (2) Run full reindex into the new index, (3) Validate document counts and sample queries, (4) Atomic alias swap - remove alias from v2, add to v3 in a single API call, (5) Keep v2 for rollback, then delete.\n\nYour app always references the alias (\"products\"), never the versioned index name. Infrastructure change, zero code change.",
    },
    {
      heading: "Optimistic Concurrency and Refresh Intervals",
      content:
        "When multiple pipeline workers update the same document concurrently, use version-based concurrency: specify \"only apply this update if the current version is X.\" Elasticsearch supports this via `if_seq_no` and `if_primary_term` parameters.\n\nRefresh intervals control when indexed documents become searchable:\n\n| Setting | Throughput | Visibility | Use Case |\n|---|---|---|---|\n| 1s (default) | Good | ~1s | Normal operations |\n| 30s | Better | ~30s | Heavy indexing |\n| -1 (disabled) | Best | Manual only | Bulk reindex |",
    },
    {
      heading: "Key Takeaway",
      content:
        "Use upsert for real-time updates and alias swap for schema changes or full rebuilds. Always have a rollback plan - keep the previous index version until the new one is verified. Optimistic concurrency prevents stale writes in concurrent pipelines.",
    },
  ],

  "data-pipelines/data-quality": [
    {
      heading: "The Five Quality Dimensions",
      content:
        "Data quality is the invisible backbone of search relevance. When users complain about search quality, the root cause is often not the ranking algorithm - it's bad data:\n\n1. **Schema** - does the data match expected types? Strings in numeric fields cause indexing failures.\n2. **Completeness** - are required fields present? Missing titles make documents unsearchable.\n3. **Freshness** - is the data up to date? Stale prices erode user trust.\n4. **Consistency** - do related fields agree? A product marked \"in stock\" with quantity 0.\n5. **Uniqueness** - are there duplicates? Duplicate documents inflate result counts and waste index space.",
    },
    {
      heading: "Pre-Load Validation Checklist",
      content:
        "Run automated quality checks at every stage. A document that fails validation should never reach the index:\n\n| Check | What It Catches | Action on Failure |\n|---|---|---|\n| Required fields present | Missing title, ID | Reject to DLQ |\n| Field type validation | String in numeric field | Reject to DLQ |\n| Value range checks | Negative prices, year 9999 | Reject to DLQ |\n| Text length bounds | Empty descriptions, 10MB blobs | Truncate or reject |\n| Duplicate detection | Same ID twice in batch | Keep latest version |\n| Schema compatibility | Unknown fields | Add dynamic mapping or reject |\n| Encoding validation | Broken UTF-8, mojibake | Clean or reject |",
    },
    {
      heading: "Post-Load Sanity Checks",
      content:
        "After reindexing, validate before swapping the alias: compare document counts between old and new index (abort if new < 95% of old), run canary queries (\"shoes\", \"laptop\") and verify non-zero results, check field statistics (avg price, null rates) for anomalies.\n\nFreshness monitoring: track the timestamp of the most recently indexed document. Data Freshness = t_now - max(t_source_updated). If the gap exceeds your SLA, fire an alert. A stale pipeline might still be \"running\" - just not processing new data.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Validate data at ingestion time, not query time. Bad data in the index is worse than missing data - it actively degrades search quality. Build automated quality checks into every pipeline stage: pre-load validation catches corrupt documents, post-load sanity checks prevent bad indexes from going live.",
    },
  ],

  // ─── Series 7: RAG Systems ──────────────────────────────────────
  "rag-systems/what-is-rag": [
    {
      heading: "The Open-Book Exam Analogy",
      content:
        "A plain LLM is like a closed-book exam - it can only use what it memorized during training. RAG is an open-book exam - the model retrieves relevant context from external documents before generating an answer. This means it can answer questions about your private data, stay current, and cite sources.\n\nThe RAG pipeline has two distinct phases: an offline phase (index your documents) and an online phase (answer user queries). Both matter equally - a perfect LLM with bad retrieval produces bad answers.",
    },
    {
      heading: "The 3 Problems RAG Solves",
      content:
        "1. **Knowledge cutoff** - LLMs don't know about events after their training date. RAG retrieves current information from your knowledge base.\n2. **Hallucination** - grounding answers in retrieved documents reduces fabrication. The LLM can only state facts that appear in the context.\n3. **Private data** - your company's internal docs, Confluence pages, Slack history, and proprietary databases aren't in the training data. RAG makes them accessible.\n\nThe quality bottleneck is almost always retrieval. If the right chunks aren't retrieved, even GPT-4 can't generate a correct answer. This is why search engineering skills are critical for RAG systems.",
    },
    {
      heading: "The RAG Pipeline",
      content:
        "Step through the complete RAG pipeline from document ingestion to answer generation. The offline phase processes and indexes your documents; the online phase handles user queries in real-time.",
      playground: "rag-pipeline-flow",
    },
    {
      heading: "Key Takeaway",
      content:
        "RAG = Retrieve relevant context + Augment the prompt with that context + Generate an answer. The retrieval quality is the bottleneck - invest in chunking, embedding model selection, and hybrid search before tuning the LLM prompt.",
    },
  ],

  "rag-systems/chunking-for-rag": [
    {
      heading: "The Index Card Analogy",
      content:
        "Imagine writing a cheat sheet for an exam on index cards. Too small (one sentence per card) and you lose context - you can't understand the answer without surrounding information. Too large (entire chapters per card) and you can't find specific answers quickly - the relevant sentence is buried in noise.\n\nRAG chunking has the same trade-off. The chunk size determines retrieval granularity: small chunks offer precision, large chunks offer context. Most embedding models have a 512-token limit, so documents must be split.",
    },
    {
      heading: "Chunking Strategies",
      content:
        "| Strategy | How It Splits | Best For | Watch Out For |\n|---|---|---|---|\n| **Fixed-size** | Every N tokens with overlap | Uniform docs, fast prototyping | Mid-sentence breaks |\n| **Sentence-based** | Sentence boundaries (. ? !) | Prose, articles, documentation | Run-on sentences |\n| **Paragraph-based** | Double newlines | Structured writing, reports | Wildly varying sizes |\n| **Recursive** | Hierarchy: paragraph → sentence → char | Code, markdown, structured text | More complex implementation |\n| **Semantic** | Embedding similarity drops | Multi-topic documents | High cost, threshold tuning |\n\nThe recursive approach (used by LangChain) tries a hierarchy of separators - first double newlines, then single newlines, then sentences - and only falls back when chunks exceed the maximum size.",
    },
    {
      heading: "Interactive Chunking",
      content:
        "Paste text and experiment with different chunking strategies, sizes, and overlap. Watch how the same document splits differently depending on your configuration.",
      playground: "chunking-playground",
    },
    {
      heading: "Overlap and the Edge Problem",
      content:
        "When you split text at a boundary, context at the edges is lost. Overlap includes text from the previous chunk at the start of the next chunk. Recommended overlap by chunk size: 128 tokens → 20-30 tokens (15-25%), 256 tokens → 30-50 tokens (12-20%), 512 tokens → 50-80 tokens (10-15%).\n\nA better approach: sentence-aware overlap. Instead of overlapping by a fixed token count, overlap by whole sentences. The last 1-2 sentences of chunk N become the first 1-2 sentences of chunk N+1.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Start with 256-512 token chunks with 10-15% overlap. Test different sizes against your actual queries. The best chunking strategy is the one you've measured against your data - there's no universal answer. Content-specific tuning matters: technical docs use heading-based splitting, legal text uses clause-based, code uses AST-aware chunking.",
    },
  ],

  "rag-systems/retrieval-pipeline": [
    {
      heading: "Two Phases",
      content:
        "**Offline (indexing):** Raw documents → chunk → generate embeddings → store in vector database with metadata. This runs once per document (or on updates). Embedding generation is the bottleneck: ~500 texts/sec on GPU.\n\n**Online (querying):** Embed the user's query → retrieve top-K chunks via ANN search → re-rank with a cross-encoder → assemble the prompt with system instructions + retrieved context + user question → send to LLM for generation.",
    },
    {
      heading: "Step Through the Pipeline",
      content:
        "Click through each stage of the offline and online RAG pipeline. The offline phase runs asynchronously when documents change; the online phase runs synchronously for every user query.",
      playground: "rag-pipeline-flow",
    },
    {
      heading: "The Re-Ranking Difference",
      content:
        "The re-ranking step is often the difference between a good and great RAG system. Bi-encoders (used for initial retrieval) encode query and document independently - fast but miss fine-grained interactions. Cross-encoders process the query-document pair together, capturing token-level interactions.\n\n| Model | Type | Latency (10 docs) | Quality |\n|---|---|---|---|\n| all-MiniLM-L6-v2 | Bi-encoder | ~5ms | Baseline |\n| ms-marco-MiniLM | Cross-encoder | ~50ms | Good |\n| Cohere Rerank | API cross-encoder | ~100ms | Production-grade |\n| ColBERT v2 | Late interaction | ~30ms | Good speed/quality |",
    },
    {
      heading: "Key Takeaway",
      content:
        "Retrieve broadly (top 50-100 chunks), re-rank to find the best 3-5 chunks, and only send those to the LLM. This maximizes context quality within the token budget. The pipeline is a funnel: cheap retrieval on many candidates, expensive re-ranking on few.",
    },
  ],

  "rag-systems/rag-evaluation": [
    {
      heading: "The Four Metrics",
      content:
        "RAG evaluation requires measuring both retrieval and generation quality independently:\n\n1. **Context relevance** - are the retrieved chunks actually relevant to the question? Measured by comparing retrieved chunks to gold-standard relevant passages.\n2. **Faithfulness** - does the answer stick to what's in the retrieved context? Checks for hallucinated facts not present in the chunks.\n3. **Answer relevance** - does the answer actually address the question? A faithful answer about the wrong topic is still wrong.\n4. **Chunk utilization** - how much of the retrieved context is actually used? Low utilization means you're wasting tokens on irrelevant chunks.",
    },
    {
      heading: "Evaluation Frameworks",
      content:
        "| Framework | What It Measures | How |\n|---|---|---|\n| **RAGAS** | Faithfulness, answer relevance, context precision/recall | LLM-as-judge with structured rubrics |\n| **TruLens** | Groundedness, relevance, context quality | LLM evaluation + tracing |\n| **Human eval** | Overall quality, correctness, helpfulness | Gold-standard but expensive and slow |\n| **Retrieval metrics** | Recall@K, NDCG@K, MRR | Traditional IR metrics on retrieved chunks |\n\nThe key insight: evaluate retrieval and generation as separate components. If retrieval Recall@5 is low, fix chunking/embedding before touching the prompt. If faithfulness is low, the LLM is hallucinating despite good context - fix the prompt or model.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Evaluate retrieval and generation separately. Bad retrieval + good generation = hallucinated answers that sound confident. Good retrieval + bad generation = wasted context. Build automated evaluation pipelines with 50-100 golden question-answer pairs from your domain.",
    },
  ],

  "rag-systems/advanced-rag": [
    {
      heading: "Four Advanced Patterns",
      content:
        "When basic RAG fails, these patterns address specific failure modes:\n\n1. **HyDE (Hypothetical Document Embeddings)** - generate a hypothetical answer first, then use it as the search query. The hypothetical answer is closer in embedding space to relevant documents than the original short question. Helps when queries are vague.\n\n2. **Multi-query** - rephrase the question 3-5 different ways, retrieve for each variant, deduplicate and union the results. Captures different aspects of ambiguous questions.\n\n3. **Parent-child retrieval** - index small chunks (sentences) for precise matching, but when a match is found, retrieve the parent chunk (full paragraph or section) for context. Best of both worlds: precision in matching + context in generation.\n\n4. **Self-RAG** - the model decides *when* to retrieve (not every query needs it) and *critiques its own answers* for faithfulness. Reduces unnecessary retrieval and catches hallucinations.",
    },
    {
      heading: "When to Use Each Pattern",
      content:
        "| Pattern | Addresses | Complexity | When to Add |\n|---|---|---|---|\n| HyDE | Vague queries, vocabulary mismatch | Low | Queries are short/ambiguous |\n| Multi-query | Complex multi-aspect questions | Low | Single retrieval misses relevant context |\n| Parent-child | Context loss from small chunks | Medium | Answers lack surrounding context |\n| Self-RAG | Unnecessary retrieval, hallucination | High | Need production-grade quality control |\n\nStart with basic RAG, measure performance on your evaluation set, then add patterns one at a time to address specific failure modes you observe.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Don't over-engineer. Start with basic RAG (chunk → embed → retrieve → generate), measure performance, then add advanced patterns to address specific failure modes. Each pattern adds complexity - only add it when you have evidence it helps your use case.",
    },
  ],

  // ─── Series 8: Advanced Search ──────────────────────────────────
  "advanced-search/learning-to-rank": [
    {
      heading: "Three Approaches",
      content:
        "Learning to Rank (LTR) uses machine learning to combine multiple ranking signals into an optimal final ranking. The three paradigms differ in how they frame the training objective:\n\n1. **Pointwise** - predict an absolute relevance score for each document independently. Training: regression or classification on (query, doc, label) triples. Simple but ignores relative ordering.\n\n2. **Pairwise** - predict which of two documents is more relevant. Training: binary classification on (query, doc_a, doc_b, which_is_better). RankNet, LambdaRank, and LambdaMART use this approach.\n\n3. **Listwise** - optimize the entire ranking list directly, typically optimizing NDCG. Training: directly optimize the ranking metric. ListNet, ApproxNDCG, and SoftRank fall in this category.\n\n| Approach | Training Signal | Models | Best For |\n|---|---|---|---|\n| Pointwise | Absolute labels per doc | Regression, neural net | Simple baselines |\n| Pairwise | Relative preference | LambdaMART, RankNet | Production systems |\n| Listwise | Full ranking list | ListNet, ApproxNDCG | Maximum ranking quality |",
    },
    {
      heading: "Feature Engineering for LTR",
      content:
        "The features fed to an LTR model determine its ceiling. Common feature categories:\n\n| Category | Features | Signal |\n|---|---|---|\n| Text relevance | BM25 score, vector similarity, query-title overlap | How well the doc matches the query |\n| Popularity | CTR, conversion rate, view count | Collective wisdom |\n| Quality | Rating, review count, return rate | Customer satisfaction |\n| Freshness | Days since listing, last price change | Recency |\n| Commercial | Price vs category avg, margin, stock | Business value |\n| Personalization | Brand affinity, price sensitivity | Per-user relevance |",
    },
    {
      heading: "Key Takeaway",
      content:
        "LTR requires training data (typically from click logs - 10K+ queries with clicks). Start with pairwise approaches (LambdaMART is the industry workhorse). Use XGBoost or LightGBM for gradient-boosted trees. The features matter more than the model - invest in feature engineering before model complexity.",
    },
  ],

  "advanced-search/click-models": [
    {
      heading: "The Position Bias Problem",
      content:
        "Users click position 1 far more than position 5, regardless of relevance. A study by Joachims et al. showed that swapping two results changed click patterns based on position, not content. Raw click-through rates are contaminated by this position bias.\n\nThe core issue: if you train a ranking model on raw CTR, it learns \"position 1 is good\" rather than \"this document is relevant.\" You need to debias clicks before using them as training signal.\n\nPosition bias follows a roughly logarithmic decay: P(examine position k) ≈ 1/log₂(k+1). Position 1 gets examined 100% of the time, position 5 about 39%, position 10 about 29%.",
    },
    {
      heading: "Click Debiasing",
      content:
        "Adjust the top-5 raw CTR values using position bias correction and see how the debiased relevance scores change. The debiased CTR = raw CTR / position_bias(k) reveals the true relevance signal hidden under position effects.",
      playground: "click-debiaser",
    },
    {
      heading: "Click Model Types",
      content:
        "| Model | Assumption | Complexity |\n|---|---|---|\n| **Position model** | P(click) = P(examine) × P(attract) | Low - just divide by position bias |\n| **Cascade model** | User scans top-down, clicks first relevant result, stops | Medium - models sequential examination |\n| **DBN (Dynamic Bayesian Network)** | User may continue scanning after a click if not satisfied | High - models satisfaction and continuation |\n| **Neural click model** | Learn examination and attractiveness jointly with deep learning | Highest - captures complex patterns |\n\nThe simplest approach (inverse propensity weighting) divides each click by the examination probability for that position. More sophisticated models jointly estimate relevance and position bias.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Never use raw CTR as a relevance signal - it's position-biased. Use debiased CTR (divide by position examination probability) or train a cascade click model. Combine implicit signals (debiased clicks, dwell time, scroll depth) with sparse explicit signals (ratings, purchases) for the best training data.",
    },
  ],

  "advanced-search/personalization": [
    {
      heading: "Three Personalization Approaches",
      content:
        "Personalization tailors search results to individual users, improving relevance for ambiguous queries:\n\n1. **Profile boosting** - boost results matching user preferences. Track preferred brands, categories, and price ranges from past behavior. Score: base_score + Σ(preference_weight × match_score).\n\n2. **Collaborative filtering** - \"users like you also searched for...\" Build user-user or item-item similarity matrices. When user A's profile is similar to user B's, surface items B engaged with.\n\n3. **Contextual personalization** - time of day (morning → coffee, evening → dinner), device (mobile → local results), location (geo-boost nearby items), session history (3 blue shirts clicked → boost blue).\n\n| Signal | Collection Method | Ranking Use | Privacy Risk |\n|---|---|---|---|\n| Browse history | Page views, click events | Boost preferred categories/brands | Medium |\n| Purchase history | Order events | Complementary products, price range | Medium |\n| Collaborative | User similarity matrix | Cohort-based recommendations | Low |\n| Real-time session | Current session clicks | Immediate intent signals | Low |",
    },
    {
      heading: "The Filter Bubble Problem",
      content:
        "Over-personalization creates filter bubbles: users only see content matching their past behavior, missing new interests and serendipitous discoveries. The antidote is balancing personalization with diversity.\n\nStrategies: apply personalization only to the top 50% of results, keep exploratory results in positions 6-10, cap the maximum personalization boost at 30% of the base score, decay preference weights over time (interests change), and expose all users to some unpersonalized baseline results.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Personalization improves relevance but creates filter bubbles. Always balance personalization with diversity. A good rule: personalize within the top results, keep exploratory results in the mix. Measure personalization impact via A/B tests on CTR and conversion, but also monitor diversity metrics.",
    },
  ],

  "advanced-search/autocomplete": [
    {
      heading: "The Trie Data Structure",
      content:
        "A trie (prefix tree) is the backbone of autocomplete. Each node represents a character; paths from root to nodes spell out prefixes. To find suggestions for \"pyt\", traverse to the p→y→t node and collect all completions below it, ranked by popularity.\n\nTries provide O(L) lookup where L is the prefix length - independent of the dictionary size. With millions of terms, this is critical for the <50ms latency requirement.",
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
      heading: "Interactive Trie",
      content:
        "Type a prefix and watch the trie find matching completions ranked by popularity. The trie is pre-loaded with common search terms.",
      playground: "autocomplete-trie",
    },
    {
      heading: "Production Autocomplete Architecture",
      content:
        "In production, autocomplete combines multiple data sources:\n\n| Source | Weight | Example |\n|---|---|---|\n| Popular queries | High | Past search logs ranked by frequency |\n| Product titles | Medium | Direct matches from the catalog |\n| Category suggestions | Medium | \"Electronics\", \"Kitchen\" |\n| Recent user queries | Low | Personalized history |\n\nCache aggressively: the same prefixes are queried repeatedly. Top-100 prefixes account for ~30% of autocomplete traffic (Zipf's law). Use Redis sorted sets for fast prefix + popularity lookups. Add fuzzy matching for typo tolerance (edit distance 1).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Autocomplete must be fast (<50ms) because it runs on every keystroke. Use a trie for prefix matching, rank by popularity/recency, add fuzzy matching for typo tolerance, and cache aggressively. The autocomplete experience is often the first impression of your search quality.",
    },
  ],

  "advanced-search/search-diversity": [
    {
      heading: "The Jaguar Problem",
      content:
        "Search \"jaguar\" - do you mean the car, the animal, the Jacksonville NFL team, or the macOS version? Without diversity, all 10 results might be about the car (most popular meaning). Diversity ensures coverage across intents, giving every interpretation a fair representation on the first page.\n\nDiversity is especially critical for: ambiguous queries (multiple meanings), eCommerce (show variety of brands, price points, categories), news (multiple perspectives on an event), and recommendations (avoid showing the same type of item repeatedly).",
    },
    {
      heading: "Maximal Marginal Relevance (MMR)",
      content:
        "MMR is the most widely used diversity algorithm. It builds the result list greedily: at each step, pick the document that's most relevant to the query but least similar to what you've already selected.\n\nThe formula: MMR(d) = λ × relevance(d, query) - (1-λ) × max_similarity(d, selected_docs)\n\nλ controls the relevance-diversity trade-off: λ = 1.0 → pure relevance (no diversity), λ = 0.5 → balanced, λ = 0.0 → maximum diversity (ignore relevance). Drag the slider to see how changing λ reshuffles the ranked list.",
      playground: "mmr-diversity",
    },
    {
      heading: "Beyond MMR",
      content:
        "| Method | Approach | Best For |\n|---|---|---|\n| **MMR** | Greedy relevance-diversity balance | General search, RAG |\n| **xQuAD** | Explicitly model sub-topics | Ambiguous queries |\n| **PM-2** | Proportional representation of intents | Multi-intent queries |\n| **Category diversification** | Ensure top-K has ≤2 results per category | eCommerce |\n| **DPP (Determinantal Point Process)** | Probabilistic diversity | Recommendations |\n\nFor eCommerce, also diversify by brand (≤3 from same brand in top 10), price range (mix of budget and premium), and seller (prevent one seller from dominating).",
    },
    {
      heading: "Key Takeaway",
      content:
        "Diversity matters most for ambiguous queries. Use MMR as a simple, effective default. Set λ between 0.5-0.7 for a good balance. Measure diversity alongside relevance: a perfectly relevant but homogeneous result page is a bad user experience.",
    },
  ],
};

