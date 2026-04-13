import { useState } from "react";

const TABS = ["Working", "Episodic", "Semantic", "Procedural", "InterAgent"] as const;
const CARD: Record<
  (typeof TABS)[number],
  { icon: string; strategies: string[]; bestFor: string }
> = {
  Working: {
    icon: "⚡",
    strategies: ["Full buffer", "Sliding window", "Summary+recent", "Token-aware"],
    bestFor: "Hot path reasoning and tool loops",
  },
  Episodic: {
    icon: "📚",
    strategies: ["Vector store", "Entity store", "Session logs", "Reflection summaries"],
    bestFor: "Recall prior sessions and user-specific facts",
  },
  Semantic: {
    icon: "🧠",
    strategies: ["RAG", "Knowledge graph", "Fine-tuned model", "Hybrid"],
    bestFor: "Grounding in docs and stable domain knowledge",
  },
  Procedural: {
    icon: "⚙️",
    strategies: ["System prompt", "Retrieval-augmented", "Learned from history"],
    bestFor: "How the agent should behave step-by-step",
  },
  InterAgent: {
    icon: "🔗",
    strategies: ["Conversation stream", "Blackboard", "Direct passing", "Scoped sharing"],
    bestFor: "Coordinating multiple specialist agents",
  },
};

export default function MemoryTypeExplorer() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Working");
  const c = CARD[tab];
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-3 space-y-3">
      <div className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-2 py-1 text-[10px] rounded border ${tab === t ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-border p-4 bg-black/25 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {c.icon}
          </span>
          <h3 className="text-sm font-semibold text-accent">{tab}</h3>
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {c.strategies.map((s) => (
            <li key={s} className="text-[11px] text-text-secondary border border-border rounded px-2 py-1.5 bg-[#0d0e14]">
              {s}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-text-secondary leading-snug">
          <span className="text-accent font-medium">Best for: </span>
          {c.bestFor}
        </p>
      </div>
    </div>
  );
}
