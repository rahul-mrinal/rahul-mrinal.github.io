import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

const DOCS = [
  "Machine learning is a subset of artificial intelligence",
  "Deep learning algorithms use neural networks for machine learning tasks",
  "A comprehensive intro covering machine learning machine learning machine learning algorithms algorithms algorithms and more machine learning",
  "Statistical algorithms for data analysis",
  "Python machine learning with scikit-learn: practical algorithms for classification",
];

function tfidf(query: string, doc: string[], corpus: string[][]) {
  const N = corpus.length;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of terms) {
    const tf = doc.filter((w) => w === t).length;
    const df = corpus.filter((d) => d.includes(t)).length;
    if (df === 0) continue;
    score += tf * Math.log(N / df);
  }
  return score;
}

function bm25(query: string, doc: string[], corpus: string[][], k1: number, b: number) {
  const N = corpus.length;
  const avgdl = corpus.reduce((s, d) => s + d.length, 0) / N;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of terms) {
    const tf = doc.filter((w) => w === t).length;
    const df = corpus.filter((d) => d.includes(t)).length;
    if (df === 0) continue;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    score += (idf * tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * doc.length) / avgdl));
  }
  return score;
}

export default function TfIdfVsBm25Compare() {
  const [k1, setK1] = useState(1.2);
  const [b, setB] = useState(0.75);
  const query = "machine learning algorithms";

  const corpus = useMemo(() => DOCS.map((d) => d.toLowerCase().split(/\s+/)), []);

  const results = useMemo(() => {
    const tfidfScores = DOCS.map((_, i) => ({ i, score: tfidf(query, corpus[i], corpus) })).sort((a, c) => c.score - a.score);
    const bm25Scores = DOCS.map((_, i) => ({ i, score: bm25(query, corpus[i], corpus, k1, b) })).sort((a, c) => c.score - a.score);
    return { tfidfScores, bm25Scores };
  }, [k1, b, corpus]);

  const chartData = useMemo(() => {
    const idf = Math.log(DOCS.length / 3 + 1);
    const labels: number[] = [];
    const tfidfVals: number[] = [];
    const bm25Vals: number[] = [];
    for (let tf = 0; tf <= 30; tf++) {
      labels.push(tf);
      tfidfVals.push(tf * idf);
      bm25Vals.push(idf * (tf * (k1 + 1)) / (tf + k1));
    }
    return {
      labels,
      datasets: [
        { label: "TF-IDF", data: tfidfVals, borderColor: CHART_COLORS.accent, fill: false, tension: 0.2, pointRadius: 0, borderWidth: 2.5 },
        { label: "BM25", data: bm25Vals, borderColor: CHART_COLORS.teal, fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
      ],
    };
  }, [k1]);

  const options = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { display: true, labels: { color: CHART_COLORS.text, usePointStyle: true, pointStyle: "line" as const } } },
    scales: {
      x: { ...CHART_DEFAULTS.scales.x, title: { display: true, text: "Term Frequency", color: CHART_COLORS.text } },
      y: { ...CHART_DEFAULTS.scales.y, min: 0, title: { display: true, text: "Score", color: CHART_COLORS.text } },
    },
  };

  const renderCol = (items: { i: number; score: number }[], color: string) =>
    items.map((r, rank) => (
      <div key={r.i} className="flex items-center gap-2 text-xs mb-1">
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{ background: color, color: "#fff" }}>{rank + 1}</span>
        <span className="flex-1 text-text-secondary truncate">{DOCS[r.i].slice(0, 50)}...</span>
        <span className="font-mono shrink-0" style={{ color }}>{r.score.toFixed(2)}</span>
      </div>
    ));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            k₁ = <span className="text-accent font-mono">{k1.toFixed(1)}</span>
          </label>
          <input type="range" min={0.5} max={3} step={0.1} value={k1}
            onChange={(e) => setK1(parseFloat(e.target.value))} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            b = <span className="text-accent font-mono">{b.toFixed(2)}</span>
          </label>
          <input type="range" min={0} max={1} step={0.05} value={b}
            onChange={(e) => setB(parseFloat(e.target.value))} className="w-full accent-[#6c63ff]" />
        </div>
      </div>
      <div className="rounded-lg bg-[#0d0e14] p-4 border border-border mb-4">
        <Line data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-accent mb-2">TF-IDF Rankings</h4>
          {renderCol(results.tfidfScores, "#6c63ff")}
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#00c9a7] mb-2">BM25 Rankings</h4>
          {renderCol(results.bm25Scores, "#00c9a7")}
        </div>
      </div>
    </div>
  );
}
