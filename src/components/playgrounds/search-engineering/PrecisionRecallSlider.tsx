import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

const ITEMS = [
  { text: "Python ML tutorial with scikit-learn", relevant: true },
  { text: "Intro to deep learning with PyTorch", relevant: true },
  { text: "History of the Python language", relevant: false },
  { text: "ML algorithms explained in Python", relevant: true },
  { text: "Web development with Django", relevant: false },
  { text: "Statistical learning with Python", relevant: true },
  { text: "JavaScript frameworks comparison", relevant: false },
  { text: "Neural networks and ML pipelines", relevant: true },
];

const TOTAL_RELEVANT = ITEMS.filter((d) => d.relevant).length;

export default function PrecisionRecallSlider() {
  const [k, setK] = useState(5);

  const metrics = useMemo(() => {
    const relInK = ITEMS.slice(0, k).filter((d) => d.relevant).length;
    const p = relInK / k;
    const r = TOTAL_RELEVANT > 0 ? relInK / TOTAL_RELEVANT : 0;
    const f1 = p + r > 0 ? (2 * p * r) / (p + r) : 0;
    return { p, r, f1 };
  }, [k]);

  const chartData = useMemo(() => {
    const labels: number[] = [];
    const pVals: number[] = [];
    const rVals: number[] = [];
    const f1Vals: number[] = [];
    for (let i = 1; i <= 8; i++) {
      labels.push(i);
      const rel = ITEMS.slice(0, i).filter((d) => d.relevant).length;
      const p = rel / i;
      const r = TOTAL_RELEVANT > 0 ? rel / TOTAL_RELEVANT : 0;
      pVals.push(p);
      rVals.push(r);
      f1Vals.push(p + r > 0 ? (2 * p * r) / (p + r) : 0);
    }
    return {
      labels,
      datasets: [
        { label: "P@K", data: pVals, borderColor: CHART_COLORS.accent, backgroundColor: CHART_COLORS.accentGlow, fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2.5 },
        { label: "R@K", data: rVals, borderColor: CHART_COLORS.teal, fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2.5 },
        { label: "F1@K", data: f1Vals, borderColor: CHART_COLORS.yellow, fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2, borderDash: [6, 3] },
      ],
    };
  }, []);

  const options = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { display: true, labels: { color: CHART_COLORS.text, usePointStyle: true, pointStyle: "line" as const } } },
    scales: {
      x: { ...CHART_DEFAULTS.scales.x, title: { display: true, text: "K", color: CHART_COLORS.text } },
      y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 1.05, title: { display: true, text: "Score", color: CHART_COLORS.text } },
    },
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <label className="text-sm font-medium text-text-secondary whitespace-nowrap">
          K = <span className="text-accent font-mono">{k}</span>
        </label>
        <input type="range" min={1} max={8} step={1} value={k}
          onChange={(e) => setK(parseInt(e.target.value))}
          className="flex-1 accent-[#6c63ff]" />
      </div>
      <div className="flex gap-4 mb-3 text-xs">
        <span className="text-text-secondary">P@{k} = <span className="text-accent font-mono font-bold">{metrics.p.toFixed(3)}</span></span>
        <span className="text-text-secondary">R@{k} = <span className="text-[#00c9a7] font-mono font-bold">{metrics.r.toFixed(3)}</span></span>
        <span className="text-text-secondary">F1@{k} = <span className="text-[#ffd93d] font-mono font-bold">{metrics.f1.toFixed(3)}</span></span>
      </div>
      <div className="space-y-1 mb-4">
        {ITEMS.map((d, i) => (
          <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${
            i < k ? "bg-[#0d0e14] border-border" : "border-transparent opacity-40"
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i < k ? "bg-accent text-white" : "bg-border text-text-secondary"
            }`}>{i + 1}</span>
            <span className="flex-1 text-text-secondary">{d.text}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              d.relevant ? "bg-[#00c9a7]/15 text-[#00c9a7]" : "bg-border text-text-secondary"
            }`}>{d.relevant ? "Relevant" : "Not"}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#0d0e14] p-4 border border-border">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
