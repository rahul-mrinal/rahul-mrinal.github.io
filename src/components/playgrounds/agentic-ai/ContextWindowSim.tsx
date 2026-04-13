import { useState, useMemo } from "react";

const CONTEXT_MAX = 128_000;
const TOKENS_PER_STEP = 6400;

function splitSteps(n: number) {
  const a = Math.ceil(n / 3);
  const rest = n - a;
  const b = Math.ceil(rest / 2);
  const c = rest - b;
  return [a, b, c];
}

function fmtK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

function heatPct(p: number) {
  if (p < 30) return "bg-emerald-500";
  if (p < 55) return "bg-yellow-500";
  if (p < 80) return "bg-orange-500";
  return "bg-red-500";
}

export default function ContextWindowSim() {
  const [steps, setSteps] = useState(8);

  const { singleTokens, agentTokens, singlePct, maxMultiPct, savingsPct, maxAgentTokens } = useMemo(() => {
    const singleTokens = steps * TOKENS_PER_STEP;
    const agentTokens = splitSteps(steps).map((s) => s * TOKENS_PER_STEP);
    const maxAgentTokens = Math.max(...agentTokens, 0);
    const singlePct = Math.min(100, (singleTokens / CONTEXT_MAX) * 100);
    const maxMultiPct = Math.min(100, (maxAgentTokens / CONTEXT_MAX) * 100);
    const savingsPct =
      singleTokens > 0
        ? Math.max(0, Math.min(100, ((singleTokens - maxAgentTokens) / singleTokens) * 100))
        : 0;
    return { singleTokens, agentTokens, singlePct, maxMultiPct, savingsPct, maxAgentTokens };
  }, [steps]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-text-secondary whitespace-nowrap">
          Steps: <span className="text-accent font-mono">{steps}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          className="flex-1 accent-[#6c63ff]"
        />
      </div>
      <div className="flex gap-4 items-end min-h-[180px]">
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="text-[10px] font-semibold text-text-secondary">Single</div>
          <div className="w-full max-w-[48px] h-40 rounded border border-border bg-black/40 overflow-hidden flex items-end">
            <div
              className={`w-full transition-all duration-300 ${heatPct(singlePct)}`}
              style={{ height: `${singlePct}%` }}
            />
          </div>
        </div>
        <div className="flex flex-1 justify-around items-end gap-2">
          {(["Agent A", "Agent B", "Agent C"] as const).map((label, i) => {
            const pct = Math.min(100, (agentTokens[i] / CONTEXT_MAX) * 100);
            return (
              <div key={label} className="flex flex-col items-center gap-1 w-1/3">
                <div className="text-[10px] font-semibold text-text-secondary text-center">{label}</div>
                <div className="w-full max-w-[40px] h-28 rounded border border-border bg-black/40 overflow-hidden flex items-end">
                  <div
                    className={`w-full transition-all duration-300 ${heatPct(pct)}`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
          <div className="text-text-secondary font-semibold">Single load</div>
          <div className="text-accent font-mono">{singlePct.toFixed(1)}%</div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
          <div className="text-text-secondary font-semibold">Max multi load</div>
          <div className="text-accent font-mono">{maxMultiPct.toFixed(1)}%</div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
          <div className="text-text-secondary font-semibold">Context savings</div>
          <div className="text-accent font-mono">{savingsPct.toFixed(1)}%</div>
        </div>
      </div>
      <div className="text-center text-xs font-mono text-accent space-y-0.5">
        <div>
          Single: {fmtK(singleTokens)} / {fmtK(CONTEXT_MAX)} tokens
        </div>
        <div className="text-text-secondary">
          Multi peak: {fmtK(maxAgentTokens)} / {fmtK(CONTEXT_MAX)} tokens
        </div>
      </div>
    </div>
  );
}
