import { useMemo, useState } from "react";

type FW = "LangGraph" | "CrewAI" | "Swarm" | "AutoGen";

const METRICS: Record<FW, { setup: string; maintenance: string; flexibility: string }> = {
  LangGraph: { setup: "2–4 d", maintenance: "Medium", flexibility: "9/10" },
  CrewAI: { setup: "0.5–1 d", maintenance: "Low", flexibility: "6/10" },
  Swarm: { setup: "< 0.5 d", maintenance: "Low", flexibility: "4/10" },
  AutoGen: { setup: "1–2 d", maintenance: "Medium", flexibility: "8/10" },
};

function pick(team: number, prod: number, learnTol: number): { fw: FW; confidence: number; reason: string } {
  if (prod >= 8) return { fw: "LangGraph", confidence: 72 + Math.min(prod - 8, 2) * 8, reason: "High production readiness need favors checkpointed graphs and deployable runtimes." };
  if (learnTol <= 3) return { fw: "CrewAI", confidence: 68 + (3 - learnTol) * 6, reason: "Low learning-curve tolerance fits role/task abstractions and batteries-included crews." };
  if (team <= 5 && learnTol >= 8) return { fw: "Swarm", confidence: 65 + Math.min(learnTol - 7, 3) * 5, reason: "Small team with high learning appetite can explore minimal handoff APIs quickly." };
  return { fw: "AutoGen", confidence: 62 + Math.min(team, 10), reason: "Balanced constraints map to flexible multi-agent chat with fast iteration." };
}

export default function FrameworkPicker() {
  const [team, setTeam] = useState(6);
  const [prod, setProd] = useState(5);
  const [learnTol, setLearnTol] = useState(6);

  const rec = useMemo(() => pick(team, prod, learnTol), [team, prod, learnTol]);
  const m = METRICS[rec.fw];

  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number, hint: string) => (
    <label className="block space-y-1">
      <div className="flex justify-between text-xs text-text-secondary">
        <span>{label}</span>
        <span className="text-accent tabular-nums">{v}</span>
      </div>
      <input type="range" min={min} max={max} value={v} onChange={(e) => set(+e.target.value)} className="w-full accent-[#6c63ff]" />
      <span className="text-[10px] text-text-secondary/80">{hint}</span>
    </label>
  );

  return (
    <div className="space-y-4 rounded-xl border border-border bg-[#0d0e14] p-4 text-sm">
      {slider("Team Size", team, setTeam, 1, 20, "1–20 developers")}
      {slider("Production Readiness Need", prod, setProd, 1, 10, "1–10")}
      {slider("Learning Curve Tolerance", learnTol, setLearnTol, 1, 10, "10 = high tolerance")}
      <div className="rounded-lg border border-[#6c63ff] p-3">
        <div className="text-xs text-text-secondary">Recommendation</div>
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-accent">{rec.fw}</span>
          <span className="rounded bg-[#6c63ff]/20 px-2 py-0.5 text-xs text-[#6c63ff]">
            {Math.min(95, Math.round(rec.confidence))}% confidence
          </span>
        </div>
        <p className="mt-2 text-xs text-text-secondary leading-relaxed">{rec.reason}</p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded border border-border p-2">
            <dt className="text-text-secondary">Setup</dt>
            <dd className="font-medium text-accent">{m.setup}</dd>
          </div>
          <div className="rounded border border-border p-2">
            <dt className="text-text-secondary">Maintenance</dt>
            <dd className="font-medium text-accent">{m.maintenance}</dd>
          </div>
          <div className="rounded border border-border p-2">
            <dt className="text-text-secondary">Flexibility</dt>
            <dd className="font-medium text-accent">{m.flexibility}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
