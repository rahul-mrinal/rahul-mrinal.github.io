import { useState, useCallback } from "react";
import "../ChartTheme";

const SYNONYMS: Record<string, string[]> = {
  cat: ["kitten","feline"], kitten: ["cat","feline"], dog: ["puppy","canine"],
  puppy: ["dog","canine"], car: ["automobile","vehicle"], automobile: ["car","vehicle"],
  happy: ["glad","joyful"], sad: ["unhappy","sorrowful"], big: ["large","huge"],
  small: ["tiny","little"], fast: ["quick","rapid"], sat: ["resting","sitting"],
  mat: ["rug","carpet"], rug: ["mat","carpet"], machine: ["computer","automated"],
  learning: ["training","studying"], house: ["home","dwelling"], home: ["house","dwelling"],
};

function tokenize(s: string) {
  return s.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
}

// Expand each token with its synonyms so synonym pairs share vocabulary
function expand(tokens: string[]): string[] {
  const out = [...tokens];
  tokens.forEach((w) => (SYNONYMS[w] ?? []).forEach((syn) => out.push(syn)));
  return out;
}

// Build a term-frequency vector over a shared vocabulary
function tfVector(tokens: string[], vocab: string[]): number[] {
  const freq: Record<string, number> = {};
  tokens.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1; });
  return vocab.map((v) => freq[v] ?? 0);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export default function CosineSimilarity() {
  const [sentA, setSentA] = useState("The cat sat on the mat");
  const [sentB, setSentB] = useState("A kitten was resting on a rug");
  const [result, setResult] = useState<{ score: number; exact: number; syn: number } | null>(null);

  const compute = useCallback(() => {
    const tokA = tokenize(sentA);
    const tokB = tokenize(sentB);

    const expA = expand(tokA);
    const expB = expand(tokB);

    // Shared vocabulary = union of all expanded tokens
    const vocab = [...new Set([...expA, ...expB])];

    const vecA = tfVector(expA, vocab);
    const vecB = tfVector(expB, vocab);

    const score = cosineSimilarity(vecA, vecB);

    // Count exact token overlaps (original tokens, for display)
    const setB = new Set(tokB);
    const exact = tokA.filter((w) => setB.has(w)).length;
    const synCount = tokA.filter(
      (w) => (SYNONYMS[w] ?? []).some((s) => setB.has(s))
    ).length;

    setResult({ score, exact, syn: synCount });
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
            <span className="text-xs text-text-secondary">Cosine Similarity (bag-of-words + synonyms)</span>
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
