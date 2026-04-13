import { useState, useCallback } from "react";
import { FaBrain } from "react-icons/fa";

const QUERIES = [
  { id: "faq", label: "FAQ question", agent: "FAQ" as const },
  { id: "tech", label: "Technical issue", agent: "Technical" as const },
  { id: "bill", label: "Billing problem", agent: "Billing" as const },
  { id: "esc", label: "Escalation request", agent: "Escalation" as const },
];

const RESPONSES: Record<(typeof QUERIES)[number]["agent"], string> = {
  FAQ: "Here is a link to our knowledge base article #42.",
  Technical: "Try clearing cache; if it persists, collect logs from Settings → Diagnostics.",
  Billing: "I see invoice #9081 - a credit will post within 3–5 business days.",
  Escalation: "I am creating priority ticket ESC-9912 for our specialist queue.",
};

const REASONS: Record<(typeof QUERIES)[number]["agent"], string> = {
  FAQ: "Classifier score: how-to / policy wording; low urgency; no account mutation verbs.",
  Technical: "Signals: error codes, stack traces, integration keywords; medium-high complexity.",
  Billing: "Money, invoice, refund, charge patterns matched billing intent model.",
  Escalation: "Explicit supervisor/legal/complaint cues; override to human workflow.",
};

export default function SelectorSimulator() {
  const [queryId, setQueryId] = useState(QUERIES[0].id);
  const [routing, setRouting] = useState(false);
  const [selected, setSelected] = useState<(typeof QUERIES)[number]["agent"] | null>(null);

  const route = useCallback(() => {
    if (routing) return;
    setSelected(null);
    setRouting(true);
    window.setTimeout(() => {
      const q = QUERIES.find((x) => x.id === queryId)!;
      setSelected(q.agent);
      setRouting(false);
    }, 1200);
  }, [queryId, routing]);

  return (
    <div>
      <div className="flex justify-center mb-3">
        <FaBrain
          className={`text-3xl text-accent ${routing ? "animate-pulse scale-110" : ""} transition-transform`}
          aria-hidden
        />
      </div>
      <label className="text-xs font-semibold text-text-secondary block mb-1">Query</label>
      <select
        value={queryId}
        onChange={(e) => {
          setQueryId(e.target.value);
          setSelected(null);
        }}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent accent-[#6c63ff] mb-3"
      >
        {QUERIES.map((q) => (
          <option key={q.id} value={q.id}>
            {q.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={route}
        disabled={routing}
        className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-3 w-full sm:w-auto"
      >
        Route Query
      </button>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["FAQ", "Technical", "Billing", "Escalation"] as const).map((name) => {
          const on = selected === name;
          return (
            <div
              key={name}
              className={`bg-[#0d0e14] border rounded-lg px-3 py-2 transition-colors ${
                on ? "border-[#00c9a7]" : "border-border"
              }`}
            >
              <div className="text-xs font-semibold text-text-secondary mb-1">{name}</div>
              {on && (
                <div className="text-[11px] text-text-secondary leading-snug">{RESPONSES[name]}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-text-secondary mb-1">Reasoning</div>
        <div className="text-[11px] text-text-secondary leading-relaxed">
          {selected ? REASONS[selected] : routing ? "…" : "-"}
        </div>
      </div>
    </div>
  );
}
