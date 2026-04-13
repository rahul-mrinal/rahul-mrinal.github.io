import { useState, useMemo } from "react";

const DOCS = [
  { title: "Machine Learning Tutorial for Beginners", body: "Covers supervised and unsupervised learning with practical examples.", tags: ["machine learning", "tutorial", "python"] },
  { title: "Advanced Neural Network Architectures", body: "Deep dive into CNNs, RNNs. A complete machine learning tutorial covering models.", tags: ["deep learning", "neural networks"] },
  { title: "Python Programming Basics", body: "Learn Python from scratch. Includes a section on machine learning libraries.", tags: ["python", "tutorial", "programming"] },
  { title: "Machine Learning in Production", body: "How to deploy ML models. Covers MLOps and CI/CD pipelines.", tags: ["machine learning", "mlops"] },
  { title: "Data Science Tutorial: Complete Roadmap", body: "Step-by-step tutorial covering statistics and machine learning.", tags: ["data science", "tutorial", "machine learning"] },
  { title: "Statistics for Machine Learning", body: "Probability, distributions, hypothesis testing for machine learning. Tutorial included.", tags: ["statistics", "machine learning", "tutorial"] },
];

function termHits(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.reduce((n, t) => n + (lower.includes(t) ? 1 : 0), 0);
}

export default function FieldBoostPlayground() {
  const [query, setQuery] = useState("machine learning tutorial");
  const [wTitle, setWTitle] = useState(3.0);
  const [wBody, setWBody] = useState(1.0);
  const [wTags, setWTags] = useState(2.0);

  const ranked = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return DOCS.map((d, i) => {
      const tH = termHits(d.title, terms), bH = termHits(d.body, terms), gH = termHits(d.tags.join(" "), terms);
      return { ...d, i, tS: tH * wTitle, bS: bH * wBody, gS: gH * wTags, total: tH * wTitle + bH * wBody + gH * wTags };
    }).sort((a, b) => b.total - a.total);
  }, [query, wTitle, wBody, wTags]);

  return (
    <div>
      <label className="text-xs font-semibold text-text-secondary block mb-1">Query</label>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono mb-3" />
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Title", val: wTitle, set: setWTitle },
          { label: "Body", val: wBody, set: setWBody },
          { label: "Tags", val: wTags, set: setWTags },
        ].map((s) => (
          <div key={s.label}>
            <label className="text-xs font-medium text-text-secondary flex justify-between">
              <span>{s.label}</span><span className="text-accent font-mono">{s.val.toFixed(1)}</span>
            </label>
            <input type="range" min={0} max={10} step={0.5} value={s.val}
              onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full accent-[#6c63ff]" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {ranked.map((r, rank) => (
          <div key={r.i} className={`bg-[#0d0e14] border rounded-lg px-4 py-3 relative ${rank === 0 ? "border-teal-500/50" : "border-border"}`}>
            <span className={`absolute -top-2 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${rank === 0 ? "bg-teal-500" : "bg-accent"}`}>
              #{rank + 1}
            </span>
            <span className="absolute top-3 right-4 text-accent font-mono font-bold text-sm">{r.total.toFixed(1)}</span>
            <div className="text-sm font-semibold text-white mb-0.5">{r.title}</div>
            <div className="text-xs text-text-secondary mb-1">{r.body}</div>
            <div className="text-[10px] font-mono text-text-secondary">
              <span className="text-accent">title:{r.tS.toFixed(1)}</span>{" + "}
              <span className="text-teal-400">body:{r.bS.toFixed(1)}</span>{" + "}
              <span className="text-yellow-400">tags:{r.gS.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
