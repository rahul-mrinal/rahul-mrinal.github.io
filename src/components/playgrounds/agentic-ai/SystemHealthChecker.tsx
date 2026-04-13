import { useMemo, useState } from "react";

const ITEMS: { k: string; d: string }[] = [
  { k: "Single Responsibility", d: "Each agent owns one clear outcome." },
  { k: "Defined Interfaces", d: "Schemas and contracts between agents." },
  { k: "Graceful Failures", d: "Timeouts, retries, and safe fallbacks." },
  { k: "Minimal Shared State", d: "Avoid wide mutable blackboards." },
  { k: "Full Observability", d: "Traces, logs, and eval hooks." },
  { k: "Simplicity First", d: "Prefer fewer hops and clearer graphs." },
];

export default function SystemHealthChecker() {
  const [on, setOn] = useState<boolean[]>(() => ITEMS.map(() => false));
  const n = useMemo(() => on.filter(Boolean).length, [on]);
  const pct = Math.round((n / 6) * 100);
  const tier = n <= 2 ? "Critical" : n <= 4 ? "Needs Work" : "Healthy";
  const barColor = n <= 2 ? "bg-red-500" : n <= 4 ? "bg-yellow-400" : "bg-emerald-500";
  const rec =
    n <= 2
      ? "Prioritize interfaces, observability, and failure modes before scaling agents."
      : n <= 4
        ? "Close gaps on shared state and responsibility boundaries."
        : "Maintain reviews so complexity does not creep back in.";
  const flip = (i: number) => setOn((p) => p.map((v, j) => (j === i ? !v : v)));
  return (
    <div className="space-y-3">
      <div className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-accent font-semibold">Health</span>
          <span className="text-white font-mono">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/40 border border-border overflow-hidden">
          <div className={`h-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className={`text-xs font-bold ${n <= 2 ? "text-red-400" : n <= 4 ? "text-yellow-300" : "text-emerald-400"}`}>{tier}</div>
      </div>
      <div className="space-y-2">
        {ITEMS.map((it, i) => (
          <label key={it.k} className="flex gap-2 items-start bg-[#0d0e14] border border-border rounded-lg p-2 cursor-pointer hover:border-accent/50">
            <input type="checkbox" checked={on[i]} onChange={() => flip(i)} className="mt-0.5 accent-[#6c63ff]" />
            <span>
              <span className="text-sm text-white block">{it.k}</span>
              <span className="text-[11px] text-text-secondary">{it.d}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-white font-semibold">Summary</span>
          {n === 6 && (
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-emerald-500/50 text-emerald-400">Production Ready</span>
          )}
        </div>
        <p className="text-xs text-white">
          Status: <span className="text-accent">{tier}</span>
        </p>
        <p className="text-xs text-text-secondary">{rec}</p>
      </div>
    </div>
  );
}
