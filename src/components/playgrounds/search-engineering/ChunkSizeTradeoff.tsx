import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

export default function ChunkSizeTradeoff() {
  const [size, setSize] = useState(256);

  const precision = Math.round(95 * Math.exp(-0.002 * size) + 5);
  const context = Math.round(95 * (1 - Math.exp(-0.005 * size)));

  const chartData = useMemo(() => {
    const labels: number[] = [];
    const precData: number[] = [];
    const ctxData: number[] = [];
    for (let s = 32; s <= 1024; s += 32) {
      labels.push(s);
      precData.push(Math.round(95 * Math.exp(-0.002 * s) + 5));
      ctxData.push(Math.round(95 * (1 - Math.exp(-0.005 * s))));
    }
    return {
      labels,
      datasets: [
        {
          label: "Retrieval Precision (%)",
          data: precData,
          borderColor: CHART_COLORS.accent,
          backgroundColor: CHART_COLORS.accentGlow,
          fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
        },
        {
          label: "Context Preservation (%)",
          data: ctxData,
          borderColor: CHART_COLORS.teal,
          backgroundColor: "rgba(0,201,167,0.1)",
          fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
        },
      ],
    };
  }, []);

  const options = {
    ...CHART_DEFAULTS,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      ...CHART_DEFAULTS.plugins,
      legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter" } } },
    },
    scales: {
      x: { ...CHART_DEFAULTS.scales.x, title: { display: true, text: "Chunk Size (tokens)", color: CHART_COLORS.text } },
      y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 100, title: { display: true, text: "Score (%)", color: CHART_COLORS.text } },
    },
  };

  return (
    <div>
      <div className="mb-4">
        <label className="text-sm font-medium text-text-secondary flex justify-between">
          <span>Chunk Size</span>
          <span className="text-accent font-mono">{size} tokens</span>
        </label>
        <input type="range" min={32} max={1024} step={32} value={size}
          onChange={(e) => setSize(parseInt(e.target.value))} className="w-full accent-[#6c63ff]" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
          <div className="text-[10px] text-text-secondary uppercase">Retrieval Precision</div>
          <div className="text-accent font-mono font-bold text-lg">{precision}%</div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
          <div className="text-[10px] text-text-secondary uppercase">Context Preservation</div>
          <div className="text-teal-400 font-mono font-bold text-lg">{context}%</div>
        </div>
      </div>
      <div className="rounded-lg bg-[#0d0e14] p-4 border border-border">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
