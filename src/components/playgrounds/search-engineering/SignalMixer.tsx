import { useState, useMemo } from "react";
import { Radar } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS } from "../ChartTheme";

const SIGNALS = ["Keyword", "Semantic", "Popularity", "Freshness", "Quality", "Personal"];
const SIG_COLORS = ["#6c63ff", "#00c9a7", "#ffd93d", "#ff6b6b", "#54a0ff", "#f368e0"];
const PRESETS: Record<string, number[]> = {
  Balanced: [5, 5, 5, 5, 5, 5],
  "E-Commerce": [7, 4, 9, 2, 8, 7],
  News: [4, 6, 5, 10, 6, 3],
  "Knowledge Base": [8, 9, 2, 1, 9, 2],
  "Social Feed": [2, 5, 7, 8, 3, 10],
};

export default function SignalMixer() {
  const [vals, setVals] = useState([5, 5, 5, 5, 5, 5]);
  const [active, setActive] = useState("Balanced");

  const chartData = useMemo(() => ({
    labels: SIGNALS,
    datasets: [{
      label: "Signal Weights",
      data: vals,
      backgroundColor: "rgba(108,99,255,0.15)",
      borderColor: CHART_COLORS.accent,
      borderWidth: 2,
      pointBackgroundColor: SIG_COLORS,
      pointBorderColor: SIG_COLORS,
      pointRadius: 5,
    }],
  }), [vals]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        min: 0, max: 10,
        ticks: { stepSize: 2, color: "#6d7290", backdropColor: "transparent", font: { size: 9, family: "JetBrains Mono" } },
        grid: { color: "rgba(42,45,58,0.6)" },
        angleLines: { color: "rgba(42,45,58,0.6)" },
        pointLabels: { color: "#9398ab", font: { size: 11, family: "Inter", weight: "bold" as const } },
      },
    },
  };

  const total = vals.reduce((a, b) => a + b, 0) || 1;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.keys(PRESETS).map((p) => (
          <button key={p} onClick={() => { setVals([...PRESETS[p]]); setActive(p); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              active === p ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary bg-transparent hover:border-accent/50"
            }`}>{p}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-4">
        {SIGNALS.map((s, i) => (
          <div key={s}>
            <label className="text-[10px] font-medium text-text-secondary flex justify-between">
              <span>{s}</span><span className="font-mono" style={{ color: SIG_COLORS[i] }}>{vals[i]}</span>
            </label>
            <input type="range" min={0} max={10} step={1} value={vals[i]}
              onChange={(e) => { const nv = [...vals]; nv[i] = parseInt(e.target.value); setVals(nv); setActive(""); }}
              className="w-full accent-[#6c63ff]" />
          </div>
        ))}
      </div>
      <div className="max-w-sm mx-auto rounded-lg bg-[#0d0e14] p-4 border border-border mb-3">
        <Radar data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {SIGNALS.map((s, i) => (
          <div key={s} className="bg-[#0d0e14] border border-border rounded px-2 py-1.5">
            <div className="text-[9px] text-text-secondary">{s}</div>
            <div className="text-xs font-mono font-bold" style={{ color: SIG_COLORS[i] }}>
              {((vals[i] / total) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
