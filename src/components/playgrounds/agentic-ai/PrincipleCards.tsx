import { useState } from "react";

const PRINCIPLES = [
  { name: "Single Responsibility", icon: "🎯", sum: "One agent, one job.", detail: "Split retrieval, reasoning, and formatting so failures are localized.", good: "Planner only outputs a task DAG.", bad: "One mega-prompt does search + math + UI." },
  { name: "Define Interfaces", icon: "🔌", sum: "Stable schemas between agents.", detail: "Contracts reduce drift when models or tools change underneath.", good: "Pydantic/TypedDict message payloads.", bad: "Unstructured prose handoffs only." },
  { name: "Fail Gracefully", icon: "🛡️", sum: "Degrade, retry, or escalate.", detail: "Tool errors should not silently poison downstream reasoning.", good: "Circuit breakers + user-visible fallbacks.", bad: "Infinite retry loops on 401s." },
  { name: "Minimize Shared State", icon: "📦", sum: "Prefer messages over globals.", detail: "Shared mutable context races under parallel tool calls.", good: "Append-only event log per run.", bad: "Global dict mutated by every node." },
  { name: "Design for Observability", icon: "📡", sum: "Trace spans per agent/tool.", detail: "You cannot tune latency you cannot see.", good: "Structured logs with run_id + node_id.", bad: "Print debugging in prod workers." },
  { name: "Start Simple", icon: "🪜", sum: "Single agent before a crew.", detail: "Complex graphs amplify cost and failure modes.", good: "Baseline single-call quality gate.", bad: "10-agent swarm day one." },
] as const;

export default function PrincipleCards() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {PRINCIPLES.map((p, i) => {
        const active = open === i;
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => setOpen(active ? null : i)}
            className={`rounded-xl border bg-[#0d0e14] p-3 text-left text-sm transition-colors ${
              active ? "border-[#6c63ff] shadow-[0_0_0_1px_#6c63ff]" : "border-border hover:border-border"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl" aria-hidden>{p.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-accent">{p.name}</div>
                <p className="mt-0.5 text-xs text-text-secondary">{p.sum}</p>
                {active && (
                  <div className="mt-2 space-y-2 border-t border-border pt-2 text-xs text-text-secondary">
                    <p>{p.detail}</p>
                    <p>
                      <span className="text-accent">Good:</span> {p.good}
                    </p>
                    <p>
                      <span className="text-red-400/90">Bad:</span> {p.bad}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
