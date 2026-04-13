import { useState, useMemo } from "react";
import "../ChartTheme";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

function fmt(gb: number) {
  if (gb >= 1024) return (gb / 1024).toFixed(1) + " TB";
  if (gb >= 1) return gb.toFixed(1) + " GB";
  return (gb * 1024).toFixed(0) + " MB";
}

export default function CapacityEstimator() {
  const [products, setProducts] = useState(50);
  const [qps, setQps] = useState(10000);
  const [docSize, setDocSize] = useState(5);

  const calc = useMemo(() => {
    const rawGB = (products * 1e6 * docSize * 1024) / 1024 ** 3;
    const indexGB = rawGB * 1.5;
    const replicatedGB = indexGB * 2;
    const shards = Math.ceil(indexGB / 30);
    const nodes = Math.max(3, Math.ceil((shards * 2) / 5));
    return { rawGB, indexGB, replicatedGB, shards, nodes };
  }, [products, qps, docSize]);

  const data = {
    labels: ["Raw", "Indexed (1.5×)", "Replicated (2×)"],
    datasets: [
      {
        data: [calc.rawGB, calc.indexGB, calc.replicatedGB],
        backgroundColor: [CHART_COLORS.accent + "99", CHART_COLORS.teal + "99", CHART_COLORS.yellow + "99"],
        borderColor: [CHART_COLORS.accent, CHART_COLORS.teal, CHART_COLORS.yellow],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const opts = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } },
    scales: {
      ...CHART_DEFAULTS.scales,
      y: { ...CHART_DEFAULTS.scales.y, beginAtZero: true, ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: (v: number) => fmt(v) } },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Products: <span className="text-accent font-mono">{products}M</span>
          </label>
          <input type="range" min={1} max={500} value={products} onChange={(e) => setProducts(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            QPS: <span className="text-accent font-mono">{qps.toLocaleString()}</span>
          </label>
          <input type="range" min={100} max={100000} step={100} value={qps} onChange={(e) => setQps(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Doc Size: <span className="text-accent font-mono">{docSize} KB</span>
          </label>
          <input type="range" min={1} max={50} value={docSize} onChange={(e) => setDocSize(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Storage", value: fmt(calc.rawGB), color: "text-[#6c63ff]" },
          { label: "Shards (30GB)", value: String(calc.shards), color: "text-[#00c9a7]" },
          { label: "Cluster", value: fmt(calc.replicatedGB), color: "text-[#ffd93d]" },
          { label: "Nodes (est.)", value: String(calc.nodes), color: "text-[#ff6b6b]" },
        ].map((m) => (
          <div key={m.label} className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
            <div className="text-[10px] uppercase text-text-secondary tracking-wider">{m.label}</div>
            <div className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="h-48">
        <Bar data={data} options={opts as never} />
      </div>
    </div>
  );
}
