import { useState } from "react";

const CASES = [
  { title: "Software Dev", pattern: "Hierarchical+Debate", agents: [{ role: "Tech lead", r: "Scopes tickets" }, { role: "Implementer", r: "Patches code" }, { role: "Reviewer", r: "Challenges design" }], insight: "Debate catches API misuse before merge." },
  { title: "Customer Support", pattern: "Selector/Handoff", agents: [{ role: "Triage", r: "Classifies intent" }, { role: "Billing", r: "Refunds/charges" }, { role: "Tech", r: "Break/fix" }], insight: "Selector reduces average handle time vs monolith prompts." },
  { title: "Research", pattern: "Hierarchical+Ensemble", agents: [{ role: "Planner", r: "Splits subtopics" }, { role: "Scouts", r: "Parallel retrieval" }, { role: "Synthesizer", r: "Votes claims" }], insight: "Ensemble lowers hallucination on thin sources." },
  { title: "Financial Analysis", pattern: "Graph+Debate", agents: [{ role: "Data", r: "Pulls filings" }, { role: "Model", r: "Forecasts" }, { role: "Risk", r: "Stress-tests assumptions" }], insight: "Graph enforces review gates on material numbers." },
  { title: "Content Creation", pattern: "Sequential+Debate", agents: [{ role: "Brief", r: "Locks angle" }, { role: "Draft", r: "Writes" }, { role: "Red team", r: "Flags weak claims" }], insight: "Sequential keeps voice consistent; debate tightens facts." },
  { title: "DevOps Incident", pattern: "Graph+Hierarchical", agents: [{ role: "IC", r: "Mitigates" }, { role: "Comms", r: "Status page" }, { role: "RCA", r: "Timelines" }], insight: "Graph models escalation paths; hierarchy aligns owners." },
] as const;

export default function UseCaseCarousel() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {CASES.map((c, i) => {
        const exp = open === i;
        return (
          <div key={c.title} className="rounded-xl border border-border bg-[#0d0e14] text-sm">
            <button type="button" onClick={() => setOpen(exp ? null : i)} className="flex w-full items-start justify-between gap-2 p-3 text-left">
              <div>
                <div className="font-semibold text-accent">{c.title}</div>
                <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] text-text-secondary">{c.pattern}</span>
              </div>
              <span className="shrink-0 text-xs text-accent">{exp ? "−" : "+"}</span>
            </button>
            {exp && (
              <div className="space-y-2 border-t border-border px-3 pb-3 pt-2 text-xs">
                <ul className="space-y-1 text-text-secondary">
                  {c.agents.map((a) => (
                    <li key={a.role}>
                      <span className="text-accent font-medium">{a.role}:</span> {a.r}
                    </li>
                  ))}
                </ul>
                <p className="border-l-2 border-[#6c63ff] pl-2 text-text-secondary">
                  {c.insight}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
