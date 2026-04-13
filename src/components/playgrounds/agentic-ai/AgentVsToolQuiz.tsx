import { useState, useMemo } from "react";

const SCENARIOS = [
  "Search API call",
  "Security audit with reasoning",
  "PDF to text conversion",
  "Multi-step research report",
  "Send email",
  "Negotiate meeting across calendars",
] as const;

const CORRECT: ("agent" | "tool")[] = ["tool", "agent", "tool", "agent", "tool", "agent"];

const EXPLAIN: Record<number, { agent: string; tool: string }> = {
  0: {
    tool: "Fixed HTTP call with parameters - deterministic integration.",
    agent: "Overkill unless you need retries, planning, or chained calls.",
  },
  1: {
    agent: "Needs judgment, threat modeling, and iterative reasoning.",
    tool: "A lone tool cannot substitute for analytical reasoning.",
  },
  2: {
    tool: "Format conversion pipeline - no open-ended planning.",
    agent: "Unnecessary unless extraction is ambiguous or multi-hop.",
  },
  3: {
    agent: "Planning, synthesis, and verification across sources.",
    tool: "Single-purpose utilities don't orchestrate the full workflow.",
  },
  4: {
    tool: "Template + transport - clear inputs and side effect.",
    agent: "Only if routing requires negotiation or complex policy.",
  },
  5: {
    agent: "Constraint satisfaction across people, priorities, and calendars.",
    tool: "One calendar API call is not enough for cross-party scheduling.",
  },
};

export default function AgentVsToolQuiz() {
  const [picked, setPicked] = useState<(null | "agent" | "tool")[]>(() => SCENARIOS.map(() => null));

  const score = useMemo(
    () => picked.filter((p, i) => p !== null && p === CORRECT[i]).length,
    [picked]
  );

  const answered = useMemo(() => picked.filter((p) => p !== null).length, [picked]);

  const choose = (i: number, c: "agent" | "tool") => {
    setPicked((prev) => {
      const next = [...prev];
      next[i] = c;
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-xs font-semibold text-text-secondary">Score</div>
        <div className="text-sm font-bold text-accent font-mono">{score}/6</div>
        <div className="flex-1 min-w-[120px] h-2 rounded-full bg-black/40 border border-border overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(answered / 6) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {SCENARIOS.map((s, i) => {
          const p = picked[i];
          const ok = p !== null && p === CORRECT[i];
          return (
            <div key={s} className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
              <div className="text-sm text-white">{s}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={p !== null}
                  onClick={() => choose(i, "agent")}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border border-border text-white hover:border-accent disabled:opacity-60"
                >
                  Agent
                </button>
                <button
                  type="button"
                  disabled={p !== null}
                  onClick={() => choose(i, "tool")}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border border-border text-white hover:border-accent disabled:opacity-60"
                >
                  Tool
                </button>
              </div>
              {p !== null && (
                <div
                  className={`text-xs rounded border px-2 py-1.5 ${
                    ok ? "border-emerald-500/50 text-emerald-400" : "border-red-500/50 text-red-300"
                  }`}
                >
                  {ok ? "Correct." : "Incorrect."}{" "}
                  {EXPLAIN[i][p]}
                  {!ok && (
                    <span className="text-text-secondary">
                      {" "}
                      (Expected: {CORRECT[i] === "agent" ? "Agent" : "Tool"}.)
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
