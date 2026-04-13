import { useState, useMemo } from "react";
import "../ChartTheme";

const DOCS = [
  "Machine learning is a subset of artificial intelligence",
  "Deep learning algorithms use neural networks",
  "Python programming for web development",
  "Natural language processing with transformers",
  "Statistical learning and data analysis",
  "Database optimization and indexing strategies",
  "Computer vision with convolutional networks",
  "Reinforcement learning for game playing",
];

function highlight(text: string, terms: string[]) {
  let result = text;
  for (const t of terms) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    result = result.replace(re, "**$1**");
  }
  return result;
}

export default function BruteForceSearch() {
  const [query, setQuery] = useState("neural networks");

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return DOCS.map((text) => ({ text, score: 0 }));
    return DOCS.map((text) => {
      const lower = text.toLowerCase();
      const score = terms.reduce((s, t) => s + (lower.includes(t) ? 1 : 0), 0);
      return { text, score };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return (
    <div>
      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1">Query</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono"
          placeholder="e.g. neural networks"
        />
      </div>
      <div className="space-y-2">
        {results.length === 0 && (
          <p className="text-xs text-text-secondary italic">No matches found.</p>
        )}
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-3"
          >
            <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-text-secondary min-w-0">
              {highlight(r.text, terms).split("**").map((part, j) =>
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
              {r.score} hit{r.score !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
