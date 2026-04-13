import { useState, useMemo } from "react";
import "../ChartTheme";

interface Doc { id: string; category: string; relevance: number; color: string }

const DOCS: Doc[] = [
  { id: "A1", category: "Cars", relevance: 0.95, color: "#6c63ff" },
  { id: "A2", category: "Cars", relevance: 0.90, color: "#6c63ff" },
  { id: "A3", category: "Cars", relevance: 0.85, color: "#6c63ff" },
  { id: "B1", category: "Animal", relevance: 0.80, color: "#00c9a7" },
  { id: "B2", category: "Animal", relevance: 0.70, color: "#00c9a7" },
  { id: "C1", category: "NFL Team", relevance: 0.65, color: "#ffd93d" },
  { id: "C2", category: "NFL Team", relevance: 0.55, color: "#ffd93d" },
  { id: "D1", category: "macOS", relevance: 0.50, color: "#ff6b6b" },
];

function similarity(a: Doc, b: Doc): number {
  return a.category === b.category ? 0.9 : 0.1;
}

function mmrRerank(docs: Doc[], lambda: number, k: number): Doc[] {
  const selected: Doc[] = [];
  const remaining = [...docs];
  for (let i = 0; i < Math.min(k, docs.length); i++) {
    let bestIdx = 0;
    let bestScore = -Infinity;
    for (let j = 0; j < remaining.length; j++) {
      const rel = remaining[j].relevance;
      const maxSim = selected.length === 0 ? 0 : Math.max(...selected.map((s) => similarity(remaining[j], s)));
      const score = lambda * rel - (1 - lambda) * maxSim;
      if (score > bestScore) { bestScore = score; bestIdx = j; }
    }
    selected.push(remaining.splice(bestIdx, 1)[0]);
  }
  return selected;
}

export default function MmrDiversity() {
  const [lambda, setLambda] = useState(0.5);
  const ranked = useMemo(() => mmrRerank(DOCS, lambda, 6), [lambda]);

  return (
    <div>
      <div className="mb-4">
        <label className="text-xs font-medium text-text-secondary">
          λ = <span className="text-accent font-mono">{lambda.toFixed(2)}</span>
          <span className="text-text-secondary ml-2">
            ({lambda >= 0.8 ? "relevance-heavy" : lambda <= 0.3 ? "diversity-heavy" : "balanced"})
          </span>
        </label>
        <input type="range" min={0} max={1} step={0.05} value={lambda}
          onChange={(e) => setLambda(+e.target.value)} className="w-full accent-[#6c63ff]" />
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>Diversity</span><span>Relevance</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {ranked.map((d, i) => (
          <div key={d.id} className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-2.5">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: d.color }}>
              {i + 1}
            </span>
            <span className="text-sm font-mono text-white w-8">{d.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: d.color, color: d.color }}>
              {d.category}
            </span>
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${d.relevance * 100}%`, background: d.color }} />
            </div>
            <span className="text-xs font-mono text-text-secondary w-10 text-right">{d.relevance.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-3 flex-wrap">
        {["Cars", "Animal", "NFL Team", "macOS"].map((cat, i) => {
          const count = ranked.filter((d) => d.category === cat).length;
          const c = [DOCS[0], DOCS[3], DOCS[5], DOCS[7]][i].color;
          return (
            <span key={cat} className="text-[10px] font-mono" style={{ color: c }}>
              {cat}: {count}/{ranked.length}
            </span>
          );
        })}
      </div>
    </div>
  );
}
