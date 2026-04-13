import { useMemo, useState } from "react";
import "../ChartTheme";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

export default function CostCalculator() {
  const [agents, setAgents] = useState(3);
  const [rounds, setRounds] = useState(3);
  const [cpm, setCpm] = useState(5);
  const costPer = cpm / 100;
  const singleC = costPer;
  const debateC = 2 * rounds * costPer;
  const ensembleC = (agents + 1) * costPer;
  const singleL = 2;
  const debateL = 2 * rounds * 2;
  const ensembleL = 3;
  const data = useMemo(
    () => ({
      labels: ["Single", "Debate", "Ensemble"],
      datasets: [
        { label: "Cost ($)", data: [singleC, debateC, ensembleC], backgroundColor: CHART_COLORS.accent + "aa", yAxisID: "y" },
        { label: "Latency (s)", data: [singleL, debateL, ensembleL], backgroundColor: CHART_COLORS.teal + "aa", yAxisID: "y1" },
      ],
    }),
    [singleC, debateC, ensembleC, singleL, debateL, ensembleL]
  );
  const opts = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { display: true, labels: { color: CHART_COLORS.text, boxWidth: 10, font: { size: 10 } } } },
    scales: {
      x: { ...CHART_DEFAULTS.scales.x },
      y: { ...CHART_DEFAULTS.scales.y, position: "left" as const, title: { display: true, text: "Cost ($)", color: CHART_COLORS.text }, beginAtZero: true },
      y1: {
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: { color: CHART_COLORS.text },
        title: { display: true, text: "Latency (s)", color: CHART_COLORS.text },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <label className="text-[10px] text-text-secondary">
          Agents: <span className="text-accent font-mono">{agents}</span>
          <input type="range" min={1} max={5} value={agents} onChange={(e) => setAgents(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </label>
        <label className="text-[10px] text-text-secondary">
          Debate rounds: <span className="text-accent font-mono">{rounds}</span>
          <input type="range" min={1} max={5} value={rounds} onChange={(e) => setRounds(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </label>
        <label className="text-[10px] text-text-secondary">
          $/call: <span className="text-accent font-mono">${costPer.toFixed(2)}</span>
          <input type="range" min={1} max={10} value={cpm} onChange={(e) => setCpm(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </label>
      </div>
      <div className="grid md:grid-cols-3 gap-2">
        {[
          { t: "Single agent", c: singleC, l: singleL },
          { t: "Debate", c: debateC, l: debateL },
          { t: "Ensemble", c: ensembleC, l: ensembleL },
        ].map((m) => (
          <div key={m.t} className="bg-[#0d0e14] border border-border rounded-lg p-2 text-center">
            <div className="text-[9px] uppercase text-text-secondary">{m.t}</div>
            <div className="text-accent font-mono text-sm">${m.c.toFixed(2)}</div>
            <div className="text-[10px] text-text-secondary">Latency {m.l}s</div>
          </div>
        ))}
      </div>
      <div className="h-48">
        <Bar data={data} options={opts as never} />
      </div>
    </div>
  );
}
