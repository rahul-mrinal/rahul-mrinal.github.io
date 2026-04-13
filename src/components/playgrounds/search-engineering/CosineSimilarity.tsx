import { useState, useCallback } from "react";
import "../ChartTheme";

const STOPWORDS = new Set([
  "the","a","an","is","was","were","are","on","in","at","to","for","of","and",
  "or","but","it","this","that","with","from","by","as","be","has","had","have",
]);

const SYNONYMS: Record<string, string[]> = {
  cat: ["kitten","feline"], kitten: ["cat","feline"], dog: ["puppy","canine"],
  puppy: ["dog","canine"], car: ["automobile","vehicle"], automobile: ["car","vehicle"],
  happy: ["glad","joyful"], sad: ["unhappy","sorrowful"], big: ["large","huge"],
  small: ["tiny","little"], fast: ["quick","rapid"], sat: ["resting","sitting"],
  mat: ["rug","carpet"], rug: ["mat","carpet"], machine: ["computer","automated"],
  learning: ["training","studying"], house: ["home","dwelling"], home: ["house","dwelling"],
};

function stem(w: string) {
  if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
  if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) return w.slice(0, -1);
  return w;
}

export default function CosineSimilarity() {
  const [sentA, setSentA] = useState("The cat sat on the mat");
  const [sentB, setSentB] = useState("A kitten was resting on a rug");
  const [result, setResult] = useState<{ score: number; exact: number; syn: number } | null>(null);

  const compute = useCallback(() => {
    const tokenize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    const meaningful = (t: string[]) => t.filter((w) => !STOPWORDS.has(w));
    const mA = meaningful(tokenize(sentA));
    const mB = meaningful(tokenize(sentB));
    const setB = new Set(mB);
    const setBStem = new Set(mB.map(stem));

    let exact = 0;
    mA.forEach((w) => { if (setB.has(w)) exact++; });

    let stemExtra = 0;
    mA.map(stem).forEach((w) => { if (setBStem.has(w)) stemExtra++; });
    stemExtra = Math.max(0, stemExtra - exact);

    let syn = 0;
    mA.forEach((wa) => {
      (SYNONYMS[wa] || []).forEach((s) => { if (setB.has(s)) syn++; });
    });
    syn = Math.min(syn, mA.length);

    const max = Math.max(mA.length, mB.length, 1);
    const lenSim = 1 - Math.abs(mA.length - mB.length) / max;
    let score = (exact / max) * 0.45 + (stemExtra / max) * 0.2 + (syn / max) * 0.25 + lenSim * 0.1;
    score = Math.max(0.02, Math.min(0.98, score));
    setResult({ score, exact, syn });
  }, [sentA, sentB]);

  const color = result
    ? result.score >= 0.6 ? "text-[#00c9a7]" : result.score >= 0.3 ? "text-[#ffd93d]" : "text-[#ff6b6b]"
    : "";

  return (
    <div>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Sentence A</label>
          <input type="text" value={sentA} onChange={(e) => setSentA(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Sentence B</label>
          <input type="text" value={sentB} onChange={(e) => setSentB(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
      </div>
      <button onClick={compute}
        className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition mb-4">
        Compute Similarity
      </button>
      {result && (
        <div className="bg-[#0d0e14] border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Simulated Cosine Similarity</span>
            <span className={`text-2xl font-bold font-mono ${color}`}>{result.score.toFixed(3)}</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${result.score * 100}%` }} />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Exact: {result.exact} &bull; Synonym: {result.syn.toFixed(0)}
          </p>
        </div>
      )}
    </div>
  );
}
