import { useMemo, useState } from "react";
import "../ChartTheme";
import { Bar } from "react-chartjs-2";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

type Strat = "Voting" | "Best-of-N" | "Merge";
const AGENTS = [
  { id: "Alpha", conf: 82, text: "Use <code>async/await</code> with try/catch per boundary; centralize logging in a wrapper." },
  { id: "Beta", conf: 75, text: "Prefer <code>.catch()</code> on promises plus unhandledRejection hook for process-level safety." },
  { id: "Gamma", conf: 91, text: "Propagate typed errors, use AbortController for timeouts, and surface correlation IDs." },
] as const;

const SCORES: Record<Strat, number[]> = { Voting: [88, 71, 74], "Best-of-N": [82, 75, 91], Merge: [78, 79, 88] };
const OUT: Record<Strat, string> = {
  Voting: "Majority pattern: wrap async handlers; combine Gamma’s correlation IDs with Alpha’s boundary try/catch.",
  "Best-of-N": "Selected Gamma (highest score): typed errors + AbortController + correlation IDs for traceability.",
  Merge: "Merged: await with try/catch (Alpha), process-level rejection guard (Beta), typed errors + timeouts (Gamma).",
};

export default function EnsembleVoting() {
  const [s, setS] = useState<Strat>("Voting");
  const scores = SCORES[s];
  const win = scores.indexOf(Math.max(...scores));
  const data = useMemo(
    () => ({
      labels: AGENTS.map((a) => a.id),
      datasets: [
        {
          data: scores,
          backgroundColor: AGENTS.map((_, i) => (i === win ? CHART_COLORS.accent + "cc" : CHART_COLORS.grid)),
          borderColor: AGENTS.map((_, i) => (i === win ? CHART_COLORS.accent : CHART_COLORS.text)),
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    }),
    [scores, win]
  );
  const opts = {
    indexAxis: "y" as const,
    ...CHART_DEFAULTS,
    scales: {
      x: { ...CHART_DEFAULTS.scales.x, max: 100, beginAtZero: true },
      y: { ...CHART_DEFAULTS.scales.y, grid: { display: false } },
    },
  };

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        {AGENTS.map((a, i) => (
          <div key={a.id} className={`bg-[#0d0e14] border rounded-lg p-2 ${i === win ? "border-accent border-2" : "border-border"}`}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-semibold text-accent">{a.id}</span>
              <span className="text-text-secondary font-mono">{a.conf}%</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-snug [&_code]:text-[#54a0ff]" dangerouslySetInnerHTML={{ __html: a.text }} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {(["Voting", "Best-of-N", "Merge"] as const).map((x) => (
          <button key={x} type="button" onClick={() => setS(x)} className={`px-2 py-1 rounded text-[10px] font-semibold border ${s === x ? "bg-accent text-white border-accent" : "bg-[#0d0e14] border-border text-text-secondary"}`}>
            {x}
          </button>
        ))}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-2 text-[11px] text-text-secondary">{OUT[s]}</div>
      <div className="h-36">
        <Bar data={data} options={opts as never} />
      </div>
    </div>
  );
}
