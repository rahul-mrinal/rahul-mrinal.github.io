import { useState } from "react";

const FRAMEWORKS = [
  {
    id: "autogen",
    name: "AutoGen",
    version: "v0.4",
    patterns: ["Sequential", "Selector"],
    readiness: 60,
    snippet: `from autogen_agentchat.agents import AssistantAgent\nagent = AssistantAgent("coder", model_client=client)`,
    bestFor: "Rapid prototyping",
  },
  {
    id: "langgraph",
    name: "LangGraph",
    version: "v1.0",
    patterns: ["Graph (all composable)"],
    readiness: 90,
    snippet: `from langgraph.graph import StateGraph\ngraph = StateGraph(State).add_node("a", fn).compile()`,
    bestFor: "Production",
  },
  {
    id: "crewai",
    name: "CrewAI",
    version: "v0.5",
    patterns: ["Sequential", "Hierarchical"],
    readiness: 55,
    snippet: `from crewai import Agent, Crew, Task\ncrew = Crew(agents=[a1, a2], tasks=[t1])`,
    bestFor: "Team simulation",
  },
  {
    id: "swarm",
    name: "Swarm",
    version: "educational",
    patterns: ["Handoff"],
    readiness: 20,
    snippet: `client = OpenAI()\nresponse = client.beta.chat.completions.parse(...)\n# handoff between agents`,
    bestFor: "Learning",
  },
] as const;

export default function FrameworkTabs() {
  const [tab, setTab] = useState(0);
  const f = FRAMEWORKS[tab];

  return (
    <div className="rounded-xl border border-border bg-[#0d0e14] p-4 text-sm">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3 mb-3">
        {FRAMEWORKS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTab(i)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              i === tab ? "border border-[#6c63ff] bg-accent/15 text-accent" : "border border-transparent text-text-secondary hover:border-border"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-accent">{f.name}</span>
          <span className="text-text-secondary">{f.version}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {f.patterns.map((p) => (
            <span key={p} className="rounded-full border border-border bg-bg-tertiary/40 px-2 py-0.5 text-xs text-text-secondary">
              {p}
            </span>
          ))}
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-text-secondary">
            <span>Production readiness</span>
            <span className="text-accent">{f.readiness}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
            <div className="h-full rounded-full bg-[#6c63ff] transition-all" style={{ width: `${f.readiness}%` }} />
          </div>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-[#0d0e14] p-3 text-xs text-text-secondary">
          <code>{f.snippet}</code>
        </pre>
        <p className="text-xs text-text-secondary">
          <span className="text-accent font-medium">Best for:</span> {f.bestFor}
        </p>
      </div>
    </div>
  );
}
