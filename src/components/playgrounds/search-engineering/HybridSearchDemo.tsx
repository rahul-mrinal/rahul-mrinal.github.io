import { useState, useMemo } from "react";
import "../ChartTheme";

const DOCS = [
  { name: 'Python machine learning tutorial',    bm25: 0.92, vec: 0.55 },
  { name: 'ML algorithms with code examples',    bm25: 0.30, vec: 0.88 },
  { name: 'Python ML: scikit-learn guide',       bm25: 0.85, vec: 0.82 },
  { name: 'Deep learning fundamentals',          bm25: 0.10, vec: 0.75 },
  { name: 'Python data structures',              bm25: 0.60, vec: 0.20 },
  { name: 'Intro to neural networks',            bm25: 0.15, vec: 0.70 },
];

function rrfScore(bm25Rank: number | null, vecRank: number | null, k = 60) {
  let s = 0;
  if (bm25Rank !== null) s += 1 / (k + bm25Rank + 1);
  if (vecRank !== null) s += 1 / (k + vecRank + 1);
  return s;
}

export default function HybridSearchDemo() {
  const [alpha, setAlpha] = useState(0.5);

  const bm25Ranked = useMemo(() => [...DOCS].sort((a, b) => b.bm25 - a.bm25), []);
  const vecRanked = useMemo(() => [...DOCS].sort((a, b) => b.vec - a.vec), []);

  const fused = useMemo(() => {
    const bm25Map = new Map(bm25Ranked.map((d, i) => [d.name, i]));
    const vecMap = new Map(vecRanked.map((d, i) => [d.name, i]));
    return DOCS.map((d) => ({
      ...d,
      weighted: alpha * d.bm25 + (1 - alpha) * d.vec,
      rrf: rrfScore(bm25Map.get(d.name)!, vecMap.get(d.name)!),
    })).sort((a, b) => b.weighted - a.weighted);
  }, [alpha, bm25Ranked, vecRanked]);

  const renderList = (items: typeof DOCS, scoreKey: "bm25" | "vec", color: string) => (
    <div className="space-y-1">
      {items.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2 text-xs">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: color, color: "#fff" }}>{i + 1}</span>
          <span className="flex-1 text-text-secondary truncate">{d.name}</span>
          <span className="font-mono shrink-0" style={{ color }}>{d[scoreKey].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-text-secondary whitespace-nowrap">
          &alpha; = <span className="text-accent font-mono">{alpha.toFixed(2)}</span>
        </label>
        <input type="range" min={0} max={1} step={0.05} value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
          className="flex-1 accent-[#6c63ff]" />
      </div>
      <p className="text-xs text-text-secondary mb-3">
        BM25 weight: <span className="text-accent font-mono">{alpha.toFixed(2)}</span> &bull;
        Vector weight: <span className="text-[#00c9a7] font-mono">{(1 - alpha).toFixed(2)}</span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <h4 className="text-xs font-bold text-accent mb-2">BM25</h4>
          {renderList(bm25Ranked, "bm25", "#6c63ff")}
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#00c9a7] mb-2">Vector</h4>
          {renderList(vecRanked, "vec", "#00c9a7")}
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#ffd93d] mb-2">Fused</h4>
          <div className="space-y-1">
            {fused.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#ffd93d] text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-text-secondary truncate">{d.name}</span>
                <span className="font-mono text-[#ffd93d] shrink-0">{d.weighted.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
