import { useState } from "react";

const CASES = [
  { id: "Customer Support", pat: "Selector / Handoff", why: "Dynamic routing between tiers.", conf: 0.9 },
  { id: "Code Review", pat: "Debate", why: "Adversarial pressure surfaces defects.", conf: 0.85 },
  { id: "Research Assistant", pat: "Hierarchical", why: "Manager decomposes sub-questions.", conf: 0.8 },
  { id: "Doc Processing", pat: "Sequential / Graph", why: "Fixed stages with optional branches.", conf: 0.9 },
  { id: "Incident Response", pat: "Graph + Hierarchical", why: "Deterministic triage then escalation.", conf: 0.85 },
  { id: "Creative Brainstorm", pat: "Ensemble", why: "Diverse perspectives widen ideation.", conf: 0.75 },
  { id: "Production API", pat: "Graph", why: "Explicit nodes aid auditability.", conf: 0.95 },
  { id: "Compliance Review", pat: "Debate", why: "Multiple reviewers reduce single-point bias.", conf: 0.85 },
] as const;

export default function UseCaseMatcher() {
  const [id, setId] = useState<(typeof CASES)[number]["id"]>("Customer Support");
  const u = CASES.find((c) => c.id === id)!;
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-3 space-y-3">
      <select value={id} onChange={(e) => setId(e.target.value as (typeof CASES)[number]["id"])} className="w-full text-[11px] rounded border border-border bg-black/30 text-text-secondary px-2 py-1.5 accent-[#6c63ff]">
        {CASES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.id}
          </option>
        ))}
      </select>
      <div className="rounded border border-accent/40 bg-black/25 p-3 space-y-2">
        <div className="text-sm font-semibold text-accent">{u.pat}</div>
        <p className="text-[11px] text-text-secondary">{u.why}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-text-secondary">
            <span>Confidence</span>
            <span className="text-accent font-mono">{Math.round(u.conf * 100)}%</span>
          </div>
          <div className="h-2 rounded bg-black/40 border border-border overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${u.conf * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
