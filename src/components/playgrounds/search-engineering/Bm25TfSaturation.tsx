import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

export default function Bm25TfSaturation() {
  const [k1, setK1] = useState(1.2);

  const chartData = useMemo(() => {
    const labels: number[] = [];
    const values: number[] = [];
    for (let tf = 0; tf <= 30; tf++) {
      labels.push(tf);
      values.push(tf * (k1 + 1) / (tf + k1));
    }
    return {
      labels,
      datasets: [
        {
          label: "BM25 TF Component",
          data: values,
          borderColor: CHART_COLORS.accent,
          backgroundColor: CHART_COLORS.accentGlow,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          borderWidth: 2.5,
        },
      ],
    };
  }, [k1]);

  const options = {
    ...CHART_DEFAULTS,
    scales: {
      x: {
        ...CHART_DEFAULTS.scales.x,
        title: { display: true, text: "Raw Term Frequency", color: CHART_COLORS.text },
      },
      y: {
        ...CHART_DEFAULTS.scales.y,
        title: { display: true, text: "TF Score (saturated)", color: CHART_COLORS.text },
        min: 0,
        max: Math.max(k1 + 1.5, 3),
      },
    },
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-text-secondary whitespace-nowrap">
          k₁ = <span className="text-accent font-mono">{k1.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={k1}
          onChange={(e) => setK1(parseFloat(e.target.value))}
          className="flex-1 accent-[#6c63ff]"
        />
      </div>
      <div className="rounded-lg bg-[#0d0e14] p-4 border border-border">
        <Line data={chartData} options={options} />
      </div>
      <p className="text-xs text-text-secondary mt-2">
        Drag the slider to see how k₁ controls saturation speed. Lower k₁ = faster saturation (first occurrence matters most). Higher k₁ = slower saturation (repeated mentions still help).
      </p>
    </div>
  );
}
