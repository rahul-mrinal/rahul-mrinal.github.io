import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

function minMaxNorm(arr: number[]) {
  const mn = Math.min(...arr), mx = Math.max(...arr);
  if (mx === mn) return arr.map(() => 0.5);
  return arr.map((v) => (v - mn) / (mx - mn));
}

export default function ScoreNormalizer() {
  const [bm25Raw, setBm25Raw] = useState("14.2, 8.7, 3.1, 19.6, 11.0, 6.4");
  const [vecRaw, setVecRaw] = useState("0.91, 0.45, 0.88, 0.32, 0.76, 0.95");
  const [alpha, setAlpha] = useState(0.5);

  const { normB, normV, fused, labels } = useMemo(() => {
    const b = bm25Raw.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    const v = vecRaw.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    const len = Math.min(b.length, v.length);
    const bs = b.slice(0, len), vs = v.slice(0, len);
    const normB = minMaxNorm(bs), normV = minMaxNorm(vs);
    const fused = normB.map((nb, i) => alpha * nb + (1 - alpha) * normV[i]);
    return { normB, normV, fused, labels: bs.map((_, i) => `Doc ${i + 1}`) };
  }, [bm25Raw, vecRaw, alpha]);

  const chartData = {
    labels,
    datasets: [
      { label: "Norm BM25", data: normB, backgroundColor: "rgba(108,99,255,0.6)", borderRadius: 4 },
      { label: "Norm Vector", data: normV, backgroundColor: "rgba(0,201,167,0.6)", borderRadius: 4 },
      { label: "Fused", data: fused, backgroundColor: "rgba(255,217,61,0.7)", borderRadius: 4 },
    ],
  };

  const options = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter" } } } },
    scales: {
      x: { ...CHART_DEFAULTS.scales.x },
      y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 1 },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Raw BM25 Scores</label>
          <input type="text" value={bm25Raw} onChange={(e) => setBm25Raw(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Raw Vector Scores</label>
          <input type="text" value={vecRaw} onChange={(e) => setVecRaw(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
      </div>
      <div className="mb-3">
        <label className="text-sm font-medium text-text-secondary flex justify-between">
          <span>Alpha (BM25 weight)</span>
          <span className="text-accent font-mono">{alpha.toFixed(2)}</span>
        </label>
        <input type="range" min={0} max={1} step={0.05} value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-[#6c63ff]" />
      </div>
      <div className="text-xs font-mono text-text-secondary mb-3">
        {fused.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)
          .map((s, rank) => (
            <span key={s.i} className={`mr-3 ${rank === 0 ? "text-teal-400 font-bold" : ""}`}>
              Doc {s.i + 1}: {s.v.toFixed(3)}
            </span>
          ))}
      </div>
      <div className="rounded-lg bg-[#0d0e14] p-4 border border-border">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
