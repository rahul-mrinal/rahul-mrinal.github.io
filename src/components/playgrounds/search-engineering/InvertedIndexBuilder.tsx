import { useState, useMemo } from "react";

const STOP_WORDS = new Set([
  "the","a","an","is","on","and","are","in","of","to","it","for","with","at","by",
  "this","that","from","or","was","were","be","been","has","have","had","do","does",
]);

export default function InvertedIndexBuilder() {
  const [docs, setDocs] = useState("The cat sat on the mat\nThe dog chased the cat\nThe cat and the dog are friends");
  const [showPos, setShowPos] = useState(false);
  const [removeStops, setRemoveStops] = useState(false);

  const { index, stats } = useMemo(() => {
    const lines = docs.split("\n").filter((l) => l.trim());
    const idx: Record<string, { docs: Record<number, { count: number; positions: number[] }> }> = {};
    let totalTokens = 0;
    lines.forEach((line, di) => {
      const tokens = line.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
      tokens.forEach((token, pos) => {
        if (removeStops && STOP_WORDS.has(token)) return;
        totalTokens++;
        if (!idx[token]) idx[token] = { docs: {} };
        if (!idx[token].docs[di]) idx[token].docs[di] = { count: 0, positions: [] };
        idx[token].docs[di].count++;
        idx[token].docs[di].positions.push(pos);
      });
    });
    const sorted = Object.entries(idx).sort(
      (a, b) => Object.keys(b[1].docs).length - Object.keys(a[1].docs).length || a[0].localeCompare(b[0])
    );
    return {
      index: sorted,
      stats: { docs: lines.length, terms: sorted.length, tokens: totalTokens,
        avgPL: sorted.length ? (sorted.reduce((s, e) => s + Object.keys(e[1].docs).length, 0) / sorted.length).toFixed(1) : "0" },
    };
  }, [docs, showPos, removeStops]);

  return (
    <div>
      <label className="text-xs font-semibold text-text-secondary block mb-1">Documents (one per line)</label>
      <textarea value={docs} onChange={(e) => setDocs(e.target.value)} rows={4}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono resize-y mb-2" />
      <div className="flex flex-wrap gap-4 mb-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary">
          <input type="checkbox" checked={showPos} onChange={(e) => setShowPos(e.target.checked)} className="accent-[#6c63ff]" />
          Show positions
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary">
          <input type="checkbox" checked={removeStops} onChange={(e) => setRemoveStops(e.target.checked)} className="accent-[#6c63ff]" />
          Remove stop words
        </label>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3 text-center">
        {[["Docs", stats.docs], ["Terms", stats.terms], ["Tokens", stats.tokens], ["Avg PL", stats.avgPL]].map(([l, v]) => (
          <div key={String(l)} className="bg-[#0d0e14] border border-border rounded-lg py-2">
            <div className="text-[10px] text-text-secondary uppercase">{l}</div>
            <div className="text-accent font-mono font-bold">{v}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {index.map(([term, data]) => (
          <div key={term} className="flex items-center gap-2 bg-[#0d0e14] border border-border rounded px-3 py-1.5 text-xs font-mono">
            <span className="text-accent font-bold min-w-[70px]">{term}</span>
            <span className="text-text-secondary">→</span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(data.docs).map(([di, info]) => (
                <span key={di} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                  D{Number(di) + 1}<span className="text-teal-400 ml-1">tf:{info.count}</span>
                  {showPos && <span className="text-text-secondary ml-1">[{info.positions.join(",")}]</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
