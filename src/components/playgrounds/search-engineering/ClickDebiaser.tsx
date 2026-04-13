import { useState, useMemo } from "react";
import "../ChartTheme";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

function positionBias(pos: number): number {
  return 1 / Math.log2(pos + 1);
}

export default function ClickDebiaser() {
  const [rawCtrs, setRawCtrs] = useState([42, 28, 18, 12, 8, 5, 4, 3, 2, 1]);

  const debiased = useMemo(
    () => rawCtrs.map((ctr, i) => +(ctr / positionBias(i + 1)).toFixed(1)),
    [rawCtrs]
  );

  const labels = rawCtrs.map((_, i) => `Pos ${i + 1}`);
  const maxDebiased = Math.max(...debiased);

  const data = {
    labels,
    datasets: [
      {
        label: "Raw CTR %",
        data: rawCtrs,
        backgroundColor: CHART_COLORS.accent + "80",
        borderColor: CHART_COLORS.accent,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Debiased CTR %",
        data: debiased,
        backgroundColor: CHART_COLORS.teal + "80",
        borderColor: CHART_COLORS.teal,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const opts = {
    ...CHART_DEFAULTS,
    plugins: {
      ...CHART_DEFAULTS.plugins,
      legend: { display: true, labels: { color: CHART_COLORS.text, font: { size: 11 } } },
    },
    scales: {
      ...CHART_DEFAULTS.scales,
      y: { ...CHART_DEFAULTS.scales.y, beginAtZero: true },
    },
  };

  const handleSlider = (idx: number, val: number) => {
    const next = [...rawCtrs];
    next[idx] = val;
    setRawCtrs(next);
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {rawCtrs.slice(0, 5).map((v, i) => (
          <div key={i}>
            <label className="text-[10px] font-medium text-text-secondary block text-center">
              Pos {i + 1}: <span className="text-accent font-mono">{v}%</span>
            </label>
            <input type="range" min={0} max={60} value={v}
              onChange={(e) => handleSlider(i, +e.target.value)}
              className="w-full accent-[#6c63ff]" />
          </div>
        ))}
      </div>

      <div className="h-52 mb-4">
        <Bar data={data} options={opts as never} />
      </div>

      <div className="space-y-1">
        {rawCtrs.slice(0, 5).map((raw, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-2">
            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
            <span className="text-xs text-text-secondary w-16">Bias: {positionBias(i + 1).toFixed(2)}</span>
            <span className="text-xs font-mono text-[#6c63ff] w-14">Raw: {raw}%</span>
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#00c9a7] transition-all" style={{ width: `${(debiased[i] / maxDebiased) * 100}%` }} />
            </div>
            <span className="text-xs font-mono text-[#00c9a7] w-14 text-right">{debiased[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
