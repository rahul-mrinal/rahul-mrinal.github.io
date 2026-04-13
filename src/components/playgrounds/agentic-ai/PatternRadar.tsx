import { useMemo, useState } from "react";
import { Radar } from "react-chartjs-2";
import "../ChartTheme";
import { CHART_COLORS, CHART_DEFAULTS } from "../ChartTheme";

const LABELS = ["Speed", "Quality", "Cost", "Debuggability", "Flexibility"];
const PATTERNS = [
  { id: "Sequential", v: [7, 5, 9, 9, 3], c: CHART_COLORS.accent },
  { id: "Selector", v: [6, 6, 6, 7, 8], c: CHART_COLORS.teal },
  { id: "Handoff", v: [8, 5, 8, 6, 7], c: CHART_COLORS.red },
  { id: "Hierarchical", v: [5, 8, 5, 7, 6], c: CHART_COLORS.yellow },
  { id: "Debate", v: [3, 9, 3, 8, 4], c: CHART_COLORS.orange },
  { id: "Ensemble", v: [8, 8, 2, 5, 5], c: CHART_COLORS.blue },
  { id: "Graph", v: [6, 7, 7, 9, 5], c: CHART_COLORS.text },
] as const;

export default function PatternRadar() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(PATTERNS.map((p) => [p.id, true])));
  const data = useMemo(() => {
    const ds = PATTERNS.filter((p) => on[p.id]).map((p) => ({
      label: p.id,
      data: p.v,
      borderColor: p.c,
      backgroundColor: p.c + "33",
      pointBackgroundColor: p.c,
      borderWidth: 1.5,
    }));
    return { labels: LABELS, datasets: ds };
  }, [on]);
  const opts = {
    ...CHART_DEFAULTS,
    plugins: { ...CHART_DEFAULTS.plugins, legend: { display: true, labels: { color: CHART_COLORS.text, font: { size: 9 }, boxWidth: 8 } } },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { color: CHART_COLORS.text, stepSize: 2, backdropColor: "transparent" as const },
        grid: { color: CHART_COLORS.grid },
        pointLabels: { color: CHART_COLORS.text, font: { size: 9 } },
      },
    },
  };
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-2 grid md:grid-cols-3 gap-2">
      <div className="md:col-span-1 flex flex-col gap-1.5">
        {PATTERNS.map((p) => (
          <label key={p.id} className="flex items-center gap-2 text-[10px] text-text-secondary cursor-pointer">
            <input type="checkbox" checked={on[p.id]} onChange={(e) => setOn((s) => ({ ...s, [p.id]: e.target.checked }))} className="accent-[#6c63ff]" />
            <span style={{ color: p.c }}>{p.id}</span>
          </label>
        ))}
      </div>
      <div className="md:col-span-2 h-[220px]">
        <Radar data={data} options={opts} />
      </div>
    </div>
  );
}
