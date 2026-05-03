import { useState, useMemo } from "react";
import "../ChartTheme";

const DEFAULT_DOCS = [
  "Machine learning is a subset of artificial intelligence that focuses on algorithms",
  "Deep learning algorithms use neural networks for machine learning tasks",
  "Introduction to machine learning: supervised and unsupervised learning algorithms explained with examples of machine learning algorithms in practice",
  "Statistical algorithms for data analysis and machine learning",
  "The history of artificial intelligence and expert systems",
  "Python programming for web development and automation",
  "Advanced machine learning algorithms including random forests and gradient boosting machines",
];

function bm25Score(
  queryTerms: string[],
  doc: string[],
  corpus: string[][],
  k1: number,
  b: number
): number {
  const N = corpus.length;
  const avgdl = corpus.reduce((s, d) => s + d.length, 0) / N;
  let score = 0;
  for (const term of queryTerms) {
    const df = corpus.filter((d) => d.includes(term)).length;
    if (df === 0) continue;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    const f = doc.filter((w) => w === term).length;
    const num = f * (k1 + 1);
    const den = f + k1 * (1 - b + (b * doc.length) / avgdl);
    score += (idf * num) / den;
  }
  return score;
}

function highlight(text: string, terms: string[]): string {
  let result = text;
  for (const t of terms) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    result = result.replace(re, "**$1**");
  }
  return result;
}

export default function Bm25Calculator() {
  const [query, setQuery] = useState("machine learning algorithms");
  const [docsText, setDocsText] = useState(DEFAULT_DOCS.join("\n"));
  const [k1, setK1] = useState(1.2);
  const [b, setB] = useState(0.75);

  const ranked = useMemo(() => {
    const docs = docsText.split("\n").filter(Boolean);
    const corpus = docs.map((d) => d.toLowerCase().split(/\s+/));
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return docs
      .map((text, i) => ({
        text,
        score: bm25Score(queryTerms, corpus[i], corpus, k1, b),
      }))
      .sort((a, bv) => bv.score - a.score);
  }, [query, docsText, k1, b]);
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return (
    <div>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono"
            placeholder='e.g. "machine learning algorithms"'
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">
            Documents (one per line)
          </label>
          <textarea
            value={docsText}
            onChange={(e) => setDocsText(e.target.value)}
            rows={5}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono resize-y"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            k₁ = <span className="text-accent font-mono">{k1.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={k1}
            onChange={(e) => setK1(parseFloat(e.target.value))}
            className="w-full accent-[#6c63ff]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            b = <span className="text-accent font-mono">{b.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-[#6c63ff]"
          />
        </div>
      </div>

      <div className="space-y-2">
        {ranked.map((r: { text: string; score: number }, i: number) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-3"
          >
            <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-text-secondary min-w-0">
              {highlight(r.text, queryTerms).split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <mark key={j} className="bg-accent/20 text-accent px-0.5 rounded">
                    {part}
                  </mark>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </span>
            <span className="text-xs font-mono text-accent shrink-0">
              {r.score.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
